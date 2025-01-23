import { Request, Response } from 'express';
import prisma from '@/prisma';
import { Prisma } from '@prisma/client';

export class TransactionController {
  async getAllTransactions(req: Request, res: Response) {
    try {
      const orders = await prisma.order.findMany();

      res.status(200).send({
        status: 'ok',
        orders,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(401).send({
          status: 'error orders',
          msg: error.message,
        });
      } else {
        res.status(401).send({
          status: 'error orders',
          msg: error,
        });
      }
    }
  }

  async getActiveTransaction(req: Request, res: Response) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          status: 'PENDING',
        },
      });

      res.status(200).send({
        status: 'ok',
        order,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(401).send({
          status: 'error orders',
          msg: error.message,
        });
      } else {
        res.status(401).send({
          status: 'error orders',
          msg: error,
        });
      }
    }
  }

  async getOrderItems(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const orderItems = await prisma.orderItem.findFirst({
        where: {
          orderId: Number(id),
        },
        include: {
          Product: true,
        },
      });

      res.status(200).send({
        status: 'ok',
        orderItems,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(401).send({
          status: 'error orders',
          msg: error.message,
        });
      } else {
        res.status(401).send({
          status: 'error orders',
          msg: error,
        });
      }
    }
  }
}
