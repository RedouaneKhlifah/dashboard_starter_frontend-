import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createSkuSchema(
  t: DictionaryType
): z.ZodEffects<
  z.ZodUnion<[z.ZodString, z.ZodNumber]>,
  string | number,
  string | number
> {
  const { Product } = t;
  return z.union([z.string(), z.number()]).refine((value) => value !== "", {
    message: Product.skuRequired,
  });
}
