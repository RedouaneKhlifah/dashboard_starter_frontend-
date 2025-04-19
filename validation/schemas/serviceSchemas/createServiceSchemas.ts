import { DictionaryType } from "@/lib/i18n";
import { createDesignationSchema } from "./createDesignationSchema";
import { createPrixSchema } from "./createPrixSchema";

/**
 * Creates all service-related Zod schemas.
 * @param t - The dictionary containing localized strings.
 * @returns An object containing schemas.
 */
export const createServiceSchemas = (t: DictionaryType) => {
  return {
    designationSchema: createDesignationSchema(t),
    prixSchema: createPrixSchema(t)
  };
};
