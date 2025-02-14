import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createReferenceSchema(t: DictionaryType) {
  const { Order } = t;
  return z.string({
    required_error: Order.reference_required,
  }).min(1, Order.reference_required);
}