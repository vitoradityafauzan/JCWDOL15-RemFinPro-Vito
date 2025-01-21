type IUser = {
  id: number;
  role: string;
};

declare namespace Express {
  export interface Request {
    user?: User;
  }
}
