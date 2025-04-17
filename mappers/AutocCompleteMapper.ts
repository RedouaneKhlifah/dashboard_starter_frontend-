import { AutoCompleteSearchResult } from "@/components/ui/SearchAutocomplete";
import { IClient } from "@/interfaces/IClient";
import { IPartenaire } from "@/interfaces/IPartenaire";
import { IProduct } from "@/interfaces/IProduct";

const clientAutoCompleteMapper = (
  client: IClient[]
): AutoCompleteSearchResult[] => {
  return client.map((client) => ({
    id: client.id,
    title: client.company,
  }));
};

const partenaireAutoCompleteMapper = (
  partenaires: IPartenaire[]
): AutoCompleteSearchResult[] => {
  return partenaires.map((partenaire) => ({
    id: partenaire.id,
    title: partenaire.name,
  }));
};

const productAutoCompleteMapper = (
  products: IProduct[]
): AutoCompleteSearchResult[] => {
  return products.map((product) => ({
    id: product.id,
    title: product.name,
  }));
};

const AutoCompleteMappers = {
  clientAutoCompleteMapper,
  partenaireAutoCompleteMapper,
  productAutoCompleteMapper,
};

export default AutoCompleteMappers;
