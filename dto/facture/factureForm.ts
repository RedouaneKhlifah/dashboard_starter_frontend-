interface IFactureForm {
  client: FactureRelationShipData | null;
  reference: string;
  order_date: string;
  expiration_date: string;
  tva: number;
  remise_type: "PERCENT" | "FIXED";
  remise: number;
  note: string;
  paid_amount: number;
  status: Status;
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

export type { IFactureForm };

export interface FactureRelationShipData {
  id: number;
  title: string;
}

export enum Status {
  DRAFT = "DRAFT",
  UNPAID = "UNPAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  PAID = "PAID"
}
