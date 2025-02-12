import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createSalePriceSchema(t: DictionaryType): z.ZodNumber {
  const { Product } = t;
  return z
    .number({
      required_error: Product.salePriceRequired,
      invalid_type_error: Product.invalidSalePrice,
    })
    .positive();
}
