import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createNoteSchema(t: DictionaryType) {
  const { Order } = t;
  return z.string({
    required_error: Order.note_required,
  }).optional();
}