import { DictionaryType } from "@/lib/i18n";
import createEmailSchema from "./createEmailSchema";
import createPasswordSchema from "./createPasswordSchema";
import { createFullNameSchema } from "./createFullNameSchema";

/**
 * Creates all authentication-related Zod schemas.
 * @param t - The dictionary containing localized strings.
 * @returns An object containing email, password, and full name schemas.
 */
export const createAuthSchemas = (t: DictionaryType) => {
  return {
    emailSchema: createEmailSchema(t),
    passwordSchema: createPasswordSchema(t),
    fullNameSchema: createFullNameSchema(t),
  };
};
