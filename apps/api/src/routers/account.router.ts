import { AccountController } from '@/controllers/account.controller';
import { Router } from 'express';
import { verifyToken } from '@/middlewares/token';
import { adminVerification } from '@/middlewares/adminVerification';

export class AccountRouter {
  private router: Router;
  private accountController: AccountController;

  constructor() {
    this.accountController = new AccountController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', verifyToken, this.accountController.getAccountDetail);
    this.router.post('/create', this.accountController.createAccount);
    this.router.post('/login', this.accountController.loginAccount);
    this.router.get(
      '/fetch-all',
      verifyToken,
      adminVerification,
      this.accountController.getAccounts,
    );
    this.router.get(
      '/fetch-detail',
      verifyToken,
      adminVerification,
      this.accountController.getAccountDetail,
    );
    this.router.get(
      '/check-token',
      verifyToken,
      this.accountController.checkTokenExpiration,
    );
    this.router.post(
      '/submit-shift',
      verifyToken,
      this.accountController.createCashierShift,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
