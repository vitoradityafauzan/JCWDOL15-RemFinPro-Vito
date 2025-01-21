'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ImEnter, ImExit, ImStatsDots } from 'react-icons/im';
import { PiCashRegisterThin } from 'react-icons/pi';

export function SideBar() {
  const pathname = usePathname();
  const showSideBar = pathname !== '/login';

  if (!showSideBar) {
    return null;
  }

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
        <button
          className="tooltip tooltip-right ease-in duration-150 p-3 rounded-md border-2 text-zinc-800 bg-accent hover:bg-white"
          data-tip="Clock In Shift"
        >
          <ImEnter />
        </button>
        <button
          className="tooltip tooltip-right ease-in duration-150 p-3 rounded-md text-accent bg-white hover:bg-accent hover:text-zinc-800"
          data-tip="Clock Out Shift"
        >
          <ImExit />
        </button>
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
