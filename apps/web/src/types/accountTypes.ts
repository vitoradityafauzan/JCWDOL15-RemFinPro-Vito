export interface ILogin {
  username: string;
  password: string;
}

export interface IDecodedToken {
  id: number;
  username: string;
  role: string;
}

export interface IAccount {
  id: number;
  username: string;
  role: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string;
}