import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


export function createPaidAmountSchema(t: DictionaryType) {
  const { order } = t;
  return z.number({
      required_error: order.paid_amount_required,
  }).min(0, order.paid_amount_required);
}