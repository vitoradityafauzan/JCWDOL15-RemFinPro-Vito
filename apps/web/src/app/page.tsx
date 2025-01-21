import * as React from 'react';
// import { Spinner } from '@nextui-org/react';
import Image from 'next/image';
import { ProductCard } from '@/components/product/ProductCard';

export default function Home() {
  return (
    // bg-[#b9e1da]
    <div className="grid grid-cols-3 min-h-screen bg-zinc-100">
      {/* Product List */}
      <div className="col-span-2 h-full grid grid-cols-3 gap-9 p-5 ">
        <ProductCard
          name="Coffee"
          image="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          imgAlt="coffee"
          price={10.99}
        />
        <ProductCard
          name="Herbal Coffee"
          image="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          imgAlt="herbs coffee"
          price={15.99}
        />
        <ProductCard
          name="White Coffee"
          image="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          imgAlt="white coffee"
          price={13.99}
        />
      </div>

      {/* Cart */}
      <div className="h-full flex flex-col p-5 justify-between bg-zinc-50">
        <div className="basis 4/6 flex flex-col flex-wrap gap-8">
          <div className="h-fit">
            <h1 className="text-xl text-center ">Current Cart</h1>
          </div>
          {/* Cart content */}
          <div className="flex flex-col gap-4">
            {/* <div className="flex justify-between">
              <div className="border-2 basis-4/12 h-14">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                  alt="coffee"
                  className="w-full h-full"
                />
              </div>
              <div className="border-2 basis-8/12 flex flex-col gap-3">
                <div>
                  <h1>Coffee</h1>
                </div>
                <div className="flex ">
                  <div className="basis-3/6">
                    <p>price</p>
                  </div>
                  <div className="basis-3/6">
                    <input
                      type="number"
                      placeholder="Type here"
                      className="input input-bordered input-accent input0xs w-full max-w-xs"
                    />
                  </div>
                </div>
              </div>
            </div> */}
            <div className="flex justify-between items-center">
              <div className='border-2 basis-4/6 flex flex-col gap-3'>
                <h1>Coffee</h1>
                <h2 className='text-zinc-300'>x2</h2>
              </div>
              <div className="basis-2/6">
                <input
                  type="number"
                  placeholder="amount"
                  className="input input-bordered input-accent input-sm w-full max-w-xs text-sm"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className='border-2 basis-4/6 flex flex-col gap-3'>
                <h1>Coffee</h1>
                <h2 className='text-zinc-300'>x2</h2>
              </div>
              <div className="basis-2/6">
                <input
                  type="number"
                  placeholder="amount"
                  className="input input-bordered input-accent input-sm w-full max-w-xs text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cart total priices */}
        <div className="basis-2/6 flex flex-col gap-4">
          <div className="flex justify-between">
            <h1>Total</h1>
            <h2>price here</h2>
          </div>
          <button className="btn btn-outline btn-success">
            Proceed To Payment
          </button>
        </div>
      </div>
    </div>
  );
}
