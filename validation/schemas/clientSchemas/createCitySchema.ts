import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


/**
 * Creates a Zod schema for validating city names.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for city validation.
 */
export function createCitySchema(t: DictionaryType): z.ZodUnion<[z.ZodString, z.ZodNumber]> {
  const { client } = t;
  return z.union([
      z.string().min(1, { message: client.cityRequired  }),
      z.number()
  ]);
}
  