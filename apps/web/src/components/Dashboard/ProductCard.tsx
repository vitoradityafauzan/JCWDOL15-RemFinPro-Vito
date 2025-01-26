/* eslint-disable @next/next/no-img-element */
'use client';

import { currencyFormat } from '@/app/utils/currencyFormat';
import { useContextGlobal } from '@/global-context/contextProvider';
import React from 'react';

interface IProductCardProps {
  id: number;
  name: string;
  image: string | undefined;
  imgAlt: string;
  price: number;
}

export const ProductCard: React.FC<IProductCardProps> = ({
  id,
  name,
  image,
  imgAlt,
  price,
}) => {
  const { cart, addCartItemContext } = useContextGlobal();

  return (
    <div className="card card-compact bg-zinc-50 w-60 h-80 ">
      <figure>
        <img src={image} alt={imgAlt} />
      </figure>
      <div className="card-body gap-4">
        <h2 className="card-title text-base line-clamp-2">{name}</h2>
        <p className="">{currencyFormat(price)}</p>
        <div className="card-actions justify-end">
          <button
            className="btn btn-outline btn-success"
            onClick={() => addCartItemContext(id, name, price, 1)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};
