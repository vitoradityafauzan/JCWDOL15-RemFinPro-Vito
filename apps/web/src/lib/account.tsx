import { IDecodedToken, ILogin } from '@/types/accountTypes';
import { jwtDecode } from 'jwt-decode';

export const login = async (data: ILogin) => {
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
    // Decode the token to get user info
    const decodedToken: IDecodedToken = jwtDecode<IDecodedToken>(res2.token);

    return {
      result: {
        status: 'ok',
        user: decodedToken,
        token: res2.token,
      },
    };
  } else {
    return { result: res2 };
  }
};
