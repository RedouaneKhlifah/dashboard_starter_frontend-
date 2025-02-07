import { IPartenaire } from "@/interfaces/IPartenaire";

export interface PartenairRow {
  id: number;
  name: string;
  matricule: string;
  number: string;
}

const rowMapper = (partenaire: IPartenaire[]): PartenairRow[] => {
  return partenaire.map((partenaire) => ({
    id: partenaire.id,
    name: partenaire.name,
    matricule: partenaire.matricule,
    number: partenaire.number,
  }));
};

const partenaireMappers = {
  rowMapper,
};

export default partenaireMappers;
