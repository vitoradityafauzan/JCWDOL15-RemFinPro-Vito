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
    this.router.get('/', this.productController.getProducts);
    this.router.get('/:id', this.productController.getProductById);
    // this.router.post(
    //   '/specials/v2',
    //   // verifyToken,
    //   this.productController.getProductsWithStoreAddressV22,
    // );
    // this.router.post('/', this.productController.createProduct);
    // this.router.put('/:id', this.productController.updateProduct);
    // this.router.delete('/:id', this.productController.deleteProduct);
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
