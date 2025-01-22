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
}

export interface ICategories {
  id: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}
