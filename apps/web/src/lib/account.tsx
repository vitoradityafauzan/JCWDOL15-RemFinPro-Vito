import { IDecodedToken, ILogin } from '@/types/accountTypes';
import { jwtDecode } from 'jwt-decode';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';

const createCookie = async (token: string) => {
  const oneDay = 24 * 60 * 60 * 1000;
  setCookie('cashewier-token', token, { maxAge: oneDay });
};

export const checkTokenExpiration = async () => {
  const token = getCookie('cashewier-token');

  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}account/check-token`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await res.json();

    return { result };
  } else {
    console.log('\n\n\nNO TOKEN\n\n\n');
    return { result: { status: 'error', msg: 'no token' } };
  }
};

export const checkTokenExpirationAdmins = async () => {
  const token = getCookie('cashewier-token');

  if (token) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}account/check-token-admin`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const result = await res.json();

    return { result };
  } else {
    console.log('\n\n\nNO TOKEN\n\n\n');
    return { result: { status: 'error', msg: 'no token' } };
  }
};

export const login = async (data: ILogin) => {
  console.log('Log Act, data form, \n');
  console.log(data);
  console.log('\n');

  // Send data as JSON
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_API_URL}account/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }),
    },
  );

  const res2 = await res.json();

  if (res2.status == 'ok') {
    console.log('Log Act, token from api, \n');
    console.log(res2.token);
    console.log('\n');

    await createCookie(res2.token);

    // Decode the token to get user info
    const decodedToken: IDecodedToken = jwtDecode<IDecodedToken>(res2.token);

    return {
      result: {
        status: 'ok',
        msg: res2.msg,
        user: decodedToken,
        token: res2.token,
      },
    };
  } else {
    return { result: res2 };
  }

  // const result = await res.json();

  // if (result.status == 'ok') {
  //   createCookie(result.token);

  //   return { result };
  // } else {
  //   throw new Error(result.msg);
  // }
};

export const getUserIdFromToken = async () => {
  const token = getCookie('cashewier-token');

  if (token) {
    const decodedToken: IDecodedToken = jwtDecode<IDecodedToken>(
      token as string,
    );
    return { userId: decodedToken.id };
  } else {
    return { userId: 0 };
  }
};

export const cashierCheckIn = async (
  userId: number,
  cashAmount: number,
  formattedDateTime: string,
) => {
  setCookie(
    'cashewier-cashiercheckin',
    JSON.stringify({ userId, cashAmount, formattedDateTime }),
  );
};

export const cashierCheckOut = async (
  newCashTotal: number,
  checkOutTime: string,
) => {
  const token = getCookie('cashewier-token');

  if (token) {
    const checkInCookie = getCookie('cashewier-cashiercheckin');

    if (checkInCookie) {
      const newCookie = JSON.parse(checkInCookie as string);

      // const shiftOutTime = new Date();

      // // Format the date and time in ISO 8601 format
      // const formatShiftOutTime = shiftOutTime.toISOString();

      // Send data as JSON
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}account/submit-shift`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            cashierId: newCookie.userId,
            CheckInTime: newCookie.formattedDateTime,
            currentCashTotal: newCookie.cashAmount,
            CheckoutTime: checkOutTime,
            newCashTotal,
          }),
        },
      );

      const result = await res.json();

      return { result };
    } else {
      return {
        result: { status: 'error account', msg: 'Shift Data Not Found!' },
      };
    }
  } else {
    return {
      result: { status: 'error account', msg: 'Invalid/Expired Session!' },
    };
  }
};

const base_url =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/';

export const fetchCashiers = async () => {
  const token = getCookie('cashewier-token');

  if (token) {
    const res = await fetch(`${base_url}account/fetch-all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return {
      result: {
        status: 'ok',
        msg: 'Cashiers Data Fetched',
        accounts: data.accounts.filter(
          (account: { role: string }) => account.role === 'CASHIER',
        ),
      },
    };
  } else {
    console.log('\n\n\nNO TOKEN\n\n\n');
    return { result: { status: 'error', msg: 'no token' } };
  }
};

export const addCashier = async (data: ILogin) => {
  const res = await fetch(`${base_url}account/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: data.username,
      password: data.password,
      role: 'CASHIER',
    }),
  });
  const result = await res.json();
  return { result };
  // return result.account;
};

export const updateCashier = async (id: number, data: ILogin) => {
  const token = getCookie('cashewier-token');

  if (token) {
    const res = await fetch(`${base_url}account/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cashierId: id,
        username: data.username,
        password: data.password ? data.password : '',
        role: 'CASHIER',
      }),
    });
    const result = await res.json();
    return { result };
  } else {
    console.log('\n\n\nNO TOKEN\n\n\n');
    return { result: { status: 'error', msg: 'no token' } };
  }
};

export const deleteCashier = async (id: number) => {
  const token = getCookie('cashewier-token');

  if (token) {
    const deletedTime = new Date();   
    const deletedAt = deletedTime.toISOString();

    const res = await fetch(`${base_url}account/delete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cashierId: id,
        deletedAt,
      }),
    });

    const result = await res.json();

    return { result };
  } else {
    console.log('\n\n\nNO TOKEN\n\n\n');
    return { result: { status: 'error', msg: 'no token' } };
  }
};
