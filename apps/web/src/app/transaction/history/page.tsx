'use client';

import { useEffect, useRef, useState } from 'react';
import { currencyFormat } from '../../utils/currencyFormat';
import { transactionByCashier } from '@/lib/transaction';
import { toastSwal } from '@/app/utils/swalHelper';

export default function TransactionHistory() {
  const [orders, setOrders] = useState<any[]>([]);

  const fetchOrders = async () => {
    try {
      const { result } = await transactionByCashier();

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
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th>Total Items</th>
            <th>Payment Type</th>
            <th>Total Paid</th>
          </tr>
        </thead>
        <tbody>
          {orders &&
            orders.map((ord) => (
              <tr>
                <td>{ord.totalItems}</td>
                <td>{ord.payType}</td>
                <td>{currencyFormat(ord.totalPaid)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
