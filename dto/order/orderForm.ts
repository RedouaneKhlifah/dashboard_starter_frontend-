interface IOrderForm {
  client: ordersRelationShipData | null;
  reference: string;
  bcn: string;
  order_date: string;
  expiration_date: string;
  tva: number;
  remise_type: "PERCENT" | "FIXED";
  remise: number;
  note: string;
  is_in_tone: boolean;
  products: Array<{
    name?: string;
    unit?: string;
    ticket_id?: number;
    product_id: number;
    price_unitaire: number;
    quantity: number;
  }>;
  subtotal: number;
  total: number;
}

export type { IOrderForm };

export interface ordersRelationShipData {
  id: number;
  title: string;
}
