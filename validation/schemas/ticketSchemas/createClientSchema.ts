import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createClientSchema(t: DictionaryType) {
  const { Ticket } = t;
  return z.string({
    required_error: Ticket.client_required,
  });
}
