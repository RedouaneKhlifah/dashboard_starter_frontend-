import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


export function createTaxSchema(t: DictionaryType): z.ZodOptional<z.ZodNumber> {
    const { Product } = t;
    return z.number({ invalid_type_error: Product.invalidTax })
      .min(0)
      .max(100)
      .optional();
  }
  