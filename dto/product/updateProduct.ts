import { IProductForm } from "./productForm";

interface IUpdateProduct extends IProductForm {
  id: number;
}

export type { IUpdateProduct };
