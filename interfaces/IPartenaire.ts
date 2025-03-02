import { IProduct } from "./IProduct";
import { ITicket } from "./ITicket";

interface IPartenaire {
    id: number;
    name: string;
    matricule: string;
    number: string;
    tickets: ITicket;
    products: IProduct
  }
  
  export type { IPartenaire };
  