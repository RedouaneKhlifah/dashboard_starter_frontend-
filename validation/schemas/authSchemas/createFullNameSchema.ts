import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

/**
 * Creates a Zod schema for validating full names.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for full name validation.
 */
export function createFullNameSchema(t: DictionaryType): z.ZodString {
  const { auth } = t;
  return z.string().min(1, {
    message: auth.fullNameRequired,
  });
}
