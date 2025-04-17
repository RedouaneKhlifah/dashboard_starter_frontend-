import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createDescriptionSchema(): z.ZodOptional<
  z.ZodUnion<[z.ZodString, z.ZodNumber]>
> {
  return z.union([z.string(), z.number()]).optional();
}
