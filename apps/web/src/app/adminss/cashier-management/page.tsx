'use client';

import React, { useState, useEffect } from 'react';
import { fetchCashiers, deleteCashier } from '@/lib/account';
import {
  confirmationWithoutSuccessMessageSwal,
  toastSwal,
} from '@/app/utils/swalHelper';
import { IAccount } from '@/types/accountTypes';
import AddCashier from '@/components/Admins/CashierManagement/AddCashier';
import EditCashier from '@/components/Admins/CashierManagement/EditCashier';

const CashierManagement = () => {
  const [cashiers, setCashiers] = useState<IAccount[]>([]);

  // fetch cashier data
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

  // handle cashier deletion
  const handleDelete = async (cashierId: number) => {
    try {
      const confirm = await confirmationWithoutSuccessMessageSwal(
        `Your'e About To Finalize This Changes`,
        'Are you sure?',
      );

      if (confirm) {
        const { result } = await deleteCashier(cashierId);
        setCashiers(cashiers.filter((cashier) => cashier.id !== cashierId));

        if (result.status !== 'ok') throw result.msg;

        toastSwal('success', `${result.msg}`);
      }
    } catch (error: any | string) {
      toastSwal('error', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cashier Management</h1>

      <AddCashier fetchData={fetchData} />

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
              <tr key={cashier.id} className="hover h-16">
                <td>{cashier.id}</td>
                <td>{cashier.username}</td>
                <td>{cashier.role}</td>
                <td className="flex gap-5 w-3/6">

                  {/* Edit cashier button & modal */}
                  <EditCashier cashier={cashier} fetchData={fetchData} />

                  <button
                    className="btn btn-error basis-3/6"
                    onClick={() => {
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
    </div>
  );
};

export default CashierManagement;
