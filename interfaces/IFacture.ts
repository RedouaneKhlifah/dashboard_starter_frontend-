import { Status } from "@/dto/facture/factureForm";
import { IClient } from "./IClient";
import { IProduct } from "./IProduct";
import { ITicket } from "./ITicket";
import { IService } from "./IService";

interface IFacture {
  id: number;

  ticket_id: number | null;

  paid_amount: number;

  status: Status;

  statusText: string;

  client_id: number;

  reference: string;

  bcn: string;

  facture_date: string;

  expiration_date: string;

  tva: number;

  remise_type: "PERCENT" | "FIXED";

  remise: number;

  note: string;

  ticket: ITicket | null;

  products: FactureProduct[];

  services: FactureService[];

  client: IClient;

  total: number;

  subtotal: number;

  is_in_tone: boolean;
}

interface FactureProduct extends IProduct {
  product_id: number;
  order_id?: number;
  price_unitaire: number;
  quantity: number;
}

interface FactureService extends IService {
  service_id: number;
  order_id?: number;
  prix: number;
  designation: string;
  quantity: number;
}

export type { IFacture };
