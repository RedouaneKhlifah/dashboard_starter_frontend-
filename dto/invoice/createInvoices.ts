export interface ICreateInvoice {
  client_id?: number;
  reference: string;
  facture_date: string;
  bcn: string;
  expiration_date: string;
  paid_amount: number;
  is_in_tone: boolean;
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
