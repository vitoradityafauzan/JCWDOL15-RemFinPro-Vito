/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { ICategories, IProductGet } from '@/types/productTypes';
import { Cart } from '@/components/Dashboard/Cart';
import debounce from 'lodash.debounce';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState, useEffect, useCallback } from 'react';
import { categoryList, productList } from '@/lib/product';
import { toastSwal } from './utils/swalHelper';
import { ProductCard } from '@/components/Dashboard/ProductCard';

export default function Home() {
  const router = useRouter();

  // Product name and category search state and query handling
  const searchParams = useSearchParams();
  const querySearch = searchParams.get('search');
  const queryCategory = searchParams.get('category');

  const searchRef = useRef<HTMLInputElement | null>(null);

  const [search, setSearch] = useState<string>(querySearch || '');
  const [category, setCategory] = useState<string>(queryCategory || '');

  // Track if user has interacted with the search inputs
  const [isSearchTouched, setIsSearchTouched] = useState(false);
  const [isCategoryTouched, setIsCategoryTouched] = useState(false);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 600),
    [],
  );

  const debouncedCategory = useCallback(
    debounce((value: string) => {
      setCategory(value);
    }, 600),
    [],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSearchTouched) setIsSearchTouched(true);

    debouncedSearch(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!isCategoryTouched) setIsCategoryTouched(true);

    debouncedCategory(e.target.value);
  };

  // Fetch category select contents
  const [categories, setCategories] = useState<ICategories[] | null>(null);

  const getCategories = async () => {
    try {
      const { result } = await categoryList();

      if (result.status !== 'ok') {
        throw `${result.msg}`;
      }

      setCategories(result.categories);
    } catch (error: any) {
      toastSwal('error', `${error}`);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Fetch product data
  const [data, setData] = useState<IProductGet[] | null>(null);

  const fetchData = async () => {
    try {
      let query = ``;

      if (isSearchTouched || isCategoryTouched) {
        query += `?search=${search}&category=${category}`;
      }

      router.push(query);

      // Fetch events based on the search parameters
      const { products } = await productList(search, category);
      setData(products || []);
    } catch (err: any) {
      toastSwal('error', `${err}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, category, router]);

  return (
    <div className="grid grid-cols-3 h-full bg-zinc-100 border-0">
      <div className="col-span-2 h-full flex flex-col gap-5">
        {/* Filter */}
        <div className="flex gap-5 p-5">
          <div className="flex">
            <label className="input input-bordered input-accent flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Search"
                ref={searchRef}
                defaultValue={search}
                onChange={handleSearchChange}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </label>
          </div>
          <div className="flex">
            <select
              className="select select-accent w-full max-w-xs"
              onChange={handleCategoryChange}
              defaultValue={category}
            >
              <option value={''}>Select Category</option>
              {categories &&
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
            </select>
          </div>
        </div>
        {/* Product List */}
        <div className="flex flex-row flex-wrap h-full justify-center gap-5 p-2 ">
          {data &&
            data.map((pro) => (
              <ProductCard
                key={pro.id}
                id={pro.id}
                name={pro.productName}
                image={pro.imageUrls}
                imgAlt={pro.productName}
                price={pro.price}
                stock={pro.Stock ? pro.Stock[0].totalStock : 0}
              />
            ))}
        </div>
      </div>

      {/* Cart */}
      <Cart />
    </div>
  );
}
