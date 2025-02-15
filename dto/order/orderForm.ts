export interface IOrderForm {
  reference: string;
  devis_date: string;
  expiration_date: string;
  client: string;
  articles?: Array<{
    id: number;
    name: string;
    unit_price: number;
    quantity: number;
    total: number;
    selected?: boolean;
  }>;
  subtotal: number;
  vat: number;
  total: number;
  note: string;
  remise?: {
    type: "percentage" | "fixed";
    value: number;
  };
}

export interface IProduct {
  id: number;
  name: string;
  costPrice: number;
  total: number;
  quantity: number;
  unit: string;
  image: string;
  selected: boolean;
}
