import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


/**
 * Creates a Zod schema for validating city names.
 * @param t - The dictionary containing localized strings.
 * @returns A Zod schema for city validation.
 */
export function createemployee_idSchema(t: DictionaryType): z.ZodString {
    const { employee } = t;
    return z.string().min(1, { message: employee.employee_idRequired });
  }
  