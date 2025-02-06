import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

/**
 * Creates a Zod schema for validating phone numbers.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for phone number validation.
 */
export function createPhoneSchema(t: DictionaryType): z.ZodString {
  const { client } = t;
  return z
    .string()
    .min(1, { message: client.phoneRequired })
    .regex(/^\+?[0-9]+$/, { message: client.invalidPhone });
}
