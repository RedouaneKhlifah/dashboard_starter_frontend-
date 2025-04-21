import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createDesignationSchema(t: DictionaryType): z.ZodSchema {
  const {
    service: { required },
  } = t;

  return z
    .string({
      required_error: required.designation_required,
    })
    .min(1, required.designation_required);
}
