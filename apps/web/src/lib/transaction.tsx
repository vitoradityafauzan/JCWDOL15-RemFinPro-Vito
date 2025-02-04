import { ICartItems, ITransactionCreate } from '@/types/productTypes';
import { getCookie } from 'cookies-next';

const base_url =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/';

export const transactionAll = async (sortOrder: string) => {
  const token = getCookie('cashewier-token');

  if (token) {
    const res = await fetch(`${base_url}transaction/all?sort=${sortOrder}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    if (result.status !== 'ok') {
      throw new Error(result.msg);
    }

    return { result };
  } else {
    return { result: { status: 'error', msg: 'no token' } };
  }
};

export const transactionAccumulatedSales = async (sortOrder: string) => {
  const res = await fetch(
    `${base_url}transaction/sales-history?sort=${sortOrder}`,
    {
      method: 'GET',
    },
  );

  const result = await res.json();

  if (result.status !== 'ok') {
    throw new Error(result.msg);
  }

  return { result };
};

export const transactionTotalItemPerDay = async () => {
  const res = await fetch(`${base_url}transaction/total-items-sold-per-day`, {
    method: 'GET',
  });

  const result = await res.json();

  if (result.status !== 'ok') {
    throw new Error(result.msg);
  }

  return { result };
};

export const transactionAbnormalPayment = async () => {
  const res = await fetch(`${base_url}transaction/order-cash-abnormalities`, {
    method: 'GET',
  });

  const result = await res.json();

  return { result };
};

export const transactionShiftAll = async () => {
  const res = await fetch(`${base_url}transaction/shift-all`, {
    method: 'GET',
  });

  const result = await res.json();

  return { result };
};

export const transactionShiftDetail = async (shiftId: number) => {
  const res = await fetch(`${base_url}transaction/shift-details/${shiftId}`, {
    method: 'GET',
  });

  const result = await res.json();

  return { result };
};

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
    return { result: { status: 'error', msg: 'no token' } };
  }
};

export const getActiveTransaction = async () => {
  const token = getCookie('cashewier-token');

  if (token) {
    const res = await fetch(`${base_url}transaction/active`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    return { result };
  } else {
    return { result: { status: 'error', msg: 'no token' } };
  }
};

export const finalizedTransaction = async (
  orderId: number,
  payType: string,
  amount: number,
  cashChange: number,
  debitCard: string,
  updatedAt: string,
) => {
  const token = getCookie('cashewier-token');

  if (token) {
    const res = await fetch(`${base_url}transaction/finalize`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderId,
        payType,
        amount,
        cashChange,
        debitCard,
        updatedAt,
      }),
    });

    const result = await res.json();

    return { result };
  } else {
    return { result: { status: 'error', msg: 'no token' } };
  }
};
//orderId, payType, amount, debitCard

export const transactionHistoryByCashier = async () => {
  const token = getCookie('cashewier-token');

  if (token) {
    const res = await fetch(`${base_url}transaction/order-detail-by-cashier`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    return { result };
  } else {
    return { result: { status: 'error', msg: 'no token' } };
  }
};

export const cancelTransaction = async () => {
  const token = getCookie('cashewier-token');

  if (token) {
    const res = await fetch(`${base_url}transaction/cancel-transaction`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    return { result };
  } else {
    return { result: { status: 'error', msg: 'no token' } };
  }
};
