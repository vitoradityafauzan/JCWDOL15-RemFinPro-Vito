'use client';

import React from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ImEnter, ImExit, ImStatsDots } from 'react-icons/im';
import { PiCashRegisterThin } from 'react-icons/pi';

export const SideBar: React.FC = () => {
  const pathname = usePathname();
  const showSideBar = pathname !== '/login';

  return (
    <>
      {showSideBar && (
        <div className="flex flex-col gap-6 ">
          <div className="w-fit h-fit p-4">
            <Image
              src={`/image/Cashewier-2-150px(3).png`}
              alt="main icon"
              width={58}
              height={34}
              className=""
            />
          </div>
          <div className="flex flex-col gap-9 w-16 bg-red-400 border-2">
            <button className=" ">
              <ImStatsDots />
              uu
            </button>
            <button className="">
              <PiCashRegisterThin />
            </button>
            <button className="">
              <ImEnter />
            </button>
            <button className="">
              <ImExit />
            </button>
          </div>
        </div>
      )}
    </>

    // <div className="flex flex-col w-fit justify-between px-10 gap-9 bg-slate-50">
    //   <div className="w-64 h-fit">
    //     <Image
    //       src={`/image/Cashewier-2-150px(3).png`}
    //       alt="main icon"
    //       width={0}
    //       height={0}
    //       sizes="100vw"
    //       className="w-full h-full"
    //     />
    //     <p>lllalalslls</p>
    //   </div>
    //   {/* {showSideBar && (
    //     <ul className="menu bg-base-200 rounded-box text-lg gap-6 items-center">
    //       <li>
    //         <a className="tooltip tooltip-right" data-tip="Home">
    //           <ImStatsDots />
    //         </a>
    //       </li>
    //       <li>
    //         <a className="tooltip tooltip-right" data-tip="Details">
    //           <ImEnter />
    //         </a>
    //       </li>
    //       <li>
    //         <a className="tooltip tooltip-right" data-tip="Stats">
    //           h
    //         </a>
    //       </li>
    //     </ul>
    //   )} */}
    //   <div className="border-2 border-yellow-400 flex flex-col gap-20 space-y-20 items-center">
    //     <button className="btn btn-ghost">
    //       <ImStatsDots />
    //     </button>
    //     <button className="btn btn-ghost">
    //       <ImStatsDots />
    //     </button>
    //     <button className="btn btn-ghost">
    //       <ImStatsDots />
    //     </button>
    //     <button className="btn btn-ghost">
    //       <ImStatsDots />
    //     </button>
    //   </div>
    // </div>

    //
    //
    //

    // <div className="flex flex-col flex-wrap w-[250px] gap-6 grow-0 border-2 border-green-600">
    //   <div className="border-2">
    //     <p></p>
    //   </div>
    //   <div className="border-4">
    //     <p></p>
    //   </div>
    // </div>
  );
};
