import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


export function createStockSchema(t: DictionaryType): z.ZodNumber {
    const { Product } = t;
    return z.number({
      required_error: Product.stockRequired,
      invalid_type_error: Product.invalidStock
    }).int().min(0);
  }