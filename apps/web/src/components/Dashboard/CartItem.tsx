import { ICartItems } from '@/types/productTypes';
import { useContextGlobal } from '@/global-context/contextProvider';
import { useRef, useState } from 'react';

export const CartItem: React.FC<ICartItems> = ({ id, name, price, amount }) => {
  const { cart, updateCartItemAmountContext } = useContextGlobal();
  const cartRef = useRef<HTMLInputElement | null>(null);

  const handleCartItemAmountChange = (id: number, newAmount: number) => {
    if (cartRef.current) {
      updateCartItemAmountContext(id, newAmount);
    }
  };

  return (
    <div className="flex flex-col justify-between items-center gap-2">
      <div className="border-0 basis-4/6">
        <h1>{name}</h1>
      </div>
      <div className="basis-2/6 flex gap-3 items-center">
        <div className="basis-3/6">
          <h2 className="text-zinc-400">{price}</h2>
        </div>
        <div className="basis-3/6">
          <input
            type="number"
            placeholder="amount"
            value={amount}
            // defaultValue={1}
            className="input input-bordered input-accent input-sm w-full max-w-xs text-sm"
          />
        </div>
      </div>
    </div>
  );
};

{
  /* <div className="flex justify-between items-center">
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
</div>; */
}
