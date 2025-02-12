import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createPoidsTareSchema(t: DictionaryType) {
  const { Ticket, shared } = t;
  return z
    .number({
      required_error: Ticket.poids_tare_required,
      invalid_type_error: Ticket.invalid_poids_tare,
    })
    .min(1, shared.error.number_greater_than_zero);
}
