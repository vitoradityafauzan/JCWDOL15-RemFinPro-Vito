import { IProductGet, ITransactionCreate } from '@/types/productTypes';

const base_url =
  process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000/api/';

export const productList = async (search: string, category: string) => {
  const res = await fetch(
    `${base_url}product/all?search=${search}&category=${category}`,
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
  const res = await fetch(`${base_url}product/categories`);

  const result = await res.json();

  if (result.status != 'ok') {
    console.log('fetching failed');

    throw new Error(result.msg);
  } else {
    console.log('fetching success');

    return { status: result.status, categories: [...result.categories] };
  }
};

