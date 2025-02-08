import { DictionaryType } from "@/lib/i18n";
import { createNameSchema } from "./createNameSchema";
import { createSkuSchema } from "./createSkuSchema";
import { createUnitSchema } from "./createUnitSchema";
import { createSalePriceSchema } from "./createSalePriceSchema";
import { createCostPriceSchema } from "./createCostPriceSchema";
import { createDescriptionSchema } from "./createDescriptionSchema";
import { createTaxSchema } from "./createTaxSchema";
import { createImageSchema } from "./createImageSchema";
import { createStockSchema } from "./createStockSchema";
import { createReorderPointSchema } from "./createReorderPointSchema";





/**
 * Creates all authentication-related Zod schemas.
 * @param t - The dictionary containing localized strings.
 * @returns An object containing email, and full name schemas.
 */
export const createProductSchemas = (t: DictionaryType) => {
    return {
        nameSchema: createNameSchema(t),
        skuSchema: createSkuSchema(t),
        unitSchema: createUnitSchema(t),
        sale_priceSchema: createSalePriceSchema(t),
        cost_priceSchema: createCostPriceSchema(t),
        descriptionSchema: createDescriptionSchema(),
        taxSchema: createTaxSchema(t),
        imageSchema: createImageSchema(),
        stockSchema: createStockSchema(t),
        reorder_poinSchemat: createReorderPointSchema(t)
    };
};


