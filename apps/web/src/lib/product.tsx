import {
  ICreateCategory,
  ICreateProduct,
  IProductGet,
  ITransactionCreate,
  IUpdateProduct,
  IUpdateStock,
} from '@/types/productTypes';
import { getCookie } from 'cookies-next';

const base_url =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/';

export const productList = async (search: string, category: string) => {
  const res = await fetch(
    `${base_url}product/all?search=${search}&category=${category}`,
    {
      method: 'GET',
    },
  );

  const result = await res.json();

  if (result.status != 'ok') {
    console.log('fetching failed');

    throw new Error(result.msg);
  } else {
    console.log('fetching success');

    return { status: result.status, products: [...result.products] };
  }
};

export const categoryList = async () => {
  const res = await fetch(`${base_url}product/category/all`, {
    method: 'GET',
  });

  const result = await res.json();

  return { result };
};

export const createProduct = async (data: any) => {
  const token = getCookie('cashewier-token');

  if (token) {
    // productName, price, categoryId, stockAmount
    const postData = new FormData();
    postData.append('productName', data.productName);
    postData.append('price', data.price.toString());
    postData.append('categoryId', data.categoryId.toString());
    postData.append('stockAmount', data.stockAmount.toString());
    postData.append('imageUrl', data.imageUrl);

    const res = await fetch(`${base_url}product/create`, {
      method: 'POST',
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: postData,
    });

    const result = await res.json();

    return { result };
  } else {
    console.log('\n\n\nNO TOKEN\n\n\n');
    return { result: { status: 'error', msg: 'no token' } };
  }
};

export const updateProduct = async (data: IUpdateProduct) => {
  const token = getCookie('cashewier-token');

  if (token) {
    // productName, price, categoryId, stockAmount
    const postData = new FormData();
    postData.append('productId', data.productId.toString());
    postData.append('productName', data.productName);
    postData.append('price', data.price.toString());
    postData.append('categoryId', data.categoryId.toString());
    postData.append('imageUrl', data.imageUrl);

    const res = await fetch(`${base_url}product/update`, {
      method: 'PUT',
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: postData,
    });

    const result = await res.json();

    return { result };
  } else {
    console.log('\n\n\nNO TOKEN\n\n\n');
    return { result: { status: 'error', msg: 'no token' } };
  }
};

export const updateStock = async (data: IUpdateStock, productId: number) => {
  const token = getCookie('cashewier-token');

  if (token) {
    console.log('\n\nLIB UpdateStock,', productId, ' \n\n');

    const res = await fetch(`${base_url}product/stok/update-stock`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: productId,
        flowType: data.flowType,
        amount: data.amount,
      }),
    });

    const result = await res.json();

    return { result };
  } else {
    console.log('\n\n\nNO TOKEN\n\n\n');
    return { result: { status: 'error', msg: 'no token' } };
  }
};

export const productStokHistory = async (stokId: number) => {
  const res = await fetch(`${base_url}product/stok/stok-history/${stokId}`, {
    method: 'GET',
  });

  const result = await res.json();

  return { result };
};

export const createCategory = async (data: ICreateCategory) => {
  const token = getCookie('cashewier-token');

  if (token) {
    const res = await fetch(`${base_url}product/category/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    return { result };
  } else {
    console.log('\n\n\nNO TOKEN\n\n\n');
    return { result: { status: 'error', msg: 'no token' } };
  }
};

export const deleteCategory = async (id: number) => {
  const token = getCookie('cashewier-token');

  if (token) {
    const res = await fetch(`${base_url}product/category/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await res.json();

    return { result };
  } else {
    console.log('\n\n\nNO TOKEN\n\n\n');
    return { result: { status: 'error', msg: 'no token' } };
  }
};
