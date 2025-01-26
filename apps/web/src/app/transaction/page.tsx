'use client';

import { useEffect, useRef, useState } from 'react';
import { currencyFormat } from '../utils/currencyFormat';
import { useRouter } from 'next/navigation';
import { finalizedTransaction, getActiveTransaction } from '@/lib/transaction';
import {
  confirmationSwal,
  confirmationWithoutSuccessMessageSwal,
  simpleSwal,
  toastSwal,
} from '../utils/swalHelper';

export default function Transaction() {
  const router = useRouter();

  const [order, setOrder] = useState<any>();
  const [orderItems, setOrderItems] = useState<IOrderItems[]>([]);

  const amountRef = useRef<HTMLInputElement | null>(null);
  const debitCardRef = useRef<HTMLInputElement | null>(null);

  const getActiveOrder = async () => {
    try {
      const { result } = await getActiveTransaction();

      if (result.status !== 'ok') throw result.msg;

      setOrder(result.order);

      setOrderItems(result.orderItems);
    } catch (error: any) {
      toastSwal('error', `${error}`);
    }
  };

  useEffect(() => {
    getActiveOrder();
  }, []);

  //orderId,payType,amount,debitCard

  const handleTransactionFinalizeCash = async () => {
    try {
      const currentTime = new Date();
      const formattedDateTime = currentTime.toISOString();

      const amount = amountRef.current?.value;
      const debitCard = debitCardRef.current?.value || '';

      if (Number(amount) < order.totalPrice) throw 'Insufficient Amount';

      const res = await confirmationWithoutSuccessMessageSwal(
        `Your'e About To Finalize This Transaction`,
        'Are you sure?',
      );

      if (res) {
        const { result } = await finalizedTransaction(
          order.id,
          'CASH',
          Number(amount),
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

  const handleTransactionFinalizeDebit = async () => {
    try {
      const currentTime = new Date();
      const formattedDateTime = currentTime.toISOString();

      const amount = amountRef.current?.value;
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

  return (
    <div className="flex flex-col border-0 border-red-600 w-full h-full mx-auto p-7  bg-zinc-50 items-center gap-11">
      <h1 className="text-center text-4xl font-bold tracking-wide">
        Checkout Order
      </h1>
      <button className="btn btn-outline btn-error">cancel transaction</button>
      <div className="flex flex-col gap-14 w-5/6 border-t-8 border-accent rounded-xl py-12 items-center">
        {orderItems &&
          orderItems?.map((oi) => (
            <div
              className="flex gap-2 w-4/6 border-x-4 rounded-md h-fit"
              key={oi.id}
            >
              <div className="basis-2/6 h-36 border-2 border-red-500"></div>
              <div className="basis-4/6 ">
                <h1>{oi.Product.productName}</h1>
                <h2>{oi.quantity}</h2>
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
                <p className="py-4">Enter Customer's payment</p>
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
                  <p className="py-4">Enter Customer's debit credential</p>
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
      </div>
    </div>
  );
}
