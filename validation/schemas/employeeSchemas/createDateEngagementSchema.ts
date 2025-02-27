import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

/**
 * Creates a Zod schema for validating phone numbers.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for phone number validation.
 */
export function createDateEngagementSchema(t: DictionaryType): z.ZodString {
  const { employee } = t;
  return z
    .string({
      required_error: employee.DateEngagementRequired,
    })
    .min(1, employee.DateEngagementRequired);
}
