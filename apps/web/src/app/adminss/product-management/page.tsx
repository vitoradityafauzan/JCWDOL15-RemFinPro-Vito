'use client';

import React, { useState, useEffect } from 'react';
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikHelpers,
  useFormikContext,
} from 'formik';
import {
  confirmationWithoutSuccessMessageSwal,
  simpleSwal,
  toastSwal,
} from '@/app/utils/swalHelper';
import {
  ICategories,
  ICreateProduct,
  IProductGet,
  IStokHistory,
  IUpdateProduct,
  IUpdateStock,
} from '@/types/productTypes';
import {
  productList,
  categoryList,
  createProduct,
  updateProduct,
  productStokHistory,
  updateStock,
} from '@/lib/product';
import {
  loginSchema,
  editAccountSchema,
  addProductSchema,
  editProductSchema,
  editStockSchema,
} from '@/app/utils/formSchema';
import Image from 'next/image';

// const SubmitButton = ({ closeModal }: { closeModal: () => void }) => {
//   const { submitForm } = useFormikContext();

//   const handleClick = async () => {
//     await submitForm();
//     closeModal();
//   };

//   return (
//     <button
//       className="btn btn-outline btn-accent"
//       type="button"
//       onClick={handleClick}
//     >
//       Submit
//     </button>
//   );
// };

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<IProductGet[]>([]);
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<IUpdateProduct>();
  const [stockHistory, setStokHistory] = useState<IStokHistory[]>([]);

  const fetchData = async () => {
    try {
      const { products } = await productList(search, category);
      setProducts(products);
    } catch (error: any) {
      toastSwal('error', `${error}`);
    }
  };

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

  const fetchStokHistory = async (stokId: number) => {
    try {
      const { result } = await productStokHistory(stokId);

      if (result.status !== 'ok') throw `${result.msg}`;

      console.log('\n\n');
      console.log(result.status);
      console.log('\n\n');
      console.log(result);

      setStokHistory(result.stockHistory);
    } catch (error: any) {
      toastSwal('error', `${error}`);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleAddSubmit = async (
    data: ICreateProduct,
    action: FormikHelpers<ICreateProduct>,
  ) => {
    try {
      const confirm = await confirmationWithoutSuccessMessageSwal(
        `Your'e About To Finalize This Changes`,
        'Are you sure?',
      );

      if (confirm) {
        const { result } = await createProduct(data);

        if (result.status !== 'ok') throw `${result.msg}`;

        action.resetForm();

        await fetchData();

        simpleSwal('success', `${result.msg}`);
      } else {
        action.resetForm();
      }
    } catch (error: any | string) {
      action.resetForm();

      toastSwal('error', error);
    }
  };

  const handleEditSubmit = async (
    data: IUpdateProduct,
    action: FormikHelpers<IUpdateProduct>,
  ) => {
    try {
      const confirm = await confirmationWithoutSuccessMessageSwal(
        `Your'e About To Finalize This Changes`,
        'Are you sure?',
      );

      if (confirm) {
        // Sending Form Data To Action
        const { result } = await updateProduct(data);

        if (result.status !== 'ok') {
          throw result.msg;
        }

        console.log('\n\nupdate form success, \n');
        console.log(result);
        console.log('\n\n\n');

        action.resetForm();

        setProducts(
          products.map((product) =>
            product.id === (selectedProduct?.productId ?? 0)
              ? result.product
              : product,
          ),
        );

        toastSwal('success', `${result.msg}`);
      } else {
        action.resetForm();
      }
    } catch (error: any | string) {
      toastSwal('error', error);
    }
  };

  const handleStockEditSubmit = async (
    data: IUpdateStock,
    action: FormikHelpers<IUpdateStock>,
  ) => {
    try {
      const confirm = await confirmationWithoutSuccessMessageSwal(
        `Your'e About To Finalize This Changes`,
        'Are you sure?',
      );

      if (confirm) {
        const { result } = await updateStock(
          data,
          selectedProduct?.productId ?? 0,
        );

        if (result.status !== 'ok') throw result.msg;

        action.resetForm();

        await fetchData();

        toastSwal('success', `${result.msg}`);
      } else {
        action.resetForm();
      }
    } catch (error: any | string) {
      toastSwal('error', error);
    }
  };

  return (
    <div className="flex flex-col h-full gap-3 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Management</h1>
      <button
        className="btn btn-outline btn-success w-1/6 mb-4"
        onClick={() =>
          (
            document.getElementById('add-product') as HTMLDialogElement
          )?.showModal()
        }
      >
        Add Product
      </button>

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
                <td>{product.price}</td>
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
                      <li>
                        <button
                          className="btn btn-accent basis-3/6"
                          onClick={() => {
                            setSelectedProduct({
                              productId: product.id,
                              imageUrl: product.imageUrls,
                              productName: product.productName,
                              price: product.price,
                              categoryId: product.categoryId,
                            }); // Set the selected cashier
                            (
                              document.getElementById(
                                'edit-product',
                              ) as HTMLDialogElement
                            )?.showModal(); // Show the modal
                          }}
                        >
                          Edit
                        </button>
                      </li>
                      <li>
                        <button
                          className="btn btn-accent basis-3/6"
                          onClick={() => {
                            setSelectedProduct({
                              productId: product.id,
                              imageUrl: product.imageUrls,
                              productName: product.productName,
                              price: product.price,
                              categoryId: product.categoryId,
                            }); // Set the selected cashier
                            fetchStokHistory(product.id);
                            (
                              document.getElementById(
                                'stok-history',
                              ) as HTMLDialogElement
                            )?.showModal(); // Show the modal
                          }}
                        >
                          Stok History
                        </button>
                      </li>
                      <li>
                        <button
                          className="btn btn-accent basis-3/6"
                          onClick={async () => {
                            // alert(product.Stock ? product.Stock[0].id : 'N/A');
                            // const stockId = product.Stock
                            //   ? product.Stock[0].id
                            //   : 0;

                            // const stockk =
                            //   product.Stock && product.Stock.length > 0
                            //     ? product.Stock[0].id
                            //     : 0;
                            // alert(stockk);

                            await setSelectedProduct({
                              productId: product.id,
                              imageUrl: product.imageUrls,
                              productName: product.productName,
                              price: product.price,
                              categoryId: product.categoryId,
                            }); // Set the selected cashier

                            (
                              document.getElementById(
                                'edit-stock',
                              ) as HTMLDialogElement
                            )?.showModal(); // Show the modal
                          }}
                        >
                          Edit Stock
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*  */}

      <dialog id="add-product" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex flex-col gap-5 items-center">
            <h3 className="font-bold text-lg">Enter New Product</h3>
            <div>
              <Formik
                initialValues={{
                  imageUrl: '',
                  productName: '',
                  price: 0,
                  categoryId: 0,
                  stockAmount: 0,
                }}
                validationSchema={addProductSchema}
                onSubmit={async (values, actions) => {
                  console.log('submit button slicked');
                  // Call the form submission handler
                  await handleAddSubmit(values, actions);

                  // Close the modal programmatically
                  const modal = document.getElementById(
                    'add-product',
                  ) as HTMLDialogElement;
                  modal?.close();
                }}
              >
                {({ setFieldValue, values }) => {
                  return (
                    <Form className="flex flex-col gap-5 p-5  border-0">
                      {imagePreview ? (
                        <div className="grow m-4 h-96 border-4 border-dashed">
                          <Image
                            src={imagePreview}
                            alt="No Image"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-5/6 h-56 border-4 border-dashed">
                          No Image
                        </div>
                      )}

                      {/* Image */}
                      <div className="flex items-center gap-5">
                        <label htmlFor="image">Upload Image</label>
                        <input
                          type="file"
                          id="image"
                          name="image"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            setFieldValue('imageUrl', file);

                            if (file) {
                              // console.log(file);

                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setImagePreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setImagePreview(null);
                            }
                          }}
                        />
                        <ErrorMessage
                          name="imageUrl"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      {/* Input productName */}
                      <div className="form-control w-full max-w-lg">
                        <div className="label">
                          <span className="label-text text-lg">
                            Product Name
                          </span>
                        </div>
                        <Field
                          type="text"
                          name="productName"
                          placeholder="Type Product Name"
                          className="input input-bordered input-accent w-full max-w-md p-3 rounded-lg"
                        />
                        <ErrorMessage
                          name="productName"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      {/* Input stock */}
                      <div className="form-control w-full max-w-md">
                        <div className="label">
                          <span className="label-text text-lg">stock</span>
                        </div>
                        <Field
                          type="number"
                          name="stockAmount"
                          placeholder="Type Stock Amount"
                          className="input input-bordered input-accent w-full max-w-md p-3 rounded-lg"
                        />
                        <ErrorMessage
                          name="stockAmount"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      {/* Input category */}
                      <div className="form-control w-full max-w-lg">
                        <div className="label">
                          <span className="label-text text-lg">category</span>
                        </div>
                        <select
                          className="select select-accent w-full border-2"
                          onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>,
                          ) => {
                            setFieldValue('categoryId', Number(e.target.value));
                          }}
                          value={values.categoryId}
                        >
                          <option value="">Select Category</option>
                          {categories!.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.categoryName}
                            </option>
                          ))}
                        </select>
                        <ErrorMessage
                          name="categoryId"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      {/* Input price */}
                      <div className="form-control w-full max-w-md">
                        <div className="label">
                          <span className="label-text text-lg">price</span>
                        </div>
                        <Field
                          type="number"
                          name="price"
                          placeholder="Type price here"
                          className="input input-bordered input-accent w-full max-w-md p-3 rounded-lg"
                        />
                        <ErrorMessage
                          name="price"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div className="modal-action">
                        <button
                          className="btn btn-outline btn-accent"
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </dialog>

      {/*  */}

      <dialog id="edit-product" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex flex-col gap-5 items-center">
            <h3 className="font-bold text-lg">Update Product</h3>
            <div>
              <Formik
                initialValues={{
                  productId: selectedProduct ? selectedProduct.productId : 0,
                  imageUrl: '',
                  productName: selectedProduct
                    ? selectedProduct.productName
                    : '',
                  categoryId: selectedProduct ? selectedProduct.categoryId : 0,
                  price: selectedProduct ? selectedProduct.price : 0,
                }}
                validationSchema={editProductSchema}
                onSubmit={async (values, actions) => {
                  console.log('submit button slicked');

                  // Close the modal programmatically
                  const modal = document.getElementById(
                    'edit-product',
                  ) as HTMLDialogElement;
                  modal?.close();

                  // Call the form submission handler
                  await handleEditSubmit(values, actions);
                }}
                // onSubmit={handleEditSubmit}
                enableReinitialize
              >
                {({ setFieldValue, values }) => {
                  return (
                    <Form className="flex flex-col gap-5 p-5  border-0">
                      <Field
                        type="hidden"
                        name="productId"
                        placeholder=""
                        className="input input-bordered input-accent w-full max-w-md p-3 rounded-lg"
                      />
                      {imagePreview ? (
                        <div className="grow m-4 h-96 border-4 border-dashed">
                          <Image
                            src={imagePreview}
                            alt="No Image"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="w-5/6 h-56 border-4 border-dashed">
                          No Image
                        </div>
                      )}

                      <div className="flex items-center gap-5">
                        <label htmlFor="image">Upload Image</label>
                        <input
                          type="file"
                          id="image"
                          name="image"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            setFieldValue('imageUrl', file);

                            if (file) {
                              // console.log(file);

                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setImagePreview(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            } else {
                              setImagePreview(null);
                            }
                          }}
                        />
                        <ErrorMessage
                          name="imageUrl"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div className="form-control w-full max-w-lg">
                        <div className="label">
                          <span className="label-text text-lg">
                            Product Name
                          </span>
                        </div>
                        <Field
                          type="text"
                          name="productName"
                          placeholder="Type Product Name"
                          className="input input-bordered input-accent w-full max-w-md p-3 rounded-lg"
                        />
                        <ErrorMessage
                          name="productName"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div className="form-control w-full max-w-lg">
                        <div className="label">
                          <span className="label-text text-lg">category</span>
                        </div>
                        <select
                          className="select select-accent w-full border-2"
                          onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>,
                          ) => {
                            setFieldValue('categoryId', Number(e.target.value));
                          }}
                          value={values.categoryId}
                        >
                          <option value="">Select Category</option>
                          {categories!.map((cat: any) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.categoryName}
                            </option>
                          ))}
                        </select>
                        <ErrorMessage
                          name="categoryId"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div className="form-control w-full max-w-md">
                        <div className="label">
                          <span className="label-text text-lg">price</span>
                        </div>
                        <Field
                          type="number"
                          name="price"
                          placeholder="Type price here"
                          className="input input-bordered input-accent w-full max-w-md p-3 rounded-lg"
                        />
                        <ErrorMessage
                          name="price"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div className="modal-action">
                        <button
                          className="btn btn-outline btn-accent"
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </dialog>

      {/*  */}

      <dialog id="stok-history" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex flex-col gap-5 items-center">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Stok Flow</th>
                  <th>Old Amount</th>
                  <th>New Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stockHistory &&
                  stockHistory.map((stokh) => (
                    <tr key={stokh.id}>
                      <td>{stokh.id}</td>
                      <td>{stokh.flowType}</td>
                      <td>{stokh.currentStock}</td>
                      <td>{stokh.newStock}</td>
                      <td>{formatDate(stokh.createdAt)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </dialog>

      {/*  */}

      <dialog id="edit-stock" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex flex-col gap-5 items-center">
            <h3 className="font-bold text-lg">Edit Stock</h3>
            <div>
              <Formik
                initialValues={{
                  flowType: 'IN',
                  amount: 0,
                }}
                validationSchema={editStockSchema}
                onSubmit={async (values, actions) => {
                  console.log('submit button slicked');
                  console.log(selectedProduct);

                  // Call the form submission handler
                  await handleStockEditSubmit(values, actions);

                  // Close the modal programmatically
                  const modal = document.getElementById(
                    'edit-stock',
                  ) as HTMLDialogElement;
                  modal?.close();
                }}
              >
                {({ setFieldValue, values }) => {
                  return (
                    <Form className="flex flex-col gap-5 p-5  border-0">
                      {/* Input flow type */}
                      <div className="form-control w-full max-w-lg">
                        <div className="label">
                          <span className="label-text text-lg">
                            Stock Flow Type
                          </span>
                        </div>
                        <Field
                          as="select"
                          className="select select-accent w-full border-2"
                          name="flowType"
                          onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>,
                          ) => {
                            setFieldValue('flowType', e.target.value);
                          }}
                          value={values.flowType}
                        >
                          <option value="IN">IN</option>
                          <option value="OUT">OUT</option>
                        </Field>
                        <ErrorMessage
                          name="categoryId"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      {/* Input amount */}
                      <div className="form-control w-full max-w-md">
                        <div className="label">
                          <span className="label-text text-lg">Amount</span>
                        </div>
                        <Field
                          type="number"
                          name="amount"
                          placeholder="Type new stock amount"
                          className="input input-bordered input-accent w-full max-w-md p-3 rounded-lg"
                        />
                        <ErrorMessage
                          name="price"
                          component="div"
                          className="text-red-500"
                        />
                      </div>

                      <div className="modal-action">
                        <button
                          className="btn btn-outline btn-accent"
                          type="submit"
                        >
                          Submit
                        </button>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </dialog>

      {/*  */}
    </div>
  );
};

export default ProductManagement;
