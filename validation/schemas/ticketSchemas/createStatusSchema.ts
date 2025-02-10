import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


export function createStatusSchema(t: DictionaryType) {
  const { Ticket } = t;
  return z.enum(['ENTRY', 'EXIT'], {
      required_error: Ticket.status_required,
  });
}