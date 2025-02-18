import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createClientSchema(t: DictionaryType) {
  const { order } = t;
  return z.string({
    required_error: order.client_required,
  }).min(1, order.client_required);
}
  