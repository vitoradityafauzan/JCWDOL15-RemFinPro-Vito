'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function Adminss() {
  //   const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-full h-full flex justify-center items-center bg-green-400/40">
      <div className="h-fit p-20 grid grid-cols-3 justify-center items-center gap-6 bg-zinc-50 rounded-md">
        <button
          className="btn btn-outline btn-accent"
          onClick={() => {
            router.push('/adminss/cashier-management');
          }}
        >
          Cashier Account
        </button>
        <button
          className="btn btn-outline btn-accent"
          onClick={() => {
            router.push('/adminss/product-management');
          }}
        >
          Products
        </button>
        <button
          className="btn btn-outline btn-accent"
          onClick={() => {
            router.push('/adminss/sales-history');
          }}
        >
          Sales History
        </button>
      </div>
    </div>
  );
}
