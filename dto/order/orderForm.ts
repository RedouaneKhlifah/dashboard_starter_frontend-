import { IClient } from "@/interfaces/IClient";
import { IProduct } from "@/interfaces/IProduct";

export interface IOrderForm {
  reference: string;
  devis_date: string;
  expiration_date: string;
  // client: IClient[];
  // product: IProduct[];
  client: string;
  product: string;
  subtotal: string;
  vat: string;
  total: string;
  note: string;
  articles?: Array<{
    id: number;
    name: string;
    sellingPrice: number;
    costPrice: number;
    quantity: number;
    selected: boolean;
    unit_price: number,
    action: string,
    total: number
  }>;
}