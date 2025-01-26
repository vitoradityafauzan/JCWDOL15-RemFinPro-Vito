import { Router } from 'express';
import upload from '@/middlewares/upload';
import { verifyToken } from '@/middlewares/token';
import { TransactionController } from '@/controllers/transaction.controller';

export class TransactionRouter {
  private router: Router;
  private transationController: TransactionController;

  constructor() {
    this.transationController = new TransactionController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/all',
      verifyToken,
      this.transationController.getAllTransactions,
    );
    this.router.get(
      '/active',
      verifyToken,
      this.transationController.getActiveTransaction,
    );
    this.router.get(
      '/active/items',
      verifyToken,
      this.transationController.getOrderItems,
    );
    this.router.post(
      '/create',
      verifyToken,
      this.transationController.createTransaction,
    );
    this.router.put(
      '/finalize',
      verifyToken,
      this.transationController.finalizedTransaction,
    );
  }
  getRouter(): Router {
    return this.router;
  }
}
