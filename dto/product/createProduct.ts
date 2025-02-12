import { IProductForm } from "./productForm";

interface ICreateProduct extends Omit<IProductForm, "image"> {
  image: File | null;
}

export type { ICreateProduct };
