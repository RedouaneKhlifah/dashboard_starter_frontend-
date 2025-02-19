import { Status } from "@/dto/facture/factureForm";
import { IClient } from "./IClient";
import { IProduct } from "./IProduct";
import { ITicket } from "./ITicket";

interface IFacture {
  id: number;

  ticket_id: number | null;

  paid_amount: number;

  status: Status;

  client_id: number;

  reference: string;

  facture_date: string;

  expiration_date: string;

  tva: number;

  remise_type: "PERCENT" | "FIXED";

  remise: number;

  note: string;

  ticket: ITicket | null;

  products: FactureProduct[];

  client: IClient;

  total: number;

  subtotal: number;
}

interface FactureProduct extends IProduct {
  product_id: number;
  order_id?: number;
  price_unitaire: number;
  quantity: number;
}

export type { IFacture };
