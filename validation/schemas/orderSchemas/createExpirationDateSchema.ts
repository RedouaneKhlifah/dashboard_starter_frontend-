import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createExpirationDateSchema(t: DictionaryType) {
  const { Order } = t;
  return z.string({
    required_error: Order.expiration_date_required,
  }).min(1, Order.expiration_date_required);
}