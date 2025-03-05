import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createClientSchema(t: DictionaryType): z.ZodUnion<[z.ZodString, z.ZodNumber]> {
  const { Ticket } = t;
  return z.union([
    z.string({
      required_error: Ticket.client_required,
    }).min(1, Ticket.client_required),
    z.number()
  ]);
}