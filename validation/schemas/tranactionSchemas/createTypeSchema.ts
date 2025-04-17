import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

/**
 * Creates a Zod schema for validating transaction types.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for transaction type validation.
 */
export function createTypeSchema(
  t: DictionaryType
): z.ZodEnum<["CREDIT", "DEBIT"]> {
  const { transaction } = t;
  return z.enum(["CREDIT", "DEBIT"], {
    errorMap: () => ({ message: transaction.form.errors.type_required }),
  });
}
