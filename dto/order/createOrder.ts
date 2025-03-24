export interface ICreateorders {
  client_id?: number;
  reference: string;
  bcn: string;
  order_date: string;
  expiration_date: string;
  tva: number;
  remise_type: "PERCENT" | "FIXED";
  remise: number;
  note: string;
  products: Array<{
    product_id: number;
    price_unitaire: number;
    quantity: number;
  }>;
}
