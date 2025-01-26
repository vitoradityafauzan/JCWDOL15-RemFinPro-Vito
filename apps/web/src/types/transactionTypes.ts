interface IOrderItems {
  id: number;
  orderId: number;
  productId: number;
  price: number;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string;
  Product: {
    id: number;
    productName: string;
    price: number;
    imageUrls?: string;
    categoryId: number;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    deletedAt?: string;
  };
}
