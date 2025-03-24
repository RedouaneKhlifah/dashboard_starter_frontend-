import { IClient } from "./IClient";
import { IProduct } from "./IProduct";
import { ITicket } from "./ITicket";

interface IOrder {
  id: number;

  ticket_id: number | null;

  client_id: number;

  reference: string;

  bcn: string;

  order_date: string;

  expiration_date: string;

  tva: number;

  remise_type: "PERCENT" | "FIXED";

  remise: number;

  note: string;

  ticket: ITicket | null;

  products: OrderProduct[];

  client: IClient;

  total: number;

  subtotal: number;
}

interface OrderProduct extends IProduct {
  product_id: number;
  ticket_id?: number;
  price_unitaire: number;
  quantity: number;
}

export type { IOrder };
