import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


export function createProductSchema(t: DictionaryType): z.ZodUnion<[z.ZodString, z.ZodNumber]> {
  const { Ticket } = t;
  return z.union([
    z.string({
      required_error: Ticket.product_required,
    }).min(1, Ticket.product_required),
    z.number()
  ]);
}
