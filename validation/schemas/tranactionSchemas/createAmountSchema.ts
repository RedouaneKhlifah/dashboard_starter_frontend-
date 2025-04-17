import TransactionForm from "@/components/transaction/TransactionForm";
import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createAmountSchema(t: DictionaryType): z.ZodNumber {
  const { transaction } = t;
  return z
    .number({
      required_error: transaction.form.errors.amount_required,
    })
    .min(1, { message: transaction.form.errors.amount_invalid });
}
