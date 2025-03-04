import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

/**
 * Creates a Zod schema for validating country names, allowing numbers and non-empty strings.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for country validation.
 */
export function createCountrySchema(t: DictionaryType): z.ZodUnion<[z.ZodString, z.ZodNumber]> {
  const { client } = t;
  return z.union([
    z.string().min(1, { message: client.countryRequired }),
    z.number()
  ], {
    errorMap: () => ({ message: client.countryRequired })
  });
}