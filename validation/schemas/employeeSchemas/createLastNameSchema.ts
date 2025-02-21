import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createLastNameSchema(t: DictionaryType): z.ZodString {
    const { employee } = t;
    return z
      .string()
      .min(1, { message: employee.lastNameRequired })
      .max(50, { message: employee.lastNameTooLong });
  }