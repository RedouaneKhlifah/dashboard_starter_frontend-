import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createNoteSchema(t: DictionaryType) {
  const { order } = t;
  return z.string({
    required_error: order.note_required,
  }).optional();
}