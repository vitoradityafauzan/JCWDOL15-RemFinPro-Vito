'use client';

import { currencyFormat } from '@/app/utils/currencyFormat';
import {
  confirmationSwal,
  confirmationWithoutSuccessMessageSwal,
  toastSwal,
} from '@/app/utils/swalHelper';
import {
  cashierCheckIn,
  cashierCheckOut,
  getUserIdFromToken,
} from '@/lib/account';
import { deleteCookie, getCookie } from 'cookies-next';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ImEnter, ImExit, ImStatsDots } from 'react-icons/im';
import { PiCashRegisterThin } from 'react-icons/pi';
import Swal from 'sweetalert2';

export function SideBar() {
  const [checkInCookie, setCheckInCookie] = useState<any>(null);

  // const fetchCheckInCookie = async () => {
  //   const checkInCookie = getCookie('cashewier-cashiercheckin');

  //   if (checkInCookie) {
  //     const newCookie = JSON.parse(checkInCookie as string);
  //     setCheckInCookie(newCookie);
  //   }
  // };

  const fetchCheckInCookie = async () => {
    const checkInCookie = getCookie('cashewier-cashiercheckin');

    if (checkInCookie) {
      const newCookie = JSON.parse(checkInCookie as string);
      setCheckInCookie(newCookie);
    } else {
      setCheckInCookie(null);
    }
  };

  useEffect(() => {
    fetchCheckInCookie();
  }, []); // Empty dependency array to run the effect only once

  const pathname = usePathname();
  const showSideBar = pathname !== '/login';

  if (!showSideBar) {
    return null;
  }

  const handleCashierCheckin = async () => {
    const currentTime = new Date();

    // Example of formatting the date and time
    const formattedDate = currentTime.toLocaleDateString(); // e.g., "9/8/2023"
    const formattedTime = currentTime.toLocaleTimeString(); // e.g., "10:30:15 AM"

    // Format the date and time in ISO 8601 format
    const formattedDateTime = currentTime.toISOString();

    const { value: cashAmount } = await Swal.fire({
      title: 'Enter The Amount Of Cash',
      input: 'number',
      inputLabel: 'cash amount',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      },
    });

    if (cashAmount) {
      // const res = await confirmationSwal(
      //   `Cash Amount Is ${currencyFormat(cashAmount)}`,
      //   'Are you sure?',
      //   `Checked in successfully At ${formattedDate}, ${formattedTime}`,
      // );

      const res = await confirmationWithoutSuccessMessageSwal(
        `Cash Amount Is ${currencyFormat(cashAmount)}`,
        'Are you sure?',
      );

      if (res) {
        const { userId } = await getUserIdFromToken();
        if (userId && typeof userId === 'number' && userId > 0) {
          await cashierCheckIn(userId, cashAmount, formattedDateTime);

          // Refresh the checkInCookie state
          await fetchCheckInCookie();

          toastSwal(
            'success',
            `Checked in successfully At ${formattedDate}, ${formattedTime}`,
          );
        } else {
          toastSwal('error', 'User ID not found');
        }
      }
    }
  };

  const handleCashierCheckOut = async () => {
    const currentTime = new Date();

    // Example of formatting the date and time
    const formattedDate = currentTime.toLocaleDateString(); // e.g., "9/8/2023"
    const formattedTime = currentTime.toLocaleTimeString(); // e.g., "10:30:15 AM"

    // Format the date and time in ISO 8601 format
    const formattedDateTime = currentTime.toISOString();

    const { value: cashAmount } = await Swal.fire({
      title: 'Enter The New Amount Of Cash',
      input: 'number',
      inputLabel: 'cash amount',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      },
    });

    if (cashAmount) {
      // const res = await confirmationSwal(
      //   `Cash Amount Is ${currencyFormat(cashAmount)}`,
      //   'Are you sure?',
      //   `Checked in successfully At ${formattedDate}, ${formattedTime}`,
      // );

      const res = await confirmationWithoutSuccessMessageSwal(
        `Cash Amount Is ${currencyFormat(cashAmount)}`,
        'Are you sure?',
      );

      if (res) {
        await cashierCheckOut(cashAmount, formattedDateTime);

        deleteCookie('cashewier-cashiercheckin');

        setCheckInCookie(null);

        toastSwal(
          'success',
          `Checked Out successfully At ${formattedDate}, ${formattedTime}`,
        );
      }
    }
  };

  return (
    <div className="border-0 hidden lg:flex flex-col gap-9 w-fit pt-9 px-2">
      <div className="w-fit h-fit">
        <Image
          src={`/image/Cashewier-2-150px(3).png`}
          alt="main icon"
          width={58}
          height={34}
          className=""
        />
      </div>
      <div className="flex flex-col gap-5 items-center text-xl">
        {checkInCookie?.userId ? (
          <button
            className="tooltip tooltip-right ease-in duration-150 p-3 rounded-md text-accent bg-white hover:bg-accent hover:text-zinc-800"
            data-tip="Clock Out Shift"
            onClick={handleCashierCheckOut}
          >
            <ImExit /> {checkInCookie.userId}
          </button>
        ) : (
          <button
            className="tooltip tooltip-right ease-in duration-150 p-3 rounded-md border-2 text-zinc-800 bg-accent hover:bg-white"
            data-tip="Clock In Shift"
            onClick={handleCashierCheckin}
          >
            <ImEnter />
          </button>
        )}
        <button
          className="tooltip tooltip-right ease-in duration-150 p-3 rounded-md text-accent bg-white hover:bg-accent hover:text-zinc-800"
          data-tip="Transaction History"
        >
          <ImStatsDots />
        </button>
        <button
          className="tooltip tooltip-right ease-in duration-150 p-3 rounded-md text-accent bg-white hover:bg-accent hover:text-zinc-800"
          data-tip="Open Transaction"
        >
          <PiCashRegisterThin />
        </button>
      </div>
    </div>
  );
}
