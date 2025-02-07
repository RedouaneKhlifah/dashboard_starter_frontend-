import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


/**
 * Creates a Zod schema for validating Number.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for number validation.
 */
export function createNumberSchema(t: DictionaryType): z.ZodString {
    const { partenaire } = t;
    return z.string().min(1, { message: partenaire.numberRequired });
  }
  