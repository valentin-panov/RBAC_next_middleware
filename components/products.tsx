import React from "react";
import { TProduct, TProductProps } from "types";

const Products: React.FC<TProductProps> = ({ products }) => {
  console.log("FIND_ME_Posts");
  return (
    <div style={{ width: "30vw" }}>
      <h2>Products</h2>
      {products.map(({ id, title, description, price }: TProduct) => (
        <div key={id}>
          <h3>ID: {id}</h3>
          <p>Title: {title}</p>
          <p>Description: {description}</p>
          <p>Price: {price}</p>
        </div>
      ))}
    </div>
  );
};

export default Products;
