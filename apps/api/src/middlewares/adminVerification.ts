import { NextFunction, Request, Response } from 'express';

export const adminVerification = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
  try {
    if (req.user.role == 'ADMIN') {
        next();
    }else {
        throw 'You are not authorized to access this route!';
    }
  } catch (err: any) {
    console.error('Error:', err); // Log the error

    if (err.message) {
      res.status(401).send({
        status: 'Account Error',
        msg: err.message,
      });
    } else {
      res.status(401).send({
        status: 'Account Error',
        msg: err,
      });
    }
  }
};
