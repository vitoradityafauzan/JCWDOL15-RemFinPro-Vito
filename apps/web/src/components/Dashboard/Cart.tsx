import { CartItem } from './CartItem';

export const Cart = () => {
  return (
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
  );
};
