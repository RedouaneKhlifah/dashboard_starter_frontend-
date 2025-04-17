import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

/**
 * Creates a Zod schema for validating country names.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for country validation.
 */
export function createNationalSchema(t: DictionaryType): z.ZodUnion<[z.ZodString, z.ZodNumber]> {
  const { employee } = t;
  return z.union([
      z.string().min(1, { message: employee.NationalRequired }),
      z.number()
  ]);
}