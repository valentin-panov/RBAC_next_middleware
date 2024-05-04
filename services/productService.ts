import { TProduct } from "../types";

export const productService = async () => {
  const products: TProduct[] = await fetch(
    "https://api.escuelajs.co/api/v1/products?offset=0&limit=3",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        PAYED_SUBSCRIPTION_TOKEN: `${process.env.NEXT_PUBLIC_PAYED_SUBSCRIPTION_TOKEN}`,
      },
    },
  ).then((response) => response.json());

  return products;
};
