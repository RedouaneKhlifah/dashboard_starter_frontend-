import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createProductSchema(t: DictionaryType) {
  const { Ticket } = t;
  return z
    .array(z.any(), {
      required_error: Ticket.product_required,
    })
    .min(1, Ticket.product_required);
}
