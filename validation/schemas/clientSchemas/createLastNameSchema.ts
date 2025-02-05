import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createLastNameSchema(t: DictionaryType): z.ZodString {
    const { client } = t;
    return z
      .string()
      .min(1, { message: client.lastNameRequired })
      .max(50, { message: client.lastNameTooLong });
  }