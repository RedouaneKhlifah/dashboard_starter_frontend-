import { IClient } from "./IClient";
import { IProduct } from "./IProduct";
import { ITicket } from "./ITicket";

interface IDevis {
  id: number;

  ticket_id: number | null;

  client_id: number;

  reference: string;

  devis_date: string;

  expiration_date: string;

  tva: number;

  remise_type: "PERCENT" | "FIXED";

  remise: number;

  note: string;

  ticket: ITicket | null;

  products: DevisProduct[];

  client: IClient;

  total: number;

  subtotal: number;
}

interface DevisProduct extends IProduct {
  product_id: number;
  tiket_id?: number;
  price_unitaire: number;
  quantity: number;
}

export type { IDevis };
