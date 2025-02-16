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

  remise_type: 'PERCENT' | 'FIXED',

  remise: number;

  note: string;

  ticket: ITicket | null;

  products: IProduct[];

  client: IClient;

  total: number;
  
  subtotal: number;


}

export type { IDevis };