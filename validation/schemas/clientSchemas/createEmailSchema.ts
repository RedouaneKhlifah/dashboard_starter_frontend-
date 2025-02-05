import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

/**
 * Creates a Zod schema for validating email addresses.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for email validation.
 */
export default function createEmailSchema(t: DictionaryType): z.ZodString {
  const { client } = t;
  return z
    .string()
    .min(1, { message: client.emailRequired })
    .email({ message: client.invalidEmail });
}
