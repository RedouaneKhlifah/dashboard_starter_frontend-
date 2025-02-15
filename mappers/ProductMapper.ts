import { IProductForm } from "@/dto/product/productForm";
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

function mapProductToFormData(data: IProductForm) {
  const formData = new FormData();

  const fields: (keyof IProductForm)[] = [
    "name",
    "sku",
    "unit",
    "sale_price",
    "cost_price",
    "description",
    "tax",
    "stock",
    "reorder_point",
  ];

  fields.forEach((field) => {
    if (data[field] !== undefined && data[field] !== null) {
      formData.append(field, data[field]!.toString());
    }
  });

  if (data.image) {
    formData.append("image[]", data.image);
  }

  return formData;
}

const productMappers = {
  rowMapper,
  mapProductToFormData,
};

export default productMappers;
