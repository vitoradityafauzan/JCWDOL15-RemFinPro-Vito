import { Router } from 'express';
import { ProductController } from '@/controllers/product.controller';
import upload from '@/middlewares/upload';
import { verifyToken } from '@/middlewares/token';
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
    // this.router.post(
    //   '/upload-images',
    //   upload.array('images', 5),
    //   this.productController.uploadImage,
    // );
  }
  getRouter(): Router {
    return this.router;
  }
}
