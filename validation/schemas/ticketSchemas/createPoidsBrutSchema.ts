import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


export function createPoidsBrutSchema(t: DictionaryType) {
  const { Ticket } = t;
  return z.number({
      required_error: Ticket.poids_brut_required,
      invalid_type_error: Ticket.invalid_poids_brut
  }).min(0, Ticket.poids_brut_required);
}
