import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createAddressSchema(t: DictionaryType): z.ZodUnion<[z.ZodString, z.ZodNumber]> {
  const { employee } = t;
  return z.union([
    z.string().min(1, { message: employee.addressRequired }),
    z.number().positive()
  ]);
}