'use client';

import React, { useState, useEffect } from 'react';
import {
  confirmationWithoutSuccessMessageSwal,
  simpleSwal,
  toastSwal,
} from '@/app/utils/swalHelper';
import { IStokHistory, IUpdateProduct } from '@/types/productTypes';
import { productStokHistory } from '@/lib/product';

interface StockHistoryProps {
  productId: number;
}

const StockHistory: React.FC<StockHistoryProps> = ({ productId }) => {
  const [stockHistory, setStokHistory] = useState<IStokHistory[]>([]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
  return (
    <>
      <button
        className="btn btn-accent basis-3/6"
        onClick={() => {
          fetchStokHistory(productId);

          (
            document.getElementById(
              `stock-history-${productId}`,
            ) as HTMLDialogElement
          )?.showModal();
        }}
      >
        Stok History
      </button>

      {/*  */}

      <dialog id={`stock-history-${productId}`} className="modal mx-auto items-center justify-center">
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
    </>
  );
};

export default StockHistory;
