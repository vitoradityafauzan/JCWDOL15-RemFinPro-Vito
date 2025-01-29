import { Request, Response } from 'express';
import prisma from '@/prisma';
import { compare, genSalt, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { accCheck } from '@/middlewares/requestValidation';

export class AccountController {
  // fetching user's data
  async getAccounts(req: Request, res: Response) {
    try {
      const accounts = await prisma.user.findMany({
        where: {
          isDeleted: false,
        },
      });

      res.status(200).send({
        status: 'ok',
        accounts,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(401).send({
          status: 'error accounts',
          msg: error.message,
        });
      } else {
        res.status(401).send({
          status: 'error accounts',
          msg: error,
        });
      }
    }
  }

  // User Account Profile Detail
  async getAccountDetail(req: Request, res: Response) {
    try {
      const userDetail = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (!userDetail) throw 'User Detail Not Found!';

      res.status(200).send({
        status: 'ok',
        user: userDetail,
        tokenDetail: req.user,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(404).send({
          status: 'error accounts',
          msg: error.message,
        });
      } else {
        res.status(404).send({
          status: 'error accounts',
          msg: error,
        });
      }
    }
  }

  // Account Registration
  async createAccount(req: Request, res: Response) {
    try {
      accCheck(req.body.username, req.body.password, req.body.role);
      // fetching user info
      const { username, password, role } = req.body;

      if (username == undefined || password == undefined || role == undefined) {
        throw 'Please Fill All Fields!';
      }

      // Checking if username has been used
      const existingUser = await prisma.user.findFirst({
        where: { username: username },
      });

      if (existingUser) throw 'Username Has Been Used !';

      // hashing password
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      // Upload user registration to database
      const account = await prisma.user.create({
        data: {
          username,
          password: hashPassword,
          role: role, // CASHIER || ADMIN
        },
      });

      // Setting login token
      const payload = {
        id: account.id,
        username: account.username,
        role: account.role,
      };
      const token = sign(payload, process.env.SECRET_JWT!, {
        expiresIn: '1d',
      });

      res.status(201).send({
        status: 'ok',
        msg: 'Account Created!',
        account,
        token,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(400).send({
          status: 'error accounts',
          msg: error.message,
        });
      } else {
        res.status(400).send({
          status: 'error accounts',
          msg: error,
        });
      }
    }
  }

  // Reguler login process
  async loginAccount(req: Request, res: Response) {
    try {
      accCheck(req.body.username, req.body.password);

      // fetching user info
      const { username, password } = req.body;

      if (username == undefined || password == undefined) {
        throw 'Please Fill All Fields!';
      }

      // Checking if username has ever been registered p1
      const existingUser = await prisma.user.findUnique({
        where: { username: username },
      });

      // Checking if username has ever been registered p2
      if (!existingUser) {
        throw 'Account Not Found!';
      }

      // Checking password validity p1
      const isPasswordValid = await compare(password, existingUser.password);

      // Checking password validity p2
      if (!isPasswordValid) {
        throw 'Incorrect Password!';
      }

      // Creating token
      const payload = {
        id: existingUser.id,
        username: existingUser.username,
        role: existingUser.role,
      };
      const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '1d' });

      res.status(200).send({
        status: 'ok',
        msg: 'Login Successfull!',
        token,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(401).send({
          status: 'error accounts',
          msg: error.message,
        });
      } else {
        res.status(401).send({
          status: 'error accounts',
          msg: error,
        });
      }
    }
  }

  // Account Registration
  async updateAccount(req: Request, res: Response) {
    try {
      accCheck(req.body.username, req.body.password, req.body.role);
      // fetching user info
      const { cashierId, username, password, role } = req.body;

      if (username == undefined || password == undefined || role == undefined) {
        throw 'Please Fill All Fields!';
      }

      // Checking if cashier actually exist
      const existingUser = await prisma.user.findFirst({
        where: { id: cashierId },
      });

      if (!existingUser) throw 'User Not Found !';

      // Checking if cashier actually exist
      const existingUsername = await prisma.user.findFirst({
        where: { username: username },
      });

      if (existingUsername && !password) throw 'Username Already Exist !';

      let updateCashier: any = { username, role };

      if (password) {
        // hashing password
        const salt = await genSalt(10);
        const hashPassword = await hash(password, salt);

        updateCashier.password = hashPassword;
      }

      // Upload user registration to database
      const account = await prisma.user.update({
        data: updateCashier,
        where: {
          id: cashierId,
        },
      });

      // Setting login token
      const payload = {
        id: account.id,
        username: account.username,
        role: account.role,
      };
      const token = sign(payload, process.env.SECRET_JWT!, {
        expiresIn: '1d',
      });

      res.status(201).send({
        status: 'ok',
        msg: 'Account Updated!',
        account,
        token,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(400).send({
          status: 'error accounts',
          msg: error.message,
        });
      } else {
        res.status(400).send({
          status: 'error accounts',
          msg: error,
        });
      }
    }
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      const { cashierId, deletedAt } = req.body;
      // Checking if cashier actually exist
      const existingUser = await prisma.user.findFirst({
        where: { id: cashierId },
      });

      if (!existingUser) throw 'User Not Found !';

      await prisma.user.update({
        where: { id: Number(cashierId) },
        data: {
          isDeleted: true,
          deletedAt,
        },
      });

      res.status(201).send({
        status: 'ok',
        msg: 'Account Hidden!',
      });
    } catch (error: any) {
      if (error.message) {
        res.status(400).send({
          status: 'error accounts',
          msg: error.message,
        });
      } else {
        res.status(400).send({
          status: 'error accounts',
          msg: error,
        });
      }
    }
  }

  async checkTokenExpiration(req: Request, res: Response) {
    res.status(200).send({
      status: 'ok',
      msg: 'token ok',
      user: req.user,
    });
  }

  async createCashierShift(req: Request, res: Response) {
    try {
      const {
        cashierId,
        CheckInTime,
        currentCashTotal,
        CheckoutTime,
        newCashTotal,
      } = req.body;

      const createShift = await prisma.cashRegisterHistory.create({
        data: {
          cashierId,
          CheckInTime,
          currentCashTotal: Number(currentCashTotal),
          CheckoutTime,
          newCashTotal: Number(newCashTotal),
        },
      });

      res.status(201).send({
        status: 'ok',
        msg: 'Shift submitted successfully',
        createShift,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(401).send({
          status: 'error accounts',
          msg: error.message,
        });
      } else {
        res.status(401).send({
          status: 'error accounts',
          msg: error,
        });
      }
    }
  }
}
