'use client';

import React, { useState, useEffect } from 'react';
import {
  fetchCashiers,
  addCashier,
  updateCashier,
  deleteCashier,
} from '@/lib/account';
import Modal from '@/components/Admins/CashierManagement/Modal';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { simpleSwal, toastSwal } from '@/app/utils/swalHelper';
import { IAccount, ILogin } from '@/types/accountTypes';
import { loginSchema, editAccountSchema } from '@/app/utils/formSchema';

const CashierManagement = () => {
  const [cashiers, setCashiers] = useState<IAccount[]>([]);
  const [selectedCashier, setSelectedCashier] = useState<IAccount>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'update'

  const fetchData = async () => {
    try {
      const { result } = await fetchCashiers();
      if (result.status !== 'ok') {
        throw result.msg;
      }
      setCashiers(result.accounts);
    } catch (error: any) {
      toastSwal('error', `${error}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSubmit = async (
    data: ILogin,
    action: FormikHelpers<ILogin>,
  ) => {
    try {
      console.log('Log Comp, data form, \n');
      console.log(data);
      console.log('\n');

      // Sending Form Data To Action
      const { result } = await addCashier(data);

      if (result.status !== 'ok') {
        throw result.msg;
      }
      action.resetForm();

      setCashiers([...cashiers, result.account]);

      toastSwal('success', `${result.msg}`);
    } catch (error: any | string) {
      toastSwal('error', error);
    }
  };

  const handleEditSubmit = async (
    data: ILogin,
    action: FormikHelpers<ILogin>,
  ) => {
    try {
      console.log('Log Comp, data form, \n');
      console.log(data);
      console.log('\n');

      // Sending Form Data To Action
      const { result } = await updateCashier(
        selectedCashier ? selectedCashier.id : 0,
        data,
      );

      if (result.status !== 'ok') {
        throw result.msg;
      }
      action.resetForm();

      setCashiers(
        cashiers.map((cashier) =>
          cashier.id === (selectedCashier?.id ?? 0) ? result.account : cashier,
        ),
      );

      toastSwal('success', `${result.msg}`);
    } catch (error: any | string) {
      toastSwal('error', error);
    }
  };

  const handleDelete = async (cashierId: number) => {
    try {
      alert(cashierId);
      const { result } = await deleteCashier(cashierId);
      setCashiers(cashiers.filter((cashier) => cashier.id !== cashierId));

      if (result.status !== 'ok') throw result.msg;

      toastSwal('success', `${result.msg}`);
    } catch (error: any | string) {
      toastSwal('error', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cashier Management</h1>

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
      <br />
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cashiers.map((cashier) => (
              <tr key={cashier.id}  className='hover h-16'>
                <td>{cashier.id}</td>
                <td>{cashier.username}</td>
                <td>{cashier.role}</td>
                <td className="flex gap-5 w-3/6">
                  <button
                    className="btn btn-accent basis-3/6"
                    onClick={() => {
                      setSelectedCashier(cashier); // Set the selected cashier
                      (
                        document.getElementById(
                          'edit-cashier',
                        ) as HTMLDialogElement
                      )?.showModal(); // Show the modal
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-error basis-3/6"
                    onClick={() => {
                      //   setSelectedCashier(cashier); // Set the selected cashier
                      handleDelete(cashier.id);
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
                onSubmit={handleAddSubmit}
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
      {/*  */}

      <dialog id="edit-cashier" className="modal">
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
                  onSubmit={handleEditSubmit}
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
    </div>
  );
};

export default CashierManagement;
