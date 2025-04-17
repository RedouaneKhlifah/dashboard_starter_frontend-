import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createClientSchema(t: DictionaryType): z.ZodUnion<[z.ZodString, z.ZodNumber]> {
  const { order } = t;
  return z.union([
    z.string({
      required_error: order.client_required,
    }).min(1, order.client_required),
    z.number()
  ]);
}