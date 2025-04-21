import { DictionaryType } from "@/lib/i18n";
import { createServiceSchemas } from "../schemas/serviceSchemas/createServiceSchemas";
import { validateField, ValidationTypeEnum } from "../helper/validationHelpers";
import { IServiceForm } from "@/dto/service/IServiceForm";
import { DeepPartialString } from "@/utils/typeScript_interface";

/**
 * Validates the service form data.
 * @param formData - The form data to validate.
 * @param translation - The dictionary containing localized strings.
 * @returns An object containing validation errors (if any).
 */
export const validateServiceForm = (
  formData: IServiceForm,
  translation: DictionaryType
): DeepPartialString<IServiceForm> => {
  const schemas = createServiceSchemas(translation);
  const newErrors: DeepPartialString<IServiceForm> = {};

  newErrors.designation = validateField(schemas.designationSchema, formData.designation);
  newErrors.prix = validateField(schemas.prixSchema, formData.prix, ValidationTypeEnum.NUMBER);

  return Object.fromEntries(
    Object.entries(newErrors).filter(([_, value]) => value !== undefined)
  ) as DeepPartialString<IServiceForm>;
};

const ServiceValidator = {
  validateServiceForm,
};

export default ServiceValidator;
