import { DictionaryType } from "@/lib/i18n";
import { createProductSchemas } from "../schemas/productSchemas/createProductSchemas";
import { validateField, ValidationTypeEnum } from "../helper/validationHelpers";
import { IProductForm } from "@/dto/product/productForm";

/**
 * Validates the authentication form data based on the form type (SignIn or SignUp).
 * @param formData - The form data to validate (email, password, and optionally fullName).
 * @param formType - The type of form (SignIn or SignUp).
 * @param translation - The dictionary containing localized strings.
 * @returns An object containing validation errors (if any).
 */

export type ProductFormErrors = {
  [K in keyof IProductForm]?: string;
};

export const validateProductForm = (
  formData: IProductForm,
  translation: DictionaryType
): ProductFormErrors => {
  const {
    nameSchema,
    unitSchema,
    skuSchema,
    cost_priceSchema,
    descriptionSchema,
    imageSchema,
    reorder_poinSchemat,
    sale_priceSchema,
    stockSchema,
  } = createProductSchemas(translation);

  const newErrors: ProductFormErrors = {};

  newErrors.name = validateField(nameSchema, formData.name);
  newErrors.sku = validateField(skuSchema, formData.sku);
  newErrors.unit = validateField(unitSchema, formData.unit);
  newErrors.sale_price = validateField(
    sale_priceSchema,
    formData.sale_price,
    ValidationTypeEnum.NUMBER
  );
  newErrors.cost_price = validateField(
    cost_priceSchema,
    formData.cost_price,
    ValidationTypeEnum.NUMBER
  );
  newErrors.description = validateField(
    descriptionSchema,
    formData.description
  );
  newErrors.stock = validateField(
    stockSchema,
    formData.stock,
    ValidationTypeEnum.NUMBER
  );
  newErrors.reorder_point = validateField(
    reorder_poinSchemat,
    formData.reorder_point,
    ValidationTypeEnum.NUMBER
  );

  return Object.fromEntries(
    Object.entries(newErrors).filter(([_, value]) => value !== undefined)
  ) as ProductFormErrors;
};

const ProductValidator = {
  validateProductForm,
};

export default ProductValidator;
