import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


export function createMatriculeSchema(t: DictionaryType): z.ZodString {
    const { partenaire } = t;
    return z.string().min(1, { message: partenaire.matriculeRequired });
  }