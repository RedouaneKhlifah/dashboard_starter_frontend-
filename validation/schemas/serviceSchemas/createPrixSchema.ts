import { DictionaryType } from "@/lib/i18n";
    import { z } from "zod";
    
    export function createPrixSchema(t: DictionaryType): z.ZodSchema {
      const { service } = t;
      
      return z.number({
        required_error: service.prix_required,
      });
    }
    