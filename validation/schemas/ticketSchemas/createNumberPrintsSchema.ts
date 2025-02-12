import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createNumberPrintsSchema(t: DictionaryType) {
  const {
    Ticket,
    shared: { error },
  } = t;
  return z
    .number({
      required_error: Ticket.number_prints_required,
      invalid_type_error: Ticket.invalid_number_prints,
    })
    .min(1, error.number_greater_than_zero);
}
