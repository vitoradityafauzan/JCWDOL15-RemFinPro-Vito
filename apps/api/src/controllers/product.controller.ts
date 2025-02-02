import { Request, Response } from 'express';
import prisma from '@/prisma';
import { Prisma } from '@prisma/client';
import { log } from 'console';

export class ProductController {
  // async getProducts(req: Request, res: Response) {
  //   try {
  //     const { name, categoryIds, page = 1, pageSize = 10 } = req.query;
  //     const skip = (Number(page) - 1) * Number(pageSize);
  //     const take = Number(pageSize);

  //     const whereFilter = {
  //       AND: [{ productName: { contains: name as string } }],
  //     } as any;

  //     const modifiedCategoryIds = Array.isArray(categoryIds)
  //       ? categoryIds
  //       : categoryIds
  //         ? [categoryIds]
  //         : [];

  //     if (modifiedCategoryIds && modifiedCategoryIds.length > 0) {
  //       whereFilter.AND.push({
  //         categoryId: { in: modifiedCategoryIds.map((id) => Number(id)) },
  //       });
  //     }

  //     const [products, total] = await prisma.$transaction([
  //       prisma.product.findMany({
  //         where: whereFilter,
  //         include: {
  //           Category: true,
  //         },
  //         skip,
  //         take,
  //       }),
  //       prisma.product.count({
  //         where: whereFilter,
  //       }),
  //     ]);

  //     res.status(200).json({ products, total });
  //   } catch (err) {
  //     res.status(400).send({
  //       status: 'error',
  //       msg: err,
  //     });
  //   }
  // }

  async getProducts(req: Request, res: Response) {
    try {
      const { search } = req.query;

      const filterCategory = req.query.category as string | undefined;
      const category = filterCategory
        ? parseInt(filterCategory, 10)
        : undefined;

      let filter: Prisma.ProductWhereInput = {};

      if (search) {
        filter.productName = { contains: search as string };
      }

      if (category || category != undefined) {
        filter.categoryId = category;
      }

      const products = await prisma.product.findMany({
        where: filter,
        include: {
          Category: true,
          Stock: true,
          // Stock: {
          //   select: {
          //     totalStock: true,
          //   },
          // },
        },
      });

      res.status(200).send({
        status: 'ok',
        msg: 'Products Fetched!',
        products,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(400).send({
          status: 'error products',
          msg: error.message,
        });
      } else {
        res.status(400).send({
          status: 'error products',
          msg: error,
        });
      }
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: {
          Category: true,
          Stock: true,
        },
      });

      if (!product) {
        throw 'Product not found';
      }

      res.status(200).send({
        status: 'ok',
        msg: 'Product detail fetched',
        product,
      });

      // const currentStock = await prisma.stock.findFirst({
      //   select: {
      //     totalStock: true,
      //   },
      //   where: {
      //     productId: product.id,
      //   },
      // });

      // res.status(200).send({
      //   status: 'ok',
      //   msg: 'Product detail fetched',
      //   product,
      //   stock: currentStock?.totalStock,
      // });
    } catch (error: any) {
      if (error.message) {
        res.status(400).send({
          status: 'error products',
          msg: error.message,
        });
      } else {
        res.status(400).send({
          status: 'error products',
          msg: error,
        });
      }
    }
  }

  async getCategories(req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany();

      res.status(200).send({
        status: 'ok',
        categories,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(400).send({
          status: 'error categories',
          msg: error.message,
        });
      } else {
        res.status(400).send({
          status: 'error categories',
          msg: error,
        });
      }
    }
  }

  async getCategoryId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const categories = await prisma.category.findUnique({
        where: {
          id: Number(id),
        },
      });

      res.status(200).send({
        status: 'ok',
        categories,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(400).send({
          status: 'error categories',
          msg: error.message,
        });
      } else {
        res.status(400).send({
          status: 'error categories',
          msg: error,
        });
      }
    }
  }

  /*
  id: number,
    name: string,
    price: number,
    amount: number,
  
  */

  async updateStock(req: Request, res: Response) {
    try {
      const { productId, flowType, amount } = req.body;

      console.log('\n\n\nAPI Update Stock, ', productId, '\n\n\n');
      

      const productStock = await prisma.stock.findFirst({
        where: {
          productId: Number(productId),
        },
      });

      if (!productStock) throw 'Product Didnt Exist';

      if (flowType === 'IN') {
        const updateStock = await prisma.stock.updateMany({
          data: {
            totalStock: productStock.totalStock + Number(amount),
          },
          where: {
            productId: Number(productId),
          },
        });

        const addHistory = await prisma.stockHistory.create({
          data: {
            stockId: productStock.id,
            adminId: req.user.id,
            currentStock: productStock.totalStock,
            flowType: 'IN',
            itemAmount: Number(amount),
            newStock: productStock.totalStock + Number(amount),
          },
        });
      } else {
        if (Number(amount) > productStock.totalStock) throw 'Amount Exceeded!';

        const updateStock = await prisma.stock.updateMany({
          data: {
            totalStock: productStock.totalStock - Number(amount),
          },
          where: {
            productId: Number(productId),
          },
        });

        const addHistory = await prisma.stockHistory.create({
          data: {
            stockId: productStock.id,
            adminId: req.user.id,
            currentStock: productStock.totalStock,
            flowType: 'OUT',
            itemAmount: Number(amount),
            newStock: productStock.totalStock - Number(amount),
          },
        });
      }

      res.status(201).send({
        status: 'ok',
        msg: 'Stock Updated Successfully',
      });
    } catch (error: any) {
      if (error.message) {
        res.status(400).send({
          status: 'error products',
          msg: error.message,
        });
      } else {
        res.status(400).send({
          status: 'error products',
          msg: error,
        });
      }
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      // console.log('\n\n\nCreate Product API\n\n\n');

      const port = process.env.PORT;

      const { productId, productName, price, categoryId } = req.body;

      const product = await prisma.product.findUnique({
        where: {
          id: Number(productId),
        },
      });

      if (!product) throw 'Product Not Exist!';

      if (req.file) {
        const link = `http://localhost:${port}/api/public/products/${req?.file?.filename}`;

        const updateProduct = await prisma.product.update({
          data: {
            productName,
            price: Number(price),
            categoryId: Number(categoryId),
            imageUrls: link,
          },
          where: {
            id: Number(productId),
          },
        });

        console.log('\n\nssss');
        console.log(updateProduct);
        console.log('\n\n\n');

        const newProduct = await prisma.product.findUnique({
          where: {
            id: Number(productId),
          },
          include: {
            Category: true,
            Stock: true,
          },
        });

        res.status(201).send({
          status: 'ok',
          msg: 'Product Successfully Updated',
          product: newProduct,
        });
      } else {
        const updateProduct = await prisma.product.update({
          data: {
            productName,
            price: Number(price),
            categoryId: Number(categoryId),
          },
          where: {
            id: Number(productId),
          },
        });

        const newProduct = await prisma.product.findUnique({
          where: {
            id: Number(productId),
          },
          include: {
            Category: true,
            Stock: true,
          },
        });

        res.status(201).send({
          status: 'ok',
          msg: 'Product Successfully Updated',
          product: newProduct,
        });
      }

      //
      //
      //
    } catch (error: any) {
      if (error.message) {
        res.status(400).send({
          status: 'error products',
          msg: error.message,
        });
      } else {
        res.status(400).send({
          status: 'error products',
          msg: error,
        });
      }
    }
  }

  async createProduct(req: Request, res: Response) {
    try {
      console.log('\n\n\nCreate Product API\n\n\n');

      const port = process.env.PORT;

      let link = null;

      if (req.file) {
        link = `http://localhost:${port}/api/public/products/${req?.file?.filename}`;
      }

      const { productName, price, categoryId, stockAmount } = req.body;

      const result = await prisma.$transaction(async (prisma) => {
        const createProduct = await prisma.product.create({
          data: {
            productName,
            price: Number(price),
            categoryId: Number(categoryId),
            imageUrls: link,
          },
        });

        const createStock = await prisma.stock.create({
          data: {
            productId: createProduct.id,
            totalStock: Number(stockAmount),
          },
        });

        const createStockHistory = await prisma.stockHistory.create({
          data: {
            stockId: Number(createStock.id),
            adminId: req.user.id,
            currentStock: Number(stockAmount),
            flowType: 'IN',
            itemAmount: Number(stockAmount),
            newStock: Number(stockAmount),
          },
        });

        return { createProduct, createStock, createStockHistory };
      });

      res.status(201).send({
        status: 'ok',
        msg: 'Product Successfully Created',
        data: result.createProduct,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(400).send({
          status: 'error products',
          msg: error.message,
        });
      } else {
        res.status(400).send({
          status: 'error products',
          msg: error,
        });
      }
    }
  }

  async getStockHistory(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const stock = await prisma.stock.findFirst({
        where: {
          productId: Number(id),
        },
        select: {
          id: true,
        },
      });

      const stockHistory = await prisma.stockHistory.findMany({
        where: {
          stockId: stock?.id,
        },
      });

      res.status(200).send({
        status: 'ok',
        msg: 'Stock history fetched',
        stockHistory,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(400).send({
          status: 'error products',
          msg: error.message,
        });
      } else {
        res.status(400).send({
          status: 'error products',
          msg: error,
        });
      }
    }
  }
}

//
//
//

/*

async updateProduct(req: Request, res: Response) {
    try {
      console.log('\n\n\nCreate Product API\n\n\n');

      const port = process.env.PORT;

      const { productName, price, categoryId, stockAmount } = req.body;

      const oldProduct = await prisma.product.findUnique({
        where: {
          productName: productName,
        },
        include: {
          Stock: {
            select: {
              totalStock: true,
            },
          },
          Category: {
            select: {
              id: true,
            },
          },
        },
      });

      if (req.file) {
        const link = `http://localhost:${port}/api/public/products/${req?.file?.filename}`;

        if (stockAmount !== oldProduct?.Stock[0].totalStock) {
          const result = await prisma.$transaction(async (prisma) => {
            const createProduct = await prisma.product.create({
              data: {
                productName,
                price: Number(price),
                categoryId: Number(categoryId),
                imageUrls: link,
              },
            });

            const createStock = await prisma.stock.create({
              data: {
                productId: createProduct.id,
                totalStock: Number(stockAmount),
              },
            });

            const createStockHistory = await prisma.stockHistory.create({
              data: {
                stockId: Number(createStock.id),
                adminId: req.user.id,
                currentStock: Number(stockAmount),
                flowType: 'IN',
                itemAmount: Number(stockAmount),
                newStock: Number(stockAmount),
              },
            });

            return { createProduct, createStock, createStockHistory };
          });

          res.status(201).send({
            status: 'ok',
            msg: 'Product Successfully Created',
            product: result.createProduct,
          });
        } else {
          const result = await prisma.$transaction(async (prisma) => {
            const createProduct = await prisma.product.create({
              data: {
                productName,
                price: Number(price),
                categoryId: Number(categoryId),
                imageUrls: link,
              },
            });
            return { createProduct };
          });

          res.status(201).send({
            status: 'ok',
            msg: 'Product Successfully Created',
            product: result.createProduct,
          });
        }
      } else {
        if (stockAmount !== oldProduct?.Stock[0].totalStock) {
          const result = await prisma.$transaction(async (prisma) => {
            const createProduct = await prisma.product.create({
              data: {
                productName,
                price: Number(price),
                categoryId: Number(categoryId),
              },
            });

            const createStock = await prisma.stock.create({
              data: {
                productId: createProduct.id,
                totalStock: Number(stockAmount),
              },
            });

            const createStockHistory = await prisma.stockHistory.create({
              data: {
                stockId: Number(createStock.id),
                adminId: req.user.id,
                currentStock: Number(stockAmount),
                flowType: 'IN',
                itemAmount: Number(stockAmount),
                newStock: Number(stockAmount),
              },
            });

            return { createProduct, createStock, createStockHistory };
          });

          res.status(201).send({
            status: 'ok',
            msg: 'Product Successfully Created',
            product: result.createProduct,
          });
        } else {
          const result = await prisma.$transaction(async (prisma) => {
            const createProduct = await prisma.product.create({
              data: {
                productName,
                price: Number(price),
                categoryId: Number(categoryId),
              },
            });
            return { createProduct };
          });

          res.status(201).send({
            status: 'ok',
            msg: 'Product Successfully Created',
            product: result.createProduct,
          });
        }
      }

      //
    } catch (error: any) {
      if (error.message) {
        res.status(400).send({
          status: 'error products',
          msg: error.message,
        });
      } else {
        res.status(400).send({
          status: 'error products',
          msg: error,
        });
      }
    }
  }

*/
