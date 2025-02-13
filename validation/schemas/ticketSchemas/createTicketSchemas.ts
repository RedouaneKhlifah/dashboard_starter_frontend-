import { DictionaryType } from "@/lib/i18n";
import { createClientSchema } from "./createClientSchema";
import { createPartenaireSchema } from "./createPartenaireSchema";
import { createNumberPrintsSchema } from "./createNumberPrintsSchema";
import { createPoidsBrutSchema } from "./createPoidsBrutSchema";
import { createPoidsTareSchema } from "./createPoidsTareSchema";
import { createStatusSchema } from "./createStatusSchema";
import { createProductSchema } from "./createProductSchema";

/**
 * Creates all authentication-related Zod schemas.
 * @param t - The dictionary containing localized strings.
 * @returns An object containing schemas.
 */
export const createTicketSchemas = (t: DictionaryType) => {
  return {
    matriculeSchema: createPartenaireSchema(t),
    productSchema: createProductSchema(t),
    numberPrintsSchema: createNumberPrintsSchema(t),
    poidsBrutSchema: createPoidsBrutSchema(t),
    poidsTareSchema: createPoidsTareSchema(t),
    statusSchema: createStatusSchema(t),
    clientSchema: createClientSchema(t),
  };
};
