import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createClientSchema(t: DictionaryType) {
  const { Order } = t;
  return z.string({
    required_error: Order.client_required,
  }).min(1, Order.client_required);
}
  