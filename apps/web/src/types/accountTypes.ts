export interface ILogin {
  username: string;
  password: string;
}

export interface IDecodedToken {
  id: number;
  username: string;
  role: string;
}
