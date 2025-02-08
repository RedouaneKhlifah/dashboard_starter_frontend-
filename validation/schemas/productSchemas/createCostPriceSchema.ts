import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


/**
 * Creates a Zod schema for validating Number.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for number validation.
 */
export function createCostPriceSchema(t: DictionaryType): z.ZodOptional<z.ZodNumber> {
  const { Product } = t;
  return z.number({ invalid_type_error: Product.invalidCostPrice }).optional();
}