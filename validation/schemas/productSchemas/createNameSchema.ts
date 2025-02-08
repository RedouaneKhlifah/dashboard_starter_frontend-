import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


export function createNameSchema(t: DictionaryType): z.ZodString {
    const { Product } = t;
    return z.string().min(1, { message: Product.nameRequired });
  }