import { IClient } from "./IClient";
import { IPartenaire } from "./IPartenaire";
import { IProduct } from "./IProduct";

interface ITicket {
  id: number;
  number_prints: number;
  poids_brut: number;
  poids_tare: number;
  status: "ENTRY" | "EXIT";
  partenaire: IPartenaire;
  product: IProduct;
  client?: IClient;
  created_at: string;
}

export type { ITicket };
