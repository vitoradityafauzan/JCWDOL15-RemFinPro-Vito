'use client';

import React, { useState, useEffect } from 'react';
import { addCashier } from '@/lib/account';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import {
  confirmationWithoutSuccessMessageSwal,
  toastSwal,
} from '@/app/utils/swalHelper';
import { ILogin } from '@/types/accountTypes';
import { loginSchema } from '@/app/utils/formSchema';
import { AddComponentProps } from '@/types/productTypes';

const AddCashier: React.FC<AddComponentProps> = ({ fetchData }) => {
  const handleAddSubmit = async (
    data: ILogin,
    action: FormikHelpers<ILogin>,
  ) => {
    try {
      const confirm = await confirmationWithoutSuccessMessageSwal(
        `Your'e About To Finalize This Changes`,
        'Are you sure?',
      );

      if (confirm) {
        console.log('Log Comp, data form, \n');
        console.log(data);
        console.log('\n');

        // Sending Form Data To Action
        const { result } = await addCashier(data);

        if (result.status !== 'ok') {
          throw result.msg;
        }
        action.resetForm();

        fetchData();

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
        className="btn btn-outline btn-success mb-4"
        onClick={() =>
          (
            document.getElementById('add-cashier') as HTMLDialogElement
          )?.showModal()
        }
      >
        Add Cashier
      </button>
      {/*  */}

      <dialog id="add-cashier" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex flex-col gap-5 items-center">
            <h3 className="font-bold text-lg">Pay By Debit</h3>
            <div>
              <p className="py-4">Enter New Cashier credential</p>
              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={loginSchema}
                onSubmit={async (values, actions) => {
                  console.log('submit button slicked');

                  // Close the modal programmatically
                  const modal = document.getElementById(
                    'add-cashier',
                  ) as HTMLDialogElement;
                  modal?.close();

                  // Call the form submission handler
                  await handleAddSubmit(values, actions);
                }}
              >
                {() => {
                  return (
                    <Form className="flex flex-col gap-5 p-5  border-0">
                      {/* Input Username */}
                      <label className="form-control w-full max-w-lg">
                        <div className="label">
                          <span className="label-text text-lg">Username</span>
                        </div>
                        <Field
                          type="text"
                          name="username"
                          placeholder="Type username"
                          className="input input-bordered input-accent w-full max-w-md p-3 rounded-lg"
                        />
                        <ErrorMessage
                          name="username"
                          component="div"
                          className="text-red-500"
                        />
                      </label>
                      {/* Input Password */}
                      <label className="form-control w-full max-w-md">
                        <div className="label">
                          <span className="label-text text-lg">Password</span>
                        </div>
                        <Field
                          type="password"
                          name="password"
                          placeholder="Type password here"
                          className="input input-bordered input-accent w-full max-w-md p-3 rounded-lg"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-500"
                        />
                      </label>

                      <div className="modal-action">
                        <label htmlFor="my_modal_6" className="w-fit h-fit">
                          <button
                            className="btn btn-outline btn-accent"
                            type="submit"
                          >
                            Submit
                          </button>
                        </label>
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
            {/* <form method="dialog">
              <button
                className="btn btn-outline btn-accent"
                onClick={handleTransactionFinalizeDebit}
              >
                checking
              </button>
            </form> */}
          </div>
        </div>
      </dialog>

      {/*  */}
    </>
  );
};

export default AddCashier;
