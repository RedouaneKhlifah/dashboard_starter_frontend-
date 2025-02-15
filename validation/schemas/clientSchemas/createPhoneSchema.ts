import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

/**
 * Creates a Zod schema for validating phone numbers.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for phone number validation.
 */
export function createPhoneSchema(t: DictionaryType): z.ZodNumber {
  const { client } = t;
  return z.number().min(1, { message: client.phoneRequired });
}
