import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


export function createStatusSchema(t: DictionaryType) {
  const { Ticket } = t;
  return z.boolean({
      required_error: Ticket.status_required,
  });
}