import { DictionaryType } from "@/lib/i18n";
import { createReferenceSchema } from "./createReferenceSchema";
import { createOrderDateSchema } from "./createOrderDateSchema";
import { createExpirationDateSchema } from "./createExpirationDateSchema";
import { createClientSchema } from "./createClientSchema";
import { createProductSchema } from "./createProductSchema";
import { createNoteSchema } from "./createNoteSchema";

export const createorderSchemas = (t: DictionaryType) => {
  return {
    referenceSchema: createReferenceSchema(t),
    ordersDateSchema: createOrderDateSchema(t),
    expirationDateSchema: createExpirationDateSchema(t),
    clientSchema: createClientSchema(t),
    productSchema: createProductSchema(t),
    noteSchema: createNoteSchema(t),
  };
};
