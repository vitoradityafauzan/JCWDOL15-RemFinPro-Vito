'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CartItem } from './CartItem';
import { ICart, ICartItems } from '@/types/productTypes';
import { useContextGlobal } from '@/global-context/contextProvider';
import debounce from 'lodash.debounce';
import { currencyFormat } from '@/app/utils/currencyFormat';
import { getUserIdFromToken } from '@/lib/account';
import { simpleSwal, toastSwal } from '@/app/utils/swalHelper';
import { createTransaction } from '@/lib/transaction';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';

// interface CartProps {
//   cart: ICartItems[];
// }

// export const Cart: React.FC<CartProps> = ({ cart }) => {
export const Cart: React.FC = () => {
  const router = useRouter();
  // const [cartItems, setCartItems] = useState<ICartItems[]>(cart);
  const { cart, updateCartItemAmountContext, clearCartContext } =
    useContextGlobal();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (cart) {
      const newTotal = cart.reduce(
        (acc, item) => acc + item.price * item.amount,
        0,
      );
      setTotal(newTotal);
    }
  }, [cart, total]);

  const cartItemAmountDebounce = useCallback(
    debounce((id: number, newAmount: number) => {
      updateCartItemAmountContext(id, newAmount);
    }, 300),
    [],
  );

  const handleInputChange = (id: number, value: string) => {
    const newAmount = parseInt(value, 10);
    if (!isNaN(newAmount)) {
      cartItemAmountDebounce(id, newAmount);
    }
  };

  const clearCart = async () => {
    clearCartContext;
    setTotal(0);
  };

  const handleCartSubmit = async () => {
    try {
      const checkInCookie = getCookie('cashewier-cashiercheckin');

      if (checkInCookie == null || !checkInCookie)
        throw 'Please Check In Before Proceed With The Transaction!';

      const { userId } = await getUserIdFromToken();

      if (typeof userId !== 'number' || userId <= 0) {
        throw toastSwal('error', 'User ID not found');
      }

      const { result } = await createTransaction(userId, cart, total);

      if (result.status !== 'ok') {
        throw result.msg;
      }

      await clearCart;

      router.push('/transaction');

      simpleSwal('success', `${result.msg}`);
    } catch (error: any) {
      toastSwal('error', `${error}`);
    }
  };

  // const handleCartSubmit = async () => {
  //   const { userId } = await getUserIdFromToken();

  //   if (userId && typeof userId === 'number' && userId > 0) {
  //     const { result } = await createTransaction(userId, cart, total);

  //     if (result.status !== 'ok') {
  //       toastSwal('error', `${result.msg}`);
  //     } else {
  //       router.push('/transaction');

  //       simpleSwal('success', `${result.msg}`);
  //     }
  //   } else {
  //     toastSwal('error', 'User ID not found');
  //   }
  // };

  return (
    <div className="col-span-1 flex flex-col sticky top-4 h-[35rem] gap-7 p-4 justify-between bg-zinc-50 border-8 border-accent rounded-lg">
      <div className="basis 5/6 flex flex-col flex-wrap gap-8">
        <div className="h-fit">
          <h1 className="text-xl text-center ">Current Cart</h1>
        </div>
        {/* Cart content */}
        <div className="flex flex-col gap-5 overflow-y-auto h-56">
          {/* <CartItem
            id={1}
            name="Chitato Barbeque Anniversary Edition"
            price={12000}
            amount={1}
          />  */}
          {/* {cartItems &&
            cartItems.map((c) => (
              <CartItem
                key={c.id}
                id={c.id}
                name={c.name}
                price={c.price}
                amount={c.amount}
              />
            ))}*/}
          {/* {cart ? (
            cart?.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                amount={item.amount}
              />
            ))
          ) : (
            <h1>Cart Is Empty, Go Ahead And Add A Product Here</h1>
          )} */}
          {cart ? (
            cart?.map((item) => (
              <div
                className="flex flex-col justify-between items-center gap-2"
                key={item.id}
              >
                <div className="border-0 basis-4/6">
                  <h1>{item.name}</h1>
                </div>
                <div className="basis-2/6 flex gap-3 items-center">
                  <div className="basis-3/6">
                    <h2 className="text-zinc-400">
                      {currencyFormat(item.price)}
                    </h2>
                  </div>
                  <div className="basis-3/6">
                    <input
                      type="number"
                      placeholder="amount"
                      value={item.amount}
                      onChange={(e) =>
                        handleInputChange(item.id, e.target.value)
                      }
                      className="input input-bordered input-accent input-sm w-full max-w-xs text-sm"
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h1 className="text-sm text-slate-500/70 text-center">
              Cart Is Empty, Go Ahead And Add A Product Here
            </h1>
          )}
        </div>
      </div>

      {/* Cart total priices */}
      <div className="basis-1/6 flex flex-col gap-4 justify-between border-0">
        <div className="flex justify-between">
          <h1>Total</h1>
          {total > 0 ? <h2>{currencyFormat(total)}</h2> : <h2>price here</h2>}
        </div>
        <button
          className="btn btn-outline btn-success"
          onClick={handleCartSubmit}
        >
          Proceed To Payment
        </button>
        <button
          className="btn btn-outline btn-error"
          onClick={clearCartContext}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};
