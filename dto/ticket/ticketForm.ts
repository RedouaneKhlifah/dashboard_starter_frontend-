export interface ITicketForm {
  matricule: string;
  product_id: number;
  client_id: number | null;
  number_prints: number;
  poids_brut: number;
  poids_tare: number;
  status: "ENTRY" | "EXIT";
}
