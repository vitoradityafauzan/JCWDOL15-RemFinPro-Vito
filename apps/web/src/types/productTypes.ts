export interface IProductGet {
  id: number;
  productName: string;
  price: number;
  imageUrls?: string | undefined;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string;
  Category: {
    id: number;
    categoryName: string;
    createdAt: string;
    updatedAt: string;
  };
  Stock?: {
    id: number;
    productId: number;
    totalStock: number;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    deletedAt?: string;
  }[];
}

export interface ICategories {
  id: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICartItems {
  id: number;
  name: string;
  price: number;
  amount: number;
}

export type ICart = ICartItems[];

export interface ITransactionCreate {
  cashierId: number;
  cart: ICart[];
  totalPrice: number;
}

export interface ICreateProduct {
  imageUrl: any;
  productName: string;
  price: number;
  categoryId: number;
  stockAmount: number;
}

export interface IUpdateProduct {
  productId: number;
  imageUrl: any;
  productName: string;
  price: number;
  categoryId: number;
}

export interface IStokHistory {
  id: number;
  stockId: number;
  adminId: number;
  currentStock: number;
  flowType: string;
  itemAmount: number;
  newStock: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string;
}

export interface IUpdateStock {
  flowType: string;
  amount: number;
}

export interface ICreateCategory {
  categoryName: string;
}
