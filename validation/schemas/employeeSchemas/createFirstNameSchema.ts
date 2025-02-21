import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createFirstNameSchema(t: DictionaryType): z.ZodString {
    const { employee } = t;
    return z
      .string()
      .min(1, { message: employee.firstNameRequired })
      .max(50, { message: employee.firstNameTooLong });
  }