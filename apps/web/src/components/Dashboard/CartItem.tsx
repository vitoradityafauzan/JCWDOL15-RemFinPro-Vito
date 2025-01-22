interface ICartItemProps {
  name: string;
  price: number;
  amount: number;
}

export const CartItem: React.FC<ICartItemProps> = ({ name, price, amount }) => {
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
            defaultValue={1}
            className="input input-bordered input-accent input-sm w-full max-w-xs text-sm"
          />
        </div>
      </div>
    </div>
  );
};
