import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createUnitSchema(t: DictionaryType): z.ZodString {
  const { Product } = t;
  return z.string().min(1, { message: Product.unitRequired });
}
