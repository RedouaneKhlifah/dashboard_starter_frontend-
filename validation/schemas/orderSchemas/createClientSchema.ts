import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createClientSchema(t: DictionaryType) {
  const { Order } = t;
  return z.array(z.any(), {
    required_error: Order.client_required,
  }).min(1, Order.client_required);
}