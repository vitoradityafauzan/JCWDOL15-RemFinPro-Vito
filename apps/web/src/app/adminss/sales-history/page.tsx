/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  transactionAccumulatedSales,
  transactionAll,
  transactionTotalItemPerDay,
  transactionAbnormalPayment,
  transactionShiftAll,
  transactionShiftDetail,
} from '@/lib/transaction';
import { toastSwal } from '@/app/utils/swalHelper';
import { currencyFormat } from '@/app/utils/currencyFormat';

const SalesHistory = () => {
  // essential settings
  const [salesHistory, setSalesHistory] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [historyPart, setHistoryPart] = useState('main');
  const [shiftDetail, setShiftDetail] = useState<any>();

  // Fetching all transactions
  const fetchData = async () => {
    try {
      setSalesHistory([]);
      const { result } = await transactionAll(sortOrder);
      setSalesHistory(result.transactions);
    } catch (error: any) {
      toastSwal('error', `${error}`);
    }
  };

  // Fetching accumulated sales prices
  const fetchData2 = async () => {
    try {
      setSalesHistory([]);
      const { result } = await transactionAccumulatedSales(sortOrder);
      setSalesHistory(result.transactions);
    } catch (error: any) {
      toastSwal('error', `${error}`);
    }
  };

  // Fetching total item sold per day
  const fetchData3 = async () => {
    try {
      setSalesHistory([]);
      const { result } = await transactionTotalItemPerDay();
      setSalesHistory(result.transactions);
    } catch (error: any) {
      toastSwal('error', `${error}`);
    }
  };

  // Fetching abnormal shift data by total transaction
  const fetchData4 = async () => {
    try {
      setSalesHistory([]);
      const { result } = await transactionAbnormalPayment();
      setSalesHistory(result.transactions);
    } catch (error: any) {
      toastSwal('error', `${error}`);
    }
  };

  // Fetching shifts data
  const fetchData5 = async () => {
    try {
      setSalesHistory([]);
      const { result } = await transactionShiftAll();
      setSalesHistory(result.shifts);
    } catch (error: any) {
      toastSwal('error', `${error}`);
    }
  };

  // Fetching details for shifts data
  const fetchData5Detail = async (shiftId: number) => {
    try {
      const { result } = await transactionShiftDetail(shiftId);

      setShiftDetail(result);
    } catch (error: any) {
      toastSwal('error', `${error}`);
    }
  };

  // Automatically fetch all transactions
  useEffect(() => {
    fetchData();
  }, []);

  // Handle sorting by dates
  const handleSortChange = (which: number) => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));

    if (which === 1) {
      fetchData();
    } else {
      fetchData2();
    }
  };

  // Handle content change
  const handleHistoryPart = () => {
    switch (historyPart) {
      // all transactions
      case 'main':
        return (
          <div className="flex flex-col w-full">
            <button
              className="btn btn-primary mb-4 w-40"
              onClick={() => handleSortChange(1)}
            >
              Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
            </button>
            <div className="overflow-x-auto">
              <table className="table-zebra w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cashier ID</th>
                    <th>Total Items</th>
                    <th>Payment Type</th>
                    <th>Total Price</th>
                    <th>Total Price Paid</th>
                    <th>Payment Status</th>
                    <th>Created Date</th>
                    <th>Updated Date</th>
                  </tr>
                </thead>
                <tbody className="gap-4 text-center">
                  {salesHistory.map((order) => (
                    <tr key={order.id} className="hover h-16">
                      <td>{order.id}</td>
                      <td>{order.cashierId}</td>
                      <td>{order.totalItems}</td>
                      <td>{order.payType}</td>
                      <td className="pl-4">
                        {currencyFormat(order.totalPrice)}
                      </td>
                      <td className="pl-4">
                        {currencyFormat(order.totalPaid)}
                      </td>
                      <td className="pl-4">{order.status}</td>
                      <td className="pl-4">
                        {new Date(order.createdAt).toLocaleString('id-ID', {
                          timeZone: 'Asia/Bangkok',
                        })}
                      </td>
                      <td className="pl-4">
                        {new Date(order.updatedAt).toLocaleString('id-ID', {
                          timeZone: 'Asia/Bangkok',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // accumulated sales prices
      case 'accumulated-sales':
        return (
          <div className="flex flex-col w-full">
            <button
              className="btn btn-primary mb-4 w-40"
              onClick={() => handleSortChange(2)}
            >
              Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
            </button>
            <div className="overflow-x-auto">
              <table className="table-zebra w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Total Sale Price</th>
                    <th>Total Sale Amount</th>
                  </tr>
                </thead>
                <tbody className="gap-4 text-center">
                  {salesHistory.map((order) => (
                    <tr key={order.id} className="hover h-16">
                      <td className="pl-4">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="pl-4">
                        {currencyFormat(order.totalAmount)}
                      </td>
                      <td className="pl-4">{order.totalOrders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      // total item sold per day
      case 'total-items':
        return (
          <div className="flex flex-col w-full">
            <table className="table-zebra w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product ID</th>
                  <th>Total Items</th>
                </tr>
              </thead>
              <tbody className="gap-4 text-center">
                {salesHistory.map((order) => (
                  <tr key={order.productId} className="hover h-16">
                    <td className="pl-4">
                      {new Date(order.date).toLocaleDateString('id-ID', {
                        timeZone: 'Asia/Bangkok',
                      })}
                    </td>
                    <td className="pl-4">{order.productId}</td>
                    <td className="pl-4">{order.totalItem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      // abnormal shift data by total transaction
      case 'abnormal-payment':
        return (
          <div className="flex flex-col w-full">
            <table className="table-zebra w-full">
              <thead>
                <tr>
                  <th>Shift ID</th>
                  <th>Cashier</th>
                  <th>Current Cash Total</th>
                  <th>Total Order</th>
                  <th>New Cash Total</th>
                  <th>Cash Difference</th>
                </tr>
              </thead>
              <tbody className="gap-4 text-center">
                {salesHistory.map((order) => (
                  <tr key={order.shiftId} className="hover h-16">
                    <td className="pl-4">{order.shiftId}</td>
                    <td className="pl-4">{order.cashier}</td>
                    <td className="pl-4">
                      {currencyFormat(order.currentCashTotal)}
                    </td>
                    <td className="pl-4">{currencyFormat(order.totalOrder)}</td>
                    <td className="pl-4">
                      {currencyFormat(order.newCashTotal)}
                    </td>
                    <td className="pl-4">
                      {currencyFormat(order.cashDifference)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      // shifts data
      case 'shift-all':
        return (
          <div className="flex flex-col w-full">
            <table className="table-zebra w-full">
              <thead>
                <tr>
                  <th>Shift ID</th>
                  <th>Cashier</th>
                  <th>Checked In Time</th>
                  <th>Current Cash Total</th>
                  <th>Checked Out Time</th>
                  <th>New Cash Total</th>
                  <th>Detail</th>
                </tr>
              </thead>
              <tbody className="gap-4 text-center">
                {salesHistory.map((order) => (
                  <tr key={order.id} className="hover h-16">
                    <td className="pl-4">{order.id}</td>
                    <td className="pl-4">{order.User?.username}</td>
                    <td className="pl-4">
                      {new Date(order.CheckInTime).toLocaleString('id-ID', {
                        timeZone: 'Asia/Bangkok',
                      })}
                    </td>
                    <td className="pl-4">
                      {currencyFormat(order.currentCashTotal)}
                    </td>
                    <td className="pl-4">
                      {new Date(order.CheckoutTime).toLocaleString('id-ID', {
                        timeZone: 'Asia/Bangkok',
                      })}
                    </td>
                    <td className="pl-4">
                      {currencyFormat(order.newCashTotal)}
                    </td>
                    <td className="pl-4">
                      <button
                        className="btn btn-accent basis-3/6"
                        onClick={async () => {
                          await fetchData5Detail(order.id);

                          (
                            document.getElementById(
                              'shift-detail',
                            ) as HTMLDialogElement
                          )?.showModal(); // Show the modal
                        }}
                      >
                        Stok History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return (
          <div className="flex flex-col">
            <h1>ssss</h1>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-8 p-4">
      <h1 className="text-2xl font-bold">Sales History</h1>
      <div className="flex gap-7">
        {/* button for all transactions */}
        <button
          className="btn btn-outline"
          onClick={async () => {
            await fetchData();

            setHistoryPart('main');
          }}
        >
          Main
        </button>
        {/* button for accumulated sales prices */}
        <button
          className="btn btn-outline"
          onClick={async () => {
            await fetchData2();

            setHistoryPart('accumulated-sales');
          }}
        >
          Accumulated Sales
        </button>
        {/* button for total item sold per day */}
        <button
          className="btn btn-outline"
          onClick={async () => {
            await fetchData3();

            setHistoryPart('total-items');
          }}
        >
          Total Item Sold Per Day
        </button>
        {/* button for abnormal shift data by total transaction */}
        <button
          className="btn btn-outline"
          onClick={async () => {
            await fetchData4();

            setHistoryPart('abnormal-payment');
          }}
        >
          Abnormal Payment
        </button>
        {/* button for shifts data */}
        <button
          className="btn btn-outline"
          onClick={async () => {
            await fetchData5();

            setHistoryPart('shift-all');
          }}
        >
          Shifts History
        </button>
      </div>
      {handleHistoryPart()}

      {/* modal for shifts data detail */}

      <dialog id="shift-detail" className="modal">
        {shiftDetail && (
          <div className="modal-box w-fit">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <div className="flex gap-5 mb-7 text-sm font-medium tracking-wider">
              <h2>
                Total Transaction by cash, {shiftDetail.totalCashTransactions}
              </h2>
              <h2>
                Total Transaction by debit, {shiftDetail.totalDebitTransactions}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Total Items</th>
                    <th>Payment Type</th>
                    <th>Payment Status</th>
                    <th>Total Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {shiftDetail.transactions?.map((shiftd: any) => (
                    <tr key={shiftd.id}>
                      <td>{shiftd.id}</td>
                      <td>{shiftd.totalItems}</td>
                      <td>{shiftd.payType}</td>
                      <td>{shiftd.status}</td>
                      <td>
                        {shiftd.status === 'PAID'
                          ? currencyFormat(shiftd.totalPaid)
                          : 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </dialog>

      {/*  */}
    </div>
  );
};

export default SalesHistory;
