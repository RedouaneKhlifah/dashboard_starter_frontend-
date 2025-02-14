import { IClient } from './IClient';

interface IDevis {
  id: number;
  refrence: string; 
  devis_date: string;
  expiration_date: string;
  clien: string;
  total: number;
  status: string;
  articles?: Array<{
    id: number;
    name: string;
    sellingPrice: number;
    costPrice: number;
    quantity: number;
    selected: boolean;
  }>;
}

export type { IDevis };
