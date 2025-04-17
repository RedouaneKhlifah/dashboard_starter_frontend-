import { DictionaryType } from "@/lib/i18n";
import { createReasonSchema } from "./createReasonSchema";
import { createAmountSchema } from "./createAmountSchema";
import { createTypeSchema } from "./createTypeSchema";

/**
 * Creates all authentication-related Zod schemas.
 * @param t - The dictionary containing localized strings.
 * @returns An object containing email, and full name schemas.
 */
export const createTransactionSchemas = (t: DictionaryType) => {
  return {
    reasonSchema: createReasonSchema(t),
    amountSchema: createAmountSchema(t),
    typeSchema: createTypeSchema(t),
  };
};
