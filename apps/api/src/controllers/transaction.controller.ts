import { Request, Response } from 'express';
import prisma from '@/prisma';
import { Prisma } from '@prisma/client';

interface ICart {
  id: number;
  name: string;
  price: number;
  amount: number;
}

export class TransactionController {
  async getAllTransactions(req: Request, res: Response) {
    try {
      const orders = await prisma.order.findMany();

      res.status(200).send({
        status: 'ok',
        msg: 'All transaction found',
        orders,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(401).send({
          status: 'error transaction',
          msg: error.message,
        });
      } else {
        res.status(401).send({
          status: 'error transaction',
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
          cashierId: req.user.id,
        },
      });

      const orderItems = await prisma.orderItem.findMany({
        where: {
          orderId: order?.id,
        },
        include: {
          Product: true,
        },
      });

      res.status(200).send({
        status: 'ok',
        msg: 'Active transaction found',
        order,
        orderItems,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(401).send({
          status: 'error transaction',
          msg: error.message,
        });
      } else {
        res.status(401).send({
          status: 'error transaction',
          msg: error,
        });
      }
    }
  }

  async getOrderItems(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const orderItems = await prisma.orderItem.findMany({
        where: {
          orderId: Number(id),
        },
        include: {
          Product: true,
        },
      });

      res.status(200).send({
        status: 'ok',
        msg: 'Order items found',
        orderItems,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(401).send({
          status: 'error transaction',
          msg: error.message,
        });
      } else {
        res.status(401).send({
          status: 'error transaction',
          msg: error,
        });
      }
    }
  }

  async createTransaction(req: Request, res: Response) {
    try {
      const cashierId: number = req.body.cashierId;
      const cart: ICart[] = req.body.cart;
      const totalPrice: number = req.body.totalPrice;

      const result = await prisma.$transaction(async (prisma) => {
        // Create a new order
        const newOrder = await prisma.order.create({
          data: {
            cashierId,
            totalItems: cart.length,
            payType: 'CASH',
            totalPrice,
          },
        });

        // Get the id of the newly created order
        const orderId = newOrder.id;

        // Create the order items
        const orderItems = await Promise.all(
          cart.map((c) =>
            prisma.orderItem.create({
              data: {
                orderId: orderId,
                productId: c.id,
                price: c.price,
                quantity: c.amount,
                totalPrice: c.price * c.amount,
              },
            }),
          ),
        );

        return { newOrder, orderItems };
      });

      console.log('\n\nAPI - Transaction Create, success\n');
      console.log(result.newOrder);
      console.log('\n\n');

      res.status(201).json({
        status: 'ok',
        msg: 'Transaction Process Created! Please Continue',
        order: result.newOrder,
        orderItems: result.orderItems,
      });
    } catch (error: any) {
      console.log('\n\nAPI - Transaction Create, error\n');
      console.log(error);
      if (error.message) {
        res.status(400).send({
          status: 'error transaction',
          msg: error.message,
        });
      } else {
        res.status(400).send({
          status: 'error transaction',
          msg: error,
        });
      }
    } finally {
      await prisma.$disconnect();
    }
  }

  async finalizedTransaction(req: Request, res: Response) {
    try {
      const { orderId, payType, amount, debitCard, updatedAt } = req.body;

      if (payType === 'CASH') {
        await prisma.order.update({
          where: {
            id: Number(orderId),
          },
          data: {
            status: 'PAID',
            totalPaid: amount,
            payType: 'CASH',
            updatedAt,
          },
        });

        res.status(201).json({
          status: 'ok',
          msg: 'Transaction Successfull!',
        });
      } else {
        await prisma.order.update({
          where: {
            id: Number(orderId),
          },
          data: {
            status: 'PAID',
            totalPaid: amount,
            debitCard: debitCard,
            payType: 'DEBIT',
            updatedAt,
          },
        });

        res.status(201).json({
          status: 'ok',
          msg: 'Transaction Successfull!',
        });
      }
    } catch (error: any) {
      if (error.message) {
        res.status(400).send({
          status: 'error transaction',
          msg: error.message,
        });
      } else {
        res.status(400).send({
          status: 'error transaction',
          msg: error,
        });
      }
    }
  }
}
