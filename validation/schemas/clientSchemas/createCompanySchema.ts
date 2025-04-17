import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createCompanySchema(
  t: DictionaryType
): z.ZodUnion<[z.ZodString, z.ZodNumber]> {
  const { client } = t;
  return z.union([
    z.string().min(1, { message: client.companyRequired }),
    z.number(),
  ]);
}
