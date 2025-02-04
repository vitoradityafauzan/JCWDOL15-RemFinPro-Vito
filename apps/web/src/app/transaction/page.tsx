/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useRef, useState } from 'react';
import { currencyFormat } from '../utils/currencyFormat';
import { useRouter } from 'next/navigation';
import {
  cancelTransaction,
  finalizedTransaction,
  getActiveTransaction,
} from '@/lib/transaction';
import {
  confirmationWithoutSuccessMessageSwal,
  simpleSwal,
  toastSwal,
} from '../utils/swalHelper';
import { IOrderItems } from '@/types/transactionTypes';

export default function Transaction() {
  const router = useRouter();

  const amountRef = useRef<HTMLInputElement | null>(null);
  const debitCardRef = useRef<HTMLInputElement | null>(null);

  // Fetch pending transaction order and its items
  const [order, setOrder] = useState<any>();
  const [orderItems, setOrderItems] = useState<IOrderItems[]>([]);

  const getActiveOrder = async () => {
    try {
      const { result } = await getActiveTransaction();

      if (result.status !== 'ok') throw result.msg;

      setOrder(result.order);

      setOrderItems(result.orderItems);
    } catch (error: any) {
      toastSwal('error', `${error}`);

      router.push('/');
    }
  };

  useEffect(() => {
    getActiveOrder();
  }, []);

  // Handle payment by cash
  const handleTransactionFinalizeCash = async () => {
    try {
      const currentTime = new Date();
      const formattedDateTime = currentTime.toISOString();

      const amount = amountRef.current?.value;

      let res: any = null;

      if (Number(amount) < order.totalPrice) throw 'Insufficient Amount';

      if (Number(amount) > order.totalPrice) {
        res = await confirmationWithoutSuccessMessageSwal(
          `Your'e About To Finalize This Transaction With The Change Of ${currencyFormat(Number(amount) - order.totalPrice)}`,
          'Are you sure?',
        );
      } else {
        res = await confirmationWithoutSuccessMessageSwal(
          `Your'e About To Finalize This Transaction`,
          'Are you sure?',
        );
      }

      if (res) {
        const { result } = await finalizedTransaction(
          order.id,
          'CASH',
          Number(amount),
          Number(amount) - order.totalPrice,
          '',
          formattedDateTime,
        );

        if (result.status !== 'ok') throw result.msg;

        router.push('/');

        simpleSwal('success', `${result.msg}`);
      }
    } catch (error: any) {
      toastSwal('error', `${error}`);
    }
  };

  // Handle payment by debit
  const handleTransactionFinalizeDebit = async () => {
    try {
      const currentTime = new Date();
      const formattedDateTime = currentTime.toISOString();

      const debitCard = debitCardRef.current?.value || '';

      const res = await confirmationWithoutSuccessMessageSwal(
        `Your'e About To Finalize This Transaction`,
        'Are you sure?',
      );

      if (res) {
        const { result } = await finalizedTransaction(
          order.id,
          'DEBIT',
          Number(order.totalPrice),
          0,
          debitCard,
          formattedDateTime,
        );

        if (result.status !== 'ok') throw result.msg;

        router.push('/');

        simpleSwal('success', `${result.msg}`);
      }
    } catch (error: any) {
      toastSwal('error', `${error}`);
    }
  };

  // Handle transaction cancelation
  const handleCancelTransaction = async () => {
    try {
      const confirm = await confirmationWithoutSuccessMessageSwal(
        `Your'e About To Finalize This Changes`,
        'Are you sure?',
      );

      if (confirm) {
        const { result } = await cancelTransaction();

        if (result.status !== 'ok') throw `${result.msg}`;

        router.push('/');

        toastSwal('success', `${result.msg}`);
      }
    } catch (error: any) {
      toastSwal('error', `${error}`);
    }
  };

  return (
    <div className="flex flex-col border-0 border-red-600 w-full h-full mx-auto p-7  bg-zinc-50 items-center gap-11">
      <h1 className="text-center text-4xl font-bold tracking-wide">
        Checkout Order
      </h1>
      <button
        className="btn btn-outline btn-error"
        onClick={handleCancelTransaction}
      >
        cancel transaction
      </button>
      <div className="flex flex-col gap-14 w-5/6 border-t-8 border-accent rounded-xl py-12 items-center">
        {/* Transaction items */}
        {orderItems &&
          orderItems?.map((oi) => (
            <div
              className="flex gap-2 w-2/6 border-x-4 rounded-md h-fit p-6"
              key={oi.id}
            >
              <div className="flex flex-col gap-4 text-lg">
                <h1 className="font-bold">{oi.Product?.productName}</h1>
                <h2>x{oi.quantity}</h2>
                <h2>{currencyFormat(oi.totalPrice)}</h2>
              </div>
            </div>
          ))}
      </div>
      <div className="flex flex-col gap-6 w-5/6 border-b-8 border-accent rounded-xl py-12 items-center justify-center text-center ">
        <h1 className=" text-[1.8rem] font-bold tracking-wide">Total Price</h1>
        {order && (
          <h2 className=" text-[1.8rem] font-medium tracking-wide">
            {currencyFormat(order.totalPrice)}
          </h2>
        )}
        <div className="flex gap-14 w-3/6 ">
          {/* Cash pay button */}
          <button
            className="btn btn-accent basis-3/6"
            onClick={() => {
              (
                document.getElementById('cash-pay') as HTMLDialogElement
              )?.showModal();
            }}
          >
            Cash
          </button>
          {/* Debit pay method */}
          <button
            className="btn btn-accent basis-3/6"
            onClick={() => {
              (
                document.getElementById('debit-pay') as HTMLDialogElement
              )?.showModal();
            }}
          >
            Debit
          </button>
        </div>
      </div>
      {/* Cash pay modal */}
      <dialog id="cash-pay" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex flex-col gap-5 items-center">
            <h3 className="font-bold text-lg">Pay By Cash</h3>
            <p className="py-4">Enter Customers payment</p>
            <input
              type="number"
              placeholder="amount"
              className="input input-bordered input-accent input-sm max-w-xs text-sm"
              id="amount"
              ref={amountRef}
            />
            <form method="dialog">
              <button
                className="btn btn-outline btn-accent"
                onClick={handleTransactionFinalizeCash}
              >
                checking
              </button>
            </form>
          </div>
        </div>
      </dialog>
      {/* Debit pay modal */}
      <dialog id="debit-pay" className="modal">
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
              <p className="py-4">Enter Customers debit credential</p>
              <input
                type="text"
                placeholder="debit credential"
                className="input input-bordered input-accent input-sm max-w-xs text-sm"
                id="debitCard"
                ref={debitCardRef}
              />
            </div>
            <form method="dialog">
              <button
                className="btn btn-outline btn-accent"
                onClick={handleTransactionFinalizeDebit}
              >
                checking
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
