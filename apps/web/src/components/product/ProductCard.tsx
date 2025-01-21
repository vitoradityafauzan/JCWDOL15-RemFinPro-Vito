
import React from "react";

interface IProductCardProps {
  name: string;
  image: string;
  imgAlt: string;
  price: number;
}

export const ProductCard: React.FC<IProductCardProps> = ({name, image, imgAlt, price}) => {
  return (
    <div className="card card-compact bg-zinc-50 w-52 h-fit ">
      <figure>
        <img
          src={image}
          alt={imgAlt}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p>{price}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-outline btn-success">Add</button>
        </div>
      </div>
    </div>
  );
};
