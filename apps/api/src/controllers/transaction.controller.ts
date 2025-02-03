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
  async getActiveTransaction(req: Request, res: Response) {
    try {
      const order = await prisma.order.findFirst({
        where: {
          status: 'PENDING',
          cashierId: req.user.id,
        },
      });

      if (!order) throw 'No Active Transaction Found!';

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
      const { orderId, payType, amount, cashChange, debitCard, updatedAt } = req.body;

      const orderItems = await prisma.orderItem.findMany({
        where: {
          orderId: Number(orderId),
        },
      });

      if (payType === 'CASH') {
        const result = await prisma.$transaction(async (prisma) => {
          const updateOrder = await prisma.order.update({
            where: {
              id: Number(orderId),
            },
            data: {
              status: 'PAID',
              totalPaid: amount,
              cashChange,
              payType: 'CASH',
              updatedAt,
            },
          });

          for (const item of orderItems) {
            const stock = await prisma.stock.findFirst({
              where: {
                productId: Number(item.productId), // Use the correct field to find the stock record
              },
            });

            if (!stock) {
              throw new Error(
                `Stock not found for productId: ${item.productId}`,
              );
            }

            // Calculate the new totalStock
            const newTotalStock = stock.totalStock - item.quantity;

            await prisma.stock.updateMany({
              where: {
                id: stock.id,
              },
              data: {
                totalStock: newTotalStock,
              },
            });

            await prisma.stockHistory.create({
              data: {
                stockId: stock.id,
                adminId: req.user?.id,
                currentStock: stock.totalStock,
                flowType: 'OUT',
                itemAmount: item.quantity,
                newStock: newTotalStock,
              },
            });
          }

          return { updateOrder };
        });

        res.status(201).json({
          status: 'ok',
          msg: 'Transaction Successfull!',
          updatedOrder: result.updateOrder,
          // updatedStock: result.updatedStock,
        });
      } else {
        const result = await prisma.$transaction(async (prisma) => {
          const updateOrder = await prisma.order.update({
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

          for (const item of orderItems) {
            const stock = await prisma.stock.findFirst({
              where: {
                productId: Number(item.productId), // Use the correct field to find the stock record
              },
            });

            if (!stock) {
              throw new Error(
                `Stock not found for productId: ${item.productId}`,
              );
            }

            // Calculate the new totalStock
            const newTotalStock = stock.totalStock - item.quantity;

            await prisma.stock.updateMany({
              where: {
                id: stock.id,
              },
              data: {
                totalStock: newTotalStock,
              },
            });

            await prisma.stockHistory.create({
              data: {
                stockId: stock.id,
                adminId: req.user?.id,
                currentStock: stock.totalStock,
                flowType: 'OUT',
                itemAmount: item.quantity,
                newStock: newTotalStock,
              },
            });
          }

          return { updateOrder };
        });

        res.status(201).json({
          status: 'ok',
          msg: 'Transaction Successfull!',
          updatedOrder: result.updateOrder,
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

  async getAllTransactions(req: Request, res: Response) {
    try {
      const orders = await prisma.order.findMany();

      res.status(200).send({
        status: 'ok',
        msg: 'All transaction found',
        transactions: orders,
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

  // Fetch total accumulated transaction/order each day
  async getSalesHistory(req: Request, res: Response) {
    try {
      const { sort } = req.query;
      const orderBy = sort === 'desc' ? 'desc' : 'asc';

      // const salesHistory = await prisma.order.findMany({
      //   include: {
      //     orderItems: true,
      //     User: true,
      //   },
      //   orderBy: {
      //     createdAt: orderBy,
      //   },
      // });

      // res.status(200).send({
      //   status: 'ok',
      //   salesHistory,
      // });

      const transactions = await prisma.$queryRawUnsafe<
        { date: string; totalAmount: number; totalOrders: number }[]
      >(`
        SELECT
          Date(CONVERT_TZ(createdAt, '+00:00', '+07:00')) As date,
          SUM(totalPrice) as totalAmount,
          COUNT(id) as totalOrders
        FROM
          \`order\`
        GROUP BY
          date
        ORDER BY
          date ${orderBy};
      `);

      // Convert BigInt values to strings
      const formattedTransactions = transactions.map((transaction: any) => ({
        date: transaction.date,
        totalAmount: transaction.totalAmount.toString(),
        totalOrders: transaction.totalOrders.toString(),
      }));

      res.status(200).send({
        status: 'ok',
        transactions: formattedTransactions,
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

  // Fetch total item sold each day
  async getTotalItemsSoldPerDay(req: Request, res: Response) {
    try {
      // const itemsSold = await prisma.orderItem.groupBy({
      //   by: ['createdAt', 'productId'],
      //   _sum: {
      //     quantity: true,
      //   },
      //   orderBy: {
      //     createdAt: 'asc',
      //   },
      // });

      // const itemsSold = await prisma.order.findMany({
      //   include: {
      //     orderItems: true,
      //     User: true,
      //   },
      //   orderBy: {
      //     createdAt: 'asc',
      //   },
      // });

      const itemsSold = await prisma.$queryRawUnsafe<
        { productId: number; totalItem: number; date: string }[]
      >(`
       Select productId, Count(*) as totalItem, Date(CONVERT_TZ(createdAt, '+00:00', '+07:00')) As date From orderitem Group By productId, date;
      `);

      const formattedTransactions = itemsSold.map((transaction: any) => ({
        productId: transaction.productId.toString(),
        totalItem: transaction.totalItem.toString(),
        date: transaction.date,
      }));

      res.status(200).send({
        status: 'ok',
        transactions: formattedTransactions,
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

  // Find abnormalities between order/transaction total and newCashTotal
  async findOrderCashAbnormalities(req: Request, res: Response) {
    try {
      const abnormalities = await prisma.cashRegisterHistory.findMany({
        where: {
          isDeleted: false,
        },
        include: {
          User: true,
          // Order: true,
        },
      });

      const results = [];

      for (const shift of abnormalities) {
        const totalOrderAmount = await prisma.order.aggregate({
          _sum: {
            totalPrice: true,
            cashChange: true,
          },
          where: {
            cashierId: shift.cashierId,
            createdAt: {
              gte: shift.CheckInTime,
              lte: shift.CheckoutTime,
            },
          },
        });

        const totalOrder = totalOrderAmount._sum.totalPrice || 0;
        // const cashDifference =
        //   shift.newCashTotal - (shift.currentCashTotal + totalOrder);
        const totalCashChange = totalOrderAmount._sum.cashChange || 0;
      const cashDifference =
        shift.newCashTotal - (shift.currentCashTotal + totalOrder - totalCashChange);


        if (cashDifference !== 0) {
          results.push({
            shiftId: shift.id,
            cashier: shift.User.username,
            currentCashTotal: shift.currentCashTotal,
            totalOrder,
            newCashTotal: shift.newCashTotal,
            cashDifference,
          });
        }
      }

      res.status(200).send({
        status: 'ok',
        transactions: results,
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

  async getShiftAll(req: Request, res: Response) {
    try {
      const shifts = await prisma.cashRegisterHistory.findMany({
        include: {
          User: true,
        },
      });

      if (!shifts) throw 'Shifts data is empty';

      res.status(200).send({
        status: 'ok',
        msg: 'Shifts data fetched!',
        shifts,
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

  // Fetch detail activity based on shift
  async getShiftDetails(req: Request, res: Response) {
    try {
      const { shiftId } = req.params;

      console.log('\n\n\nAPI shift detail\n\n');
      console.log(shiftId);
      console.log('\n\n');

      const shiftDetails = await prisma.cashRegisterHistory.findFirst({
        where: { id: Number(shiftId) },
        include: {
          User: true,
        },
      });

      if (!shiftDetails) {
        return res.status(404).send({
          status: 'error',
          msg: 'Cashier not found',
        });
      }

      const transactions = await prisma.order.findMany({
        where: {
          cashierId: shiftDetails.cashierId,
          createdAt: {
            gte: shiftDetails.CheckInTime,
            lte: shiftDetails.CheckoutTime,
          },
        },
        include: {
          orderItems: true,
        },
      });

      const totalCashTransactions = transactions.filter(
        (order) => order.payType === 'CASH',
      ).length;
      const totalDebitTransactions = transactions.filter(
        (order) => order.payType === 'DEBIT',
      ).length;

      res.status(200).send({
        status: 'ok',
        shiftDetails,
        transactions,
        totalCashTransactions,
        totalDebitTransactions,
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

  // Fetch Order By Cashier
  async getOrderByCashier(req: Request, res: Response) {
    try {
      const orders = await prisma.order.findMany({
        where: {
          cashierId: req.user.id,
        },
      });

      res.status(200).send({
        status: 'ok',
        msg: 'Orders fetched successfully',
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

  //
  //
  //

  // Find abnormalities where currentCashTotal does not match newCashTotal of the last shift
  async findCashRegisterAbnormalities(req: Request, res: Response) {
    try {
      const abnormalities = await prisma.cashRegisterHistory.findMany({
        where: {
          isDeleted: false,
        },
        include: {
          User: true,
        },
        orderBy: {
          CheckInTime: 'asc',
        },
      });

      const results = [];

      for (let i = 1; i < abnormalities.length; i++) {
        const currentShift = abnormalities[i];
        const previousShift = abnormalities[i - 1];

        if (
          currentShift.cashierId === previousShift.cashierId &&
          currentShift.currentCashTotal !== previousShift.newCashTotal
        ) {
          results.push({
            shiftId: currentShift.id,
            cashier: currentShift.User.username,
            previousNewCashTotal: previousShift.newCashTotal,
            currentCashTotal: currentShift.currentCashTotal,
            difference:
              currentShift.currentCashTotal - previousShift.newCashTotal,
          });
        }
      }

      res.status(200).send({
        status: 'ok',
        results,
      });
    } catch (error: any) {
      res.status(400).send({
        status: 'error',
        msg: error.message || error,
      });
    }
  }

  async getTotalTransactionsPerDay(req: Request, res: Response) {
    try {
      const transactions = await prisma.order.groupBy({
        by: ['createdAt'],
        _sum: {
          totalPrice: true,
        },
        _count: {
          id: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      res.status(200).send({
        status: 'ok',
        transactions,
      });
    } catch (error: any) {
      res.status(400).send({
        status: 'error',
        msg: error.message || error,
      });
    }
  }

  // async finalizedTransaction(req: Request, res: Response) {
  //   try {
  //     const { orderId, payType, amount, debitCard, updatedAt } = req.body;

  //     if (payType === 'CASH') {
  //       const result = await prisma.$transaction(async (prisma) => {
  //         const updateOrder = await prisma.order.update({
  //           where: {
  //             id: Number(orderId),
  //           },
  //           data: {
  //             status: 'PAID',
  //             totalPaid: amount,
  //             payType: 'CASH',
  //             updatedAt,
  //           },
  //         });

  //         return { updateOrder };
  //       });

  //       res.status(201).json({
  //         status: 'ok',
  //         msg: 'Transaction Finalized, updating stock...',
  //         updatedOrder: result.updateOrder,
  //       });
  //     } else {
  //       const result = await prisma.$transaction(async (prisma) => {
  //         const updateOrder = await prisma.order.update({
  //           where: {
  //             id: Number(orderId),
  //           },
  //           data: {
  //             status: 'PAID',
  //             totalPaid: amount,
  //             debitCard: debitCard,
  //             payType: 'DEBIT',
  //             updatedAt,
  //           },
  //         });

  //         return { updateOrder };
  //       });

  //       res.status(201).json({
  //         status: 'ok',
  //         msg: 'Transaction Finalized, updating stock...',
  //         updatedOrder: result.updateOrder,
  //       });
  //     }
  //   } catch (error: any) {
  //     if (error.message) {
  //       res.status(400).send({
  //         status: 'error transaction',
  //         msg: error.message,
  //       });
  //     } else {
  //       res.status(400).send({
  //         status: 'error transaction',
  //         msg: error,
  //       });
  //     }
  //   }
  // }

  // async finalizedTransaction(req: Request, res: Response) {
  //   try {
  //     const { orderId, payType, amount, debitCard, updatedAt } = req.body;

  //     const orderItems = await prisma.orderItem.findMany({
  //       where: {
  //         orderId: Number(orderId),
  //       },
  //     });

  //     if (payType === 'CASH') {
  //       const result = await prisma.$transaction(async (prisma) => {
  //         const updateOrder = await prisma.order.update({
  //           where: {
  //             id: Number(orderId),
  //           },
  //           data: {
  //             status: 'PAID',
  //             totalPaid: amount,
  //             payType: 'CASH',
  //             updatedAt,
  //           },
  //         });

  //         // const orderItems = await prisma.orderItem.findMany({
  //         //   where: {
  //         //     orderId: Number(orderId),
  //         //   },
  //         // });

  //         console.log('\n\n\n\nORDER ITEMS\n\n');
  //         console.log(orderItems);
  //         console.log('\n\n\n\n');

  //         for (const item of orderItems) {
  //           const stock = await prisma.stock.findFirst({
  //             where: {
  //               productId: Number(item.productId), // Use the correct field to find the stock record
  //             },
  //           });

  //           if (!stock) {
  //             throw new Error(
  //               `Stock not found for productId: ${item.productId}`,
  //             );
  //           }

  //           // Calculate the new totalStock
  //           const newTotalStock = stock.totalStock - item.quantity;

  //           await prisma.stock.updateMany({
  //             where: {
  //               id: stock.id,
  //             },
  //             data: {
  //               totalStock: newTotalStock,
  //             },
  //           });

  //           // await prisma.stock.updateMany({
  //           //   where: {
  //           //     productId: item.productId,
  //           //   },
  //           //   data: {
  //           //     totalStock: stock.totalStock - item.quantity,
  //           //   },
  //           // });

  //           await prisma.stockHistory.create({
  //             data: {
  //               stockId: stock.id,
  //               adminId: req.user?.id,
  //               currentStock: stock.totalStock,
  //               flowType: 'OUT',
  //               itemAmount: item.quantity,
  //               newStock: newTotalStock,
  //             },
  //           });

  //           // if (stock) {
  //           //   await prisma.stock.updateMany({
  //           //     where: {
  //           //       productId: item.productId,
  //           //     },
  //           //     data: {
  //           //       totalStock: stock[0].totalStock - item.quantity,
  //           //     },
  //           //   });

  //           //   await prisma.stockHistory.create({
  //           //     data: {
  //           //       stockId: item.orderId,
  //           //       adminId: req.user?.id,
  //           //       currentStock: stock[0].totalStock,
  //           //       flowType: 'OUT',
  //           //       itemAmount: item.quantity,
  //           //       newStock: stock[0].totalStock - item.quantity,
  //           //     },
  //           //   });
  //           // } else {
  //           //   throw new Error('Stock not found');
  //           // }
  //         }

  //         // const updatedStock = Promise.all(
  //         //   orderItems.map(async (item) => {
  //         //     console.log('\n\nProduct ID, ', item.productId, '\n\n\n');
  //         //     const stock = await prisma.stock.findMany({
  //         //       where: {
  //         //         productId: Number(item.productId), // Use the correct field to find the stock record
  //         //       },
  //         //     });
  //         //     // const stock: any = await prisma.$queryRawUnsafe(
  //         //     //   `Select * From stock Where product_id = ${item.productId}`,
  //         //     // );
  //         //     if (stock) {
  //         //       await prisma.stock.updateMany({
  //         //         where: {
  //         //           productId: item.productId,
  //         //         },
  //         //         data: {
  //         //           totalStock: stock[0].totalStock - item.quantity,
  //         //         },
  //         //       });

  //         //       await prisma.stockHistory.create({
  //         //         data: {
  //         //           stockId: item.orderId,
  //         //           adminId: req.user?.id,
  //         //           currentStock: stock[0].totalStock,
  //         //           flowType: 'OUT',
  //         //           itemAmount: item.quantity,
  //         //           newStock: stock[0].totalStock - item.quantity,
  //         //         },
  //         //       });
  //         //     } else {
  //         //       throw new Error('Stock not found');
  //         //     }
  //         //   }),
  //         // );

  //         // return { updateOrder, updatedStock };
  //         return { updateOrder };
  //       });

  //       res.status(201).json({
  //         status: 'ok',
  //         msg: 'Transaction Successfull!',
  //         updatedOrder: result.updateOrder,
  //         // updatedStock: result.updatedStock,
  //       });
  //     } else {
  //       const result = await prisma.$transaction(async (prisma) => {
  //         const updateOrder = await prisma.order.update({
  //           where: {
  //             id: Number(orderId),
  //           },
  //           data: {
  //             status: 'PAID',
  //             totalPaid: amount,
  //             debitCard: debitCard,
  //             payType: 'DEBIT',
  //             updatedAt,
  //           },
  //         });

  //         // const orderItems = await prisma.orderItem.findMany({
  //         //   where: {
  //         //     orderId: Number(orderId),
  //         //   },
  //         // });

  //         const updatedStock = Promise.all(
  //           orderItems.map(async (item) => {
  //             // const stock = await prisma.stock.findFirst({
  //             //   where: {
  //             //     productId: Number(item.productId),
  //             //   },
  //             // });
  //             const stock: any = await prisma.$queryRawUnsafe(
  //               `Select * From stock Where product_id = ${item.productId}`,
  //             );

  //             if (stock) {
  //               await prisma.stock.updateMany({
  //                 where: {
  //                   productId: item.productId,
  //                 },
  //                 data: {
  //                   totalStock: stock.totalStock - item.quantity,
  //                 },
  //               });

  //               await prisma.stockHistory.create({
  //                 data: {
  //                   stockId: item.orderId,
  //                   adminId: req.user?.id,
  //                   currentStock: stock.totalStock,
  //                   flowType: 'OUT',
  //                   itemAmount: item.quantity,
  //                   newStock: stock.totalStock - item.quantity,
  //                 },
  //               });
  //             } else {
  //               throw new Error('Stock not found');
  //             }
  //           }),
  //         );

  //         return { updateOrder, updatedStock };
  //       });

  //       res.status(201).json({
  //         status: 'ok',
  //         msg: 'Transaction Successfull!',
  //         updatedOrder: result.updateOrder,
  //         updatedStock: result.updatedStock,
  //       });
  //     }
  //   } catch (error: any) {
  //     if (error.message) {
  //       res.status(400).send({
  //         status: 'error transaction',
  //         msg: error.message,
  //       });
  //     } else {
  //       res.status(400).send({
  //         status: 'error transaction',
  //         msg: error,
  //       });
  //     }
  //   }
  // }
}
