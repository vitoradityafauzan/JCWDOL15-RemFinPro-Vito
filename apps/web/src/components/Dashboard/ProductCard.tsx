/* eslint-disable @next/next/no-img-element */

import React from "react";

interface IProductCardProps {
  id: number;
  name: string;
  image: string | undefined;
  imgAlt: string;
  price: number;
}

export const ProductCard: React.FC<IProductCardProps> = ({name, image, imgAlt, price}) => {
  return (
    <div className="card card-compact bg-zinc-50 w-60 h-80 ">
      <figure>
        <img
          src={image}
          alt={imgAlt}
        />
      </figure>
      <div className="card-body gap-4">
        <h2 className="card-title text-base line-clamp-2">{name}</h2>
        <p className="">Rp. {price},00</p>
        <div className="card-actions justify-end">
          <button className="btn btn-outline btn-success">Add</button>
        </div>
      </div>
    </div>
  );
};
