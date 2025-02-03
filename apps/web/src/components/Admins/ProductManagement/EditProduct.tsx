'use client';

import React, { useState, useEffect } from 'react';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import {
  confirmationWithoutSuccessMessageSwal,
  toastSwal,
} from '@/app/utils/swalHelper';
import { ICategories, IProductGet, IUpdateProduct } from '@/types/productTypes';
import { categoryList, updateProduct } from '@/lib/product';
import { editProductSchema } from '@/app/utils/formSchema';
import Image from 'next/image';

interface EditProductProps {
  productId: number;
  imageUrl: string | undefined;
  productName: string;
  price: number;
  categoryId: number;
  fetchData: () => Promise<void>;
}

const EditProduct: React.FC<EditProductProps> = ({
  productId,
  imageUrl,
  productName,
  price,
  categoryId,
  fetchData,
}) => {
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<IUpdateProduct>({
    productId,
    imageUrl: imageUrl || '',
    productName,
    price,
    categoryId,
  });

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
    fetchCategories();
  }, []);

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
    <>
      <button
        className="btn btn-accent basis-3/6"
        onClick={() => {
          setSelectedProduct({
            productId: productId,
            imageUrl: imageUrl || '',
            productName: productName,
            price: price,
            categoryId: categoryId,
          }); 
          (
            document.getElementById(
              'edit-product-' + productId,
            ) as HTMLDialogElement
          )?.showModal(); // Show the modal
        }}
      >
        Edit
      </button>

      {/*  */}

      <dialog
        id={'edit-product-' + productId}
        className="modal mx-auto items-center justify-center"
      >
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
                initialValues={selectedProduct}
                validationSchema={editProductSchema}
                onSubmit={async (values, actions) => {
                  console.log('submit button slicked');

                  // Close the modal programmatically
                  const modal = document.getElementById(
                    'edit-product-' + productId,
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
    </>
  );
};

export default EditProduct;
