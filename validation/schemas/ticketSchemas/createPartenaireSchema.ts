import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

/**
 * Creates a Zod schema for validating Number.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for number validation.
 */
export function createPartenaireSchema(t: DictionaryType) {
  const { Ticket } = t;
  return z.string({
    required_error: Ticket.matricule_required,
  });
}
