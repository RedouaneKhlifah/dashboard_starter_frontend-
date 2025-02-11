import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createDevisDateSchema(t: DictionaryType) {
  const { Order } = t;
  return z.string({
    required_error: Order.devis_date_required,
  }).min(1, Order.devis_date_required);
}