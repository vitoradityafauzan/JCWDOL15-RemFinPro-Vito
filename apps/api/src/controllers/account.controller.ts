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
      const accounts = await prisma.user.findMany();

      res.status(200).send({
        status: 'ok',
        accounts,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(401).send({
          status: 'error get users',
          msg: error.message,
        });
      } else {
        res.status(401).send({
          status: 'error get users',
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
          status: 'Account Error',
          msg: error.message,
        });
      } else {
        res.status(404).send({
          status: 'Account Error',
          msg: error,
        });
      }
    }
  }

  // Account Registration
  async createAccount(req: Request, res: Response) {
    try {
      accCheck(req.body.email, req.body.password, req.body.role);
      // fetching user info
      const { email, password, role } = req.body;

      // Checking if email has been used
      const existingUser = await prisma.user.findFirst({
        where: { email: email },
      });

      if (existingUser) throw 'Email Has Been Used !';

      // hashing password
      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      // Upload user registration to database
      const account = await prisma.user.create({
        data: {
          email,
          userName: email.replace(/@.*$/, ''),
          password: hashPassword,
          role: role, // CASHIER || ADMIN
        },
      });

      // Setting login token
      const payload = { id: account.id };
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
          status: 'error register',
          msg: error.message,
        });
      } else {
        res.status(400).send({
          status: 'error register',
          msg: error,
        });
      }
    }
  }

  // Reguler login process
  async loginAccount(req: Request, res: Response) {
    try {
      accCheck(req.body.email, req.body.password);

      // fetching user info
      const { email, password } = req.body;

      // Checking if email has ever been registered p1
      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });

      // Checking if email has ever been registered p2
      if (!existingUser) {
        throw 'Account not found!';
      }

      // Checking password validity p1
      const isPasswordValid = await compare(password, existingUser.password);

      // Checking password validity p2
      if (!isPasswordValid) {
        throw 'incorrect password!';
      }

      // Creating token
      const payload = {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      };
      const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '1d' });

      res.status(200).send({
        status: 'ok',
        msg: 'login success!',
        token,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(401).send({
          status: 'error login',
          msg: error.message,
        });
      } else {
        res.status(401).send({
          status: 'error login',
          msg: error,
        });
      }
    }
  }
}
