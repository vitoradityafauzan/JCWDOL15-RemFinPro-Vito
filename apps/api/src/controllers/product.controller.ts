import { Request, Response } from 'express';
import prisma from '@/prisma';

export class ProductController {
  async getProducts(req: Request, res: Response) {
    try {
      const { name, categoryIds, page = 1, pageSize = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(pageSize);
      const take = Number(pageSize);

      const whereFilter = {
        AND: [{ productName: { contains: name as string } }],
      } as any;

      const modifiedCategoryIds = Array.isArray(categoryIds)
        ? categoryIds
        : categoryIds
          ? [categoryIds]
          : [];

      if (modifiedCategoryIds && modifiedCategoryIds.length > 0) {
        whereFilter.AND.push({
          categoryId: { in: modifiedCategoryIds.map((id) => Number(id)) },
        });
      }

      const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
          where: whereFilter,
          include: {
            Category: true,
          },
          skip,
          take,
        }),
        prisma.product.count({
          where: whereFilter,
        }),
      ]);

      res.status(200).json({ products, total });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
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
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }
}
