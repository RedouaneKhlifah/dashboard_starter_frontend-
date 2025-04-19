import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createPrixSchema(t: DictionaryType): z.ZodSchema {
  const {
    service: { required },
  } = t;

  return z.number({
    required_error: required.prix_required,
  });
}
