interface ITicket {
  id: number;
  matricule: string;
  product_id: number;
  client_id: number | null;
  number_prints: number;
  poids_brut: string;
  poids_tare: string;
  status: string;
  partenaire: {
    id: number;
    matricule: string;
  };
  product: {
    id: number;
    name: string;
  };
  client: {
    id: number;
    full_name: string;
  };
}
  
  export type { ITicket };
  