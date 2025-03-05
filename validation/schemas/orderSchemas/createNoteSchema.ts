import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createNoteSchema(t: DictionaryType): z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>> {
  const { order } = t;
  return z.union([
    z.string({
      required_error: order.note_required,
    }),
    z.number()
  ]).optional();
}