import { Request, Response } from 'express';
import prisma from '@/prisma';
import { Prisma } from '@prisma/client';

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
        },
      });

      res.status(200).send({
        status: 'ok',
        products,
      });
    } catch (error: any) {
      if (error.message) {
        res.status(401).send({
          status: 'error products',
          msg: error.message,
        });
      } else {
        res.status(401).send({
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
        },
      });

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json(product);
    } catch (error: any) {
      if (error.message) {
        res.status(401).send({
          status: 'error products',
          msg: error.message,
        });
      } else {
        res.status(401).send({
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
        res.status(401).send({
          status: 'error categories',
          msg: error.message,
        });
      } else {
        res.status(401).send({
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
        res.status(401).send({
          status: 'error categories',
          msg: error.message,
        });
      } else {
        res.status(401).send({
          status: 'error categories',
          msg: error,
        });
      }
    }
  }
}
