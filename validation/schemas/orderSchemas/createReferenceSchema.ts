import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createReferenceSchema(t: DictionaryType) {
  const { order } = t;
  return z
    .string({
      required_error: order.reference_required,
    })
    .min(1, order.reference_required);
}
