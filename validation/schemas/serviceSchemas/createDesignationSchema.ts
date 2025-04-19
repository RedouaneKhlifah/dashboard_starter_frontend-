import { DictionaryType } from "@/lib/i18n";
    import { z } from "zod";
    
    export function createDesignationSchema(t: DictionaryType): z.ZodSchema {
      const { service } = t;
      
      return z.string({
        required_error: service.designation_required,
      }).min(1, service.designation_required);
    }
    