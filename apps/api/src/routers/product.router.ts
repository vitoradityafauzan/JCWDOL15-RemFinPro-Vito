import { Router } from 'express';
import { ProductController } from '@/controllers/product.controller';
import upload from '@/middlewares/upload';
import { verifyToken } from '@/middlewares/token';
import { uploader } from '@/middlewares/uploader';
import { adminVerification } from '@/middlewares/adminVerification';
export class ProductRouter {
  private router: Router;
  private productController: ProductController;

  constructor() {
    this.productController = new ProductController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/all', this.productController.getProducts);
    this.router.get('/specific/:id', this.productController.getProductById);
    this.router.get('/categories', this.productController.getCategories);
    this.router.get('/category/:id', this.productController.getCategoryId);
    this.router.get(
      '/stok/stok-history/:id',
      this.productController.getStockHistory,
    );
    this.router.put(
      '/stok/update-stock',
      verifyToken,
      this.productController.updateStock,
    );
    this.router.post(
      '/create',
      uploader('product-', '/products').single('imageUrl'),
      verifyToken,
      adminVerification,
      this.productController.createProduct,
    );
    this.router.put(
      '/update',
      uploader('product-', '/products').single('imageUrl'),
      verifyToken,
      adminVerification,
      this.productController.updateProduct,
    );
  }
  getRouter(): Router {
    return this.router;
  }
}
