import { DictionaryType } from "@/lib/i18n";
import { createReferenceSchema } from "./createReferenceSchema";
import { createDevisDateSchema } from "./createDevisDateSchema";
import { createExpirationDateSchema } from "./createExpirationDateSchema";
import { createClientSchema } from "./createClientSchema";
import { createProductSchema } from "./createProductSchema";
import { createNoteSchema } from "./createNoteSchema";
import { createPaidAmountSchema } from "./createPaidAmountSchema";
import { createStatusSchema } from "./createStatusSchema";


export const createFactureSchemas = (t: DictionaryType) => {
  return {
    referenceSchema: createReferenceSchema(t),
    devisDateSchema: createDevisDateSchema(t),
    expirationDateSchema: createExpirationDateSchema(t),
    clientSchema: createClientSchema(t),
    productSchema: createProductSchema(t),
    noteSchema: createNoteSchema(t),
    paidAmountSchema: createPaidAmountSchema(t),
    StatusSchema: createStatusSchema(t)
  };
};