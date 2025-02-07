import { DictionaryType } from "@/lib/i18n";
import { createMatriculeSchema } from "./createMatriculeSchema"
import { createNameSchema } from "./createNameSchema";
// import { createNumberSchema } from "./createNumberSchema"





/**
 * Creates all authentication-related Zod schemas.
 * @param t - The dictionary containing localized strings.
 * @returns An object containing email, and full name schemas.
 */
export const createPartenaireSchemas = (t: DictionaryType) => {
    return {
        nameSchema: createNameSchema(t),
        matriculeSchema: createMatriculeSchema(t),
        // numberSchema: createNumberSchema(t),
    };
};
