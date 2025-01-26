'use client';
import { ICartItems, IProductGet } from '@/types/productTypes';
import { createContext, useState, useContext, ReactNode } from 'react';

// Define the structure for our context value
interface ContextGlobalType {
  cart: ICartItems[] | null;
  addCartItemContext: (
    id: number,
    name: string,
    price: number,
    amount: number,
  ) => Promise<void>;
  updateCartItemAmountContext: (id: number, newAmount: number) => void;
  deleteCartItemContext: (id: number) => void;
  clearCartContext: () => void;
}

// Create the context with a default value
const ContextGlobal = createContext<ContextGlobalType | undefined>(undefined);

// Set Base Url Of API
const base_url = process.env.BASE_URL_API || 'http://localhost:8000/api/';

// Provider component to wrap around the application
export const ContextGlobalProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [cart, setCart] = useState<ICartItems[] | null>(null);

  const addCartItemContext = async (
    id: number,
    name: string,
    price: number,
    amount: number,
  ) => {
    let isExist = false;

    cart?.map((c) => c.id === id && (isExist = true));

    if (!isExist) {
      setCart((prevCart) =>
        prevCart
          ? [...prevCart, { id, name, price, amount }]
          : [{ id, name, price, amount }],
      );
    } else {
      alert('Product Already Added');
    }
  };

  const updateCartItemAmountContext = (id: number, newAmount: number) => {
    setCart((prevCart) =>
      prevCart
        ? prevCart.map((item) =>
            item.id === id ? { ...item, amount: newAmount } : item,
          )
        : null,
    );
  };

  const deleteCartItemContext = (id: number) => {
    setCart((prevCart) =>
      prevCart ? prevCart.filter((item) => item.id !== id) : null,
    );
  };

  const clearCartContext = () => {
    setCart(null);
  };

  return (
    <ContextGlobal.Provider
      value={{
        cart,
        addCartItemContext,
        updateCartItemAmountContext,
        deleteCartItemContext,
        clearCartContext,
      }}
    >
      {children}
    </ContextGlobal.Provider>
  );
};

// Custom hook to use the ContextGlobal
export const useContextGlobal = () => {
  const context = useContext(ContextGlobal);
  if (!context) {
    throw new Error(
      'useContextGlobal must be used within a ContextGlobalProvider',
    );
  }
  return context;
};
