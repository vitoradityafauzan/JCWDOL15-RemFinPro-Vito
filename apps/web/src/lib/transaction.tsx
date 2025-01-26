import { ICartItems, ITransactionCreate } from '@/types/productTypes';
import { getCookie } from 'cookies-next';

const base_url =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/';

// export const createTransaction = async (data: ITransactionCreate) => {
export const createTransaction = async (
  cashierId: number,
  cart: ICartItems[] | null,
  totalPrice: number,
) => {
  const token = getCookie('cashewier-token');

  if (token) {
    const res = await fetch(`${base_url}transaction/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cashierId: cashierId,
        cart: cart,
        totalPrice: totalPrice,
      }),
      // body: JSON.stringify({
      //   cashierId: data.cashierId,
      //   cart: data.cart,
      //   totalPrice: data.totalPrice,
      // }),
    });

    const result = await res.json();

    return { result };
  } else {
    return { result: { status: 'error', message: 'no token' } };
  }
};

export const getActiveTransaction = async () => {
  const token = getCookie('cashewier-token');

  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}transaction/active`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await res.json();

    return { result };
  } else {
    return { result: { status: 'error', message: 'no token' } };
  }
};

export const finalizedTransaction = async (
  orderId: number,
  payType: string,
  amount: number,
  debitCard: string,
  updatedAt: string,
) => {
  const token = getCookie('cashewier-token');

  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}transaction/finalize`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId,
          payType,
          amount,
          debitCard,
          updatedAt,
        }),
      },
    );

    const result = await res.json();

    return { result };
  } else {
    return { result: { status: 'error', message: 'no token' } };
  }
};
//orderId, payType, amount, debitCard
