interface IOrderForm {
  client: DevisRelationShipData;
  reference: string;
  devis_date: string;
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
  subtotal: number;
  total: number;
}

export type { IOrderForm };

export interface DevisRelationShipData {
  id: number;
  title: string;
}
