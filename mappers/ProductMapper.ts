import { IProduct } from "@/interfaces/IProduct";

export interface ProductRow {
  id: number;
  name: string;
  sku: string;
  unit: string;
  sale_price: number;
  cost_price: number;
  description: string;
  tax: number;
  image: string;
  stock: number;
  reorder_point: number;
}

const rowMapper = (product: IProduct[]): ProductRow[] => {
  return product.map((product) => ({
    id: product.id,
    name: product.name,
    sku: product.sku,
    unit: product.unit,
    sale_price: product.sale_price,
    cost_price: product.cost_price,
    description: product.description,
    tax: product.tax,
    image: product.image,
    stock: product.stock,
    reorder_point: product.reorder_point,
  }));
};

const productMappers = {
  rowMapper,
};

export default productMappers;
