import { DictionaryType } from "@/lib/i18n";
import { z } from "zod";


export function createImageSchema(): z.ZodOptional<z.ZodString> {
    return z.string().optional();
  }