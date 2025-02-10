import IImage from "./IImage";

interface IProduct {
  id: number;
  name: string;
  sku: string;
  unit: string;
  sale_price: number;
  cost_price: number;
  description: string;
  tax: number;
  image: string; // refer to the first image in the images array
  images: IImage[];
  stock: number;
  reorder_point: number;
}

export type { IProduct };
