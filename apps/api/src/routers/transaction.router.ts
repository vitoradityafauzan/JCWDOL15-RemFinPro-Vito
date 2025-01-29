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
    this.router.get(
      '/sales-history',
      this.transationController.getSalesHistory,
    );
    this.router.get(
      '/total-transactions-per-day',
      this.transationController.getTotalTransactionsPerDay,
    );
    this.router.get(
      '/total-items-sold-per-day',
      this.transationController.getTotalItemsSoldPerDay,
    );
    this.router.get('/shift-all', this.transationController.getShiftAll);
    this.router.get(
      '/shift-details/:shiftId',
      this.transationController.getShiftDetails,
    );
    this.router.get(
      '/order-cash-abnormalities',
      this.transationController.findOrderCashAbnormalities,
    );
    this.router.get(
      '/order-detail-by-cashier',
      verifyToken,
      this.transationController.getOrderByCashier,
    );
    this.router.get(
      '/cash-register-abnormalities',
      this.transationController.findCashRegisterAbnormalities,
    );
  }
  getRouter(): Router {
    return this.router;
  }
}
