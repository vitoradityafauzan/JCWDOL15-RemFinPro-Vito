'use client';

import { usePathname } from 'next/navigation';
import { IoSearchOutline } from 'react-icons/io5';
import { HeaderModal } from './HeaderModal';
import { PiGearFineFill } from 'react-icons/pi';

export const Header = () => {
  const pathname = usePathname();
  const showHeader = pathname !== '/login';

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
        <div className="navbar bg-white border-l-2 border-zinc-100">
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
                  <a>Open Transaction</a>
                </li>
                <li>
                  <a>Start Shift</a>
                </li>
                <li>
                  <a>End Shift</a>
                </li>
                <li>
                  <a>History</a>
                </li>
              </ul>
            </div>
            {/* Searching */}
            {/* <input
              type="text"
              placeholder="Type here"
              className="input input-bordered input-sm lg:input-md w-full max-w-xs"
            />
            <button className="btn btn-sm bg-[#ddded8] text-slate-800 tracking-widest">
              <IoSearchOutline />
            </button> */}
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
            {/* <div className="flex items-center gap-1 lg:gap-6"> */}
            {/* Search Modal */}
            {/* <div className="form-control">
                <button className="btn btn-sm btn-outline btn-accent tracking-widest">
                  <IoSearchOutline className='text-black' />
                </button>
              </div> */}
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
                {/* <li>
                    <a className="justify-between">
                      Profile
                      <span className="badge">New</span>
                    </a>
                  </li>
                  <li>
                    <a>Settings</a>
                  </li> */}
                <li>
                  <a className="text-red-500">Logout</a>
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
