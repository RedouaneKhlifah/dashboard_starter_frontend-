import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createReorderPointSchema(t: DictionaryType): z.ZodNumber {
  const { Product } = t;
  return z
    .number({
      required_error: Product.reorderPointRequired,
      invalid_type_error: Product.invalidReorderPoint,
    })
    .int()
    .min(0);
}
