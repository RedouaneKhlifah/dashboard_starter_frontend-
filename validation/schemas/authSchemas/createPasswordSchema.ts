import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

/**
 * Creates a Zod schema for validating passwords.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for password validation.
 */
export default function createPasswordSchema(t: DictionaryType): z.ZodString {
  const { auth } = t;
  return z
    .string()
    .min(1, {
      message: auth.passwordRequired,
    })
    .min(8, {
      message: auth.passwordMinLength,
    })
    .max(64, {
      message: auth.passwordMaxLength,
    })
    .regex(/[A-Z]/, {
      message: auth.passwordUppercase,
    })
    .regex(/[a-z]/, {
      message: auth.passwordLowercase,
    })
    .regex(/[0-9]/, {
      message: auth.passwordNumber,
    })
    .regex(/[!@#$%^&*]/, {
      message: auth.passwordSpecialChar,
    });
}
