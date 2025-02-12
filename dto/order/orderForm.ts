export interface IOrderForm {
  reference: string;
  devis_date: string;
  expiration_date: string;
  // client: IClient[];
  // product: IProduct[];
  client: string;
  product: string;
  subtotal: number;
  vat: number;
  total: number;
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
export interface IProduct {
  id: number;
  name: string;
  costPrice: number;
  total: number;
  quantity: number;
  unit: string;
  image: string;
  
}

