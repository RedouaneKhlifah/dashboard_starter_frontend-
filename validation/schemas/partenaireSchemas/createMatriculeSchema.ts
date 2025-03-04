import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";

export function createMatriculeSchema(
  t: DictionaryType
): z.ZodUnion<[z.ZodString, z.ZodNumber]> {
  const { partenaire } = t;
  return z.union([
    z.string().min(1, { message: partenaire.matriculeRequired }),
    z.number().min(1, { message: partenaire.matriculeRequired }),
  ]);
}
