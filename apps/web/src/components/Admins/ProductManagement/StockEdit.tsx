'use client';

import React, { useState, useEffect } from 'react';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import {
  confirmationWithoutSuccessMessageSwal,
  toastSwal,
} from '@/app/utils/swalHelper';
import {
  EditProductProps,
  IUpdateProduct,
  IUpdateStock,
} from '@/types/productTypes';
import { updateStock } from '@/lib/product';
import { editStockSchema } from '@/app/utils/formSchema';

const StockUpdate: React.FC<EditProductProps> = ({
  productId,
  imageUrl,
  productName,
  price,
  categoryId,
  fetchData,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<IUpdateProduct>();

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
    <>
      <button
        className="btn btn-accent basis-3/6"
        onClick={async () => {
          setSelectedProduct({
            productId: productId,
            imageUrl: imageUrl || '',
            productName: productName,
            price: price,
            categoryId: categoryId,
          });

          (
            document.getElementById(
              `edit-stock-${productId}`,
            ) as HTMLDialogElement
          )?.showModal(); // Show the modal
        }}
      >
        Edit Stock
      </button>
      {/*  */}

      <dialog
        id={`edit-stock-${productId}`}
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

                  // Close the modal programmatically
                  const modal = document.getElementById(
                    `edit-stock-${productId}`,
                  ) as HTMLDialogElement;
                  modal?.close();

                  // Call the form submission handler
                  await handleStockEditSubmit(values, actions);
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
    </>
  );
};

export default StockUpdate;
