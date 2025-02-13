export interface ITicketForm {
  id?: number;
  partenaire: TicketRelationShipData | null;
  product: TicketRelationShipData | null;
  client: TicketRelationShipData | null;
  number_prints: number;
  poids_brut: number;
  poids_tare: number;
  status: "ENTRY" | "EXIT";
}

export interface TicketRelationShipData {
  id: number;
  title: string;
}
