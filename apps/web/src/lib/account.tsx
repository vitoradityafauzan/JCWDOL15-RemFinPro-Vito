import { IDecodedToken, ILogin } from '@/types/accountTypes';
import { jwtDecode } from 'jwt-decode';
import { setCookie, deleteCookie } from 'cookies-next';

const createCookie = async (token: string) => {
  const oneDay = 24 * 60 * 60 * 1000;
  setCookie('cashewier-token', token, { maxAge: oneDay });
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

export const deleteToken = async (req: any, res: any) => {
  deleteCookie('cashewier-token', { req, res });
};
