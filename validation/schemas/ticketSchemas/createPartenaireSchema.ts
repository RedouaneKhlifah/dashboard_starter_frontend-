import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

/**
 * Creates a Zod schema for validating Number.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for number validation.
 */
export function createPartenaireSchema(t: DictionaryType): z.ZodUnion<[z.ZodString, z.ZodNumber]> {
  const { Ticket } = t;
  return z.union([
    z.string({
      required_error: Ticket.matricule_required,
    }),
    z.number()
  ]);
 }