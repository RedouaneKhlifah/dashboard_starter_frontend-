export interface IProductForm {
  name: string;
  sku: string;
  unit: string;
  sale_price: number;
  cost_price: number;
  description: string;
  tax: number;
  image: File | null | string;
  stock: number;
  reorder_point: number;
}
