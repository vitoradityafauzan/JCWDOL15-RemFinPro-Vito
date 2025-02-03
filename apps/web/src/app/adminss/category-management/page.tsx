'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import {
  confirmationWithoutSuccessMessageSwal,
  simpleSwal,
  toastSwal,
} from '@/app/utils/swalHelper';
import { ICategories, ICreateCategory } from '@/types/productTypes';
import { categoryList, createCategory, deleteCategory } from '@/lib/product';
import * as yup from 'yup';
import { addCategorySchema } from '@/app/utils/formSchema';

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<ICategories[]>([]);
  const deleteCategoryIdRef = useRef<number | null>(null);

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

  const handleAddSubmit = async (
    data: ICreateCategory,
    action: FormikHelpers<ICreateCategory>,
  ) => {
    try {
      const confirm = await confirmationWithoutSuccessMessageSwal(
        `Your'e About To Finalize This Changes`,
        'Are you sure?',
      );

      if (confirm) {
        const { result } = await createCategory(data);

        if (result.status !== 'ok') throw `${result.msg}`;

        action.resetForm();

        await fetchCategories();

        simpleSwal('success', `${result.msg}`);
      } else {
        action.resetForm();
      }
    } catch (error: any | string) {
      action.resetForm();

      toastSwal('error', error);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const confirm = await confirmationWithoutSuccessMessageSwal(
        `Your'e About To Finalize This Changes`,
        'Are you sure?',
      );

      if (confirm && deleteCategoryIdRef.current !== null) {
        const { result } = await deleteCategory(deleteCategoryIdRef.current);
        if (result.status === 'ok') {
          toastSwal('success', `${result.msg}`);
          await fetchCategories();
        } else {
          throw result.msg;
        }
      }
    } catch (error: any | string) {
      toastSwal('error', error);
    }
  };

  return (
    <div className="flex flex-col h-full gap-3 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>
      <button
        className="btn btn-outline btn-success w-1/6 mb-4"
        onClick={() =>
          (
            document.getElementById('add-category') as HTMLDialogElement
          )?.showModal()
        }
      >
        Add Category
      </button>

      <div className="overflow-x-auto h-full">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index}>
                <td>{category.id}</td>
                <td>{category.categoryName}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      deleteCategoryIdRef.current = category.id;
                      handleDeleteSubmit();
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/*  */}

      <dialog id="add-category" className="modal">
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
                  categoryName: '',
                }}
                validationSchema={addCategorySchema}
                onSubmit={async (values, actions) => {
                  console.log('submit button slicked');

                  // Close the modal programmatically
                  const modal = document.getElementById(
                    'add-product',
                  ) as HTMLDialogElement;
                  modal?.close();

                  // Call the form submission handler
                  await handleAddSubmit(values, actions);
                }}
              >
                {({ setFieldValue, values }) => {
                  return (
                    <Form className="flex flex-col gap-5 p-5  border-0">
                      {/* Input categoryName */}
                      <div className="form-control w-full max-w-lg">
                        <div className="label">
                          <span className="label-text text-lg">
                            Category Name
                          </span>
                        </div>
                        <Field
                          type="text"
                          name="categoryName"
                          placeholder="Type Category Name"
                          className="input input-bordered input-accent w-full max-w-md p-3 rounded-lg"
                        />
                        <ErrorMessage
                          name="categoryName"
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

export default CategoryManagement;
