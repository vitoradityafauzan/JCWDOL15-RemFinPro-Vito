'use client';

import { usePathname, useRouter } from 'next/navigation';
import { IoSearchOutline } from 'react-icons/io5';
import { HeaderModal } from './HeaderModal';
import { PiGearFineFill } from 'react-icons/pi';
import { deleteToken } from '@/lib/account';
import { deleteCookie, getCookie } from 'cookies-next';
import Swal from 'sweetalert2';
import { toastFailed } from '@/app/utils/toastHelper';
import { useEffect } from 'react';

export const Header = () => {
  const router = useRouter();
  const toastSeeFailed = (message: string) => toastFailed(message);

  const pathname = usePathname();
  const showHeader = pathname !== '/login';

  const handleLogout = async () => {
    await deleteCookie('cashewier-token');

    Swal.fire({
      titleText: `Successfully Logged Out`,
      icon: 'success',
      confirmButtonText: 'Ok',
      timer: 4000,
    });

    router.push('/');
  };

  const checkSession = async () => {
    try {
      const token = await getCookie('cashewier-token');

      if (!token) throw 'Please Login Before Accessing Profile!';
    } catch (err: any) {
      if (err === 'Please Login Before Accessing Profile!') {
        toastSeeFailed(`${err}`);

        router.push('/login');
      } else {
        toastSeeFailed(`${err}`);
      }
    }
  };

  useEffect(() => {
    if (showHeader) checkSession();
  }, []);

  return (
    <>
      {showHeader && (
        // <div className="navbar bg-base-100">
        //   <div className="navbar-start">
        //     <div className="dropdown">
        //       <div
        //         tabIndex={0}
        //         role="button"
        //         className="btn btn-ghost lg:hidden"
        //       >
        //         <svg
        //           xmlns="http://www.w3.org/2000/svg"
        //           className="h-5 w-5"
        //           fill="none"
        //           viewBox="0 0 24 24"
        //           stroke="currentColor"
        //         >
        //           <path
        //             strokeLinecap="round"
        //             strokeLinejoin="round"
        //             strokeWidth="2"
        //             d="M4 6h16M4 12h8m-8 6h16"
        //           />
        //         </svg>
        //       </div>
        //       <ul
        //         tabIndex={0}
        //         className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
        //       >
        //         <li>
        //           <a>Item 1</a>
        //         </li>
        //         <li>
        //           <a>Parent</a>
        //           <ul className="p-2">
        //             <li>
        //               <a>Submenu 1</a>
        //             </li>
        //             <li>
        //               <a>Submenu 2</a>
        //             </li>
        //           </ul>
        //         </li>
        //         <li>
        //           <a>Item 3</a>
        //         </li>
        //       </ul>
        //     </div>
        //     <a className="btn btn-ghost text-xl">daisyUI</a>
        //   </div>
        //   <div className="navbar-center hidden lg:flex">
        //     <ul className="menu menu-horizontal px-1">
        //       <li>
        //         <a>Item 1</a>
        //       </li>
        //       <li>
        //         <details>
        //           <summary>Parent</summary>
        //           <ul className="p-2">
        //             <li>
        //               <a>Submenu 1</a>
        //             </li>
        //             <li>
        //               <a>Submenu 2</a>
        //             </li>
        //           </ul>
        //         </details>
        //       </li>
        //       <li>
        //         <a>Item 3</a>
        //       </li>
        //     </ul>
        //   </div>
        //   <div className="navbar-end">
        //     <a className="btn">Button</a>
        //   </div>
        // </div>
        <div className="navbar bg-white border-0 ">
          {/* Left Side w dropdown button */}
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a>Clock In Shift</a>
                </li>
                <li>
                  <a>Clock Out Shift</a>
                </li>
                <li>
                  <a>Transaction History</a>
                </li>
                <li>
                  <a>Open Transacion</a>
                </li>
              </ul>
            </div>
            <h1 className="text-md lg:hidden font-bold text-[#72d9c8]">
              Cashewier
            </h1>
          </div>
          <div className="navbar-center hidden lg:flex">
            <h1 className="text-sm lg:text-2xl font-bold text-white lg:text-[#72d9c8]">
              Cashewier
            </h1>
          </div>
          <div className="navbar-end flex items-center gap-1 lg:gap-6">
            {/* Search Modal */}
            <HeaderModal />
            {/* Avatar */}
            <div className="dropdown dropdown-end">
              {/* Avatar img */}
              {/* <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS Navbar component"
                      src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    />
                  </div>
                </div> */}
              <button className="btn btn-outline btn-sm btn-error text-lg">
                <PiGearFineFill />
              </button>
              {/* Avatar drawer */}
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <a className="text-red-500" onClick={handleLogout}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
            {/* </div> */}
          </div>
        </div>
      )}
    </>
  );
};
