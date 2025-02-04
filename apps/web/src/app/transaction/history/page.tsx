'use client';

import { useEffect, useRef, useState } from 'react';
import { currencyFormat } from '../../utils/currencyFormat';
import { transactionHistoryByCashier } from '@/lib/transaction';
import { toastSwal } from '@/app/utils/swalHelper';
import { IOrderItems } from '@/types/transactionTypes';

export default function TransactionHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<IOrderItems[]>([]);

  const fetchOrders = async () => {
    try {
      const { result } = await transactionHistoryByCashier();

      if (result.status !== 'ok') {
        throw `${result.msg}`;
      }

      setOrders(result.orders);
    } catch (error: any) {
      toastSwal('error', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="overflow-x-auto p-6">
      <h1 className="text-xl font-semibold tracking-wider">
        Transaction History
      </h1>
      {/* history list */}
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th>Total Items</th>
            <th>Payment Type</th>
            <th>Total Paid</th>
            <th>Payment Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.map((ord) => (
              <tr key={ord.id}>
                <td>{ord.totalItems}</td>
                <td>{ord.payType}</td>
                <td>{currencyFormat(ord.totalPaid)}</td>
                <td>
                  {new Date(ord.createdAt).toLocaleString('id-ID', {
                    timeZone: 'Asia/Bangkok',
                  })}
                </td>
                <td>
                  {/* Transaction detail modal button */}
                  <button
                    className="btn btn-accent basis-3/6"
                    onClick={async () => {
                      setSelectedOrder(ord.orderItems);
                      (
                        document.getElementById(
                          `transaction-detail`,
                        ) as HTMLDialogElement
                      )?.showModal();
                    }}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* Transaction detail modal content */}
      <dialog id={`transaction-detail`} className="modal">
        <div className="modal-box overflow-x-auto">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <table className="table table-zebra">
            {/* head */}
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder &&
                selectedOrder.map((orditm) => (
                  <tr key={orditm.id}>
                    <td>{orditm.Product?.productName}</td>
                    <td>{currencyFormat(orditm.price)}</td>
                    <td>{orditm.quantity}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </dialog>
    </div>
  );
}
