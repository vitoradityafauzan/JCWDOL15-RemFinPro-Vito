import * as React from 'react';
// import { Spinner } from '@nextui-org/react';
import Image from 'next/image';
import { ProductCard } from '@/components/Dashboard/ProductCard';
import { CartItem } from '@/components/Dashboard/CartItem';

export default function Home() {
  return (
    // bg-[#b9e1da]
    <div className="grid grid-cols-3 h-full bg-zinc-100 border-0">
      {/* Product List */}
      <div className="col-span-2 h-full flex flex-row flex-wrap justify-center gap-5 p-5 ">
        <ProductCard
          name="Coffee"
          image="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          imgAlt="coffee"
          price={10.99}
        />
        <ProductCard
          name="Chitato Barbeque Anniversary Edition gggg gggg gggg"
          image="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          imgAlt="herbs coffee"
          price={9800}
        />
        <ProductCard
          name="White Coffee"
          image="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          imgAlt="white coffee"
          price={13.99}
        />
        <ProductCard
          name="White Coffee"
          image="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          imgAlt="white coffee"
          price={13.99}
        />
        <ProductCard
          name="White Coffee"
          image="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          imgAlt="white coffee"
          price={13.99}
        />
        <ProductCard
          name="White Coffee"
          image="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          imgAlt="white coffee"
          price={13.99}
        />
        <ProductCard
          name="White Coffee"
          image="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          imgAlt="white coffee"
          price={13.99}
        />
      </div>

      {/* Cart */}
      <div className="col-span-1 flex flex-col sticky top-4 h-[30rem] gap-7 p-4 justify-between bg-zinc-50 border-8 border-accent rounded-lg">
        <div className="basis 5/6 flex flex-col flex-wrap gap-8">
          <div className="h-fit">
            <h1 className="text-xl text-center ">Current Cart</h1>
          </div>
          {/* Cart content */}
          <div className="flex flex-col gap-5 overflow-y-auto h-56">
            {/* <div className="flex justify-between items-center">
              <div className="border-0 basis-4/6 flex flex-col gap-3">
                <h1>Kapal Api Coffe Black</h1>
                <h2 className="text-zinc-400">10.66</h2>
              </div>
              <div className="basis-2/6">
                <input
                  type="number"
                  placeholder="amount"
                  className="input input-bordered input-accent input-sm w-full max-w-xs text-sm"
                />
              </div>
            </div> */}
            <CartItem
              name="Chitato Barbeque Anniversary Edition"
              price={12000}
              amount={1}
            />
            <CartItem
              name="Chitato Barbeque Anniversary Edition"
              price={12000}
              amount={1}
            />
            <CartItem
              name="Chitato Barbeque Anniversary Edition"
              price={12000}
              amount={1}
            />
            <CartItem
              name="Chitato Barbeque Anniversary Edition"
              price={12000}
              amount={1}
            />
            <CartItem
              name="Chitato Barbeque Anniversary Edition"
              price={12000}
              amount={1}
            />
          </div>
        </div>

        {/* Cart total priices */}
        <div className="basis-1/6 flex flex-col gap-4 justify-between border-0">
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
