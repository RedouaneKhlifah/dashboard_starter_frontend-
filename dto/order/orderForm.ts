interface IOrderForm {
  client: DevisRelationShipData | null;
  reference: string;
  devis_date: string;
  expiration_date: string;
  tva: number;
  remise_type: "PERCENT" | "FIXED";
  remise: number;
  note: string;
  products: Array<{
    name?: string;
    unit?: string;
    tiket_id?: number;
    product_id: number;
    price_unitaire: number;
    quantity: number;
  }>;
  subtotal: number;
  total: number;
}

export type { IOrderForm };

export interface DevisRelationShipData {
  id: number;
  title: string;
}
