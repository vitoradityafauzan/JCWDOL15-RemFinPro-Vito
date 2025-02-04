/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect } from 'react';
import { toastSwal } from '@/app/utils/swalHelper';
import { ICategories, IProductGet } from '@/types/productTypes';
import { productList, categoryList } from '@/lib/product';

import AddProduct from '@/components/Admins/ProductManagement/AddProduct';
import EditProduct from '@/components/Admins/ProductManagement/EditProduct';
import StockHistory from '@/components/Admins/ProductManagement/StockHistory';
import StockUpdate from '@/components/Admins/ProductManagement/StockEdit';
import { currencyFormat } from '@/app/utils/currencyFormat';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<IProductGet[]>([]);
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  // fetching products
  const fetchData = async () => {
    try {
      const { products } = await productList(search, category);
      setProducts(products);
    } catch (error: any) {
      toastSwal('error', `${error}`);
    }
  };

  // fetching categories
  const fetchCategories = async () => {
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
    fetchData();
    fetchCategories();
  }, [search, category]);

  return (
    <div className="flex flex-col h-full gap-3 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>

      {/* add product button & modal */}
      <AddProduct fetchData={fetchData} />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select select-bordered w-full max-w-xs ml-2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto h-full">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Total Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover h-16">
                <td>{product.id}</td>
                <td>{product.productName}</td>
                <td>{product.Category.categoryName}</td>
                <td>{currencyFormat(product.price)}</td>
                <td>{product.Stock ? product.Stock[0].totalStock : 'N/A'}</td>
                <td>
                  <div className="dropdown dropdown-bottom dropdown-end">
                    <div tabIndex={0} role="button" className="btn m-1">
                      Click
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 gap-6 shadow"
                    >
                      {/* edit product button & modal */}
                      <li>
                        <EditProduct
                          key={product.id}
                          productId={product.id}
                          imageUrl={product.imageUrls}
                          productName={product.productName}
                          price={product.price}
                          categoryId={product.categoryId}
                          fetchData={fetchData}
                        />
                      </li>
                      {/* stock detail button & modal */}
                      <li>
                        <StockHistory
                          key={`stock-${product.id}`}
                          productId={product.id}
                        />
                      </li>
                      {/* stock update button & modal */}
                      <li>
                        <StockUpdate
                          key={product.id}
                          productId={product.id}
                          imageUrl={product.imageUrls}
                          productName={product.productName}
                          price={product.price}
                          categoryId={product.categoryId}
                          fetchData={fetchData}
                        />
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
