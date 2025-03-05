import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

/**
 * Creates a Zod schema for validating matricule values, accepting either strings or numbers.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for matricule validation.
 */
export function createMatriculeSchema(
  t: DictionaryType
): z.ZodUnion<[z.ZodString, z.ZodNumber]> {
  const { employee } = t;
  return z.union([
    z.string().min(1, { message: employee.matriculeRequired }),
    z.number().min(1, { message: employee.matriculeRequired }),
  ]);
}
