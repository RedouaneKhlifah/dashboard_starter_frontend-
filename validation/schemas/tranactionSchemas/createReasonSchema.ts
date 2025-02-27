import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

/**
 * Creates a Zod schema for validating city names.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for city validation.
 */
export function createReasonSchema(t: DictionaryType): z.ZodString {
  const { transaction } = t;
  return z
    .string()
    .min(1, { message: transaction.form.errors.reason_required }); // Ensures non-empty input
}
