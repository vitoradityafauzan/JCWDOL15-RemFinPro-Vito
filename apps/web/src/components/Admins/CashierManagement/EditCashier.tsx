'use client';

import React, { useState, useEffect } from 'react';
import { updateCashier } from '@/lib/account';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import {
  confirmationWithoutSuccessMessageSwal,
  toastSwal,
} from '@/app/utils/swalHelper';
import { editAccountSchema } from '@/app/utils/formSchema';
import { IAccount, AccountUpdateProps, ILogin } from '@/types/accountTypes';

const EditCashier: React.FC<AccountUpdateProps> = ({ cashier, fetchData }) => {
  const [selectedCashier, setSelectedCashier] = useState<IAccount>();

  const handleEditSubmit = async (
    data: ILogin,
    action: FormikHelpers<ILogin>,
  ) => {
    try {
      const confirm = await confirmationWithoutSuccessMessageSwal(
        `Your'e About To Finalize This Changes`,
        'Are you sure?',
      );

      if (confirm) {
        // Sending Form Data To Action
        const { result } = await updateCashier(
          selectedCashier ? selectedCashier.id : 0,
          data,
        );

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
      action.resetForm();

      toastSwal('error', error);
    }
  };

  return (
    <>
      <button
        className="btn btn-accent basis-3/6"
        onClick={() => {
          setSelectedCashier(cashier); // Set the selected cashier
          (
            document.getElementById(
              `edit-cashier-${cashier.id}`,
            ) as HTMLDialogElement
          )?.showModal(); // Show the modal
        }}
      >
        Edit
      </button>

      {/*  */}

      <dialog id={`edit-cashier-${cashier.id}`} className="modal">
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
              <p className="py-4">Edit Cashier credential</p>
              {selectedCashier && (
                <Formik
                  initialValues={{
                    username: selectedCashier.username,
                    password: '',
                  }}
                  validationSchema={editAccountSchema}
                  onSubmit={async (values, actions) => {
                    console.log('submit button slicked');

                    // Close the modal programmatically
                    const modal = document.getElementById(
                      `edit-cashier-${cashier.id}`,
                    ) as HTMLDialogElement;
                    modal?.close();

                    // Call the form submission handler
                    await handleEditSubmit(values, actions);
                  }}
                  enableReinitialize // Add this prop
                >
                  {() => (
                    <Form className="flex flex-col gap-5 p-5 border-0">
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
                      <button
                        className="btn btn-outline btn-accent"
                        type="submit"
                      >
                        Submit
                      </button>
                    </Form>
                  )}
                </Formik>
              )}
            </div>
          </div>
        </div>
      </dialog>

      {/*  */}
    </>
  );
};

export default EditCashier;
