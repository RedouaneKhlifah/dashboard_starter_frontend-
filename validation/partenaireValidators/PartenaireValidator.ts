import { DictionaryType } from "@/lib/i18n";
import { createPartenaireSchemas } from "../schemas/partenaireSchemas/createPartenaireSchemas";
import { validateField } from "../helper/validationHelpers";
import { IPartenaireForm } from "@/dto/partenaire/partenaireForm";

/**
 * Validates the authentication form data based on the form type (SignIn or SignUp).
 * @param formData - The form data to validate (email, password, and optionally fullName).
 * @param formType - The type of form (SignIn or SignUp).
 * @param translation - The dictionary containing localized strings.
 * @returns An object containing validation errors (if any).
 */

export const validatePartenaireForm = (
  formData: IPartenaireForm,
  translation: DictionaryType
): Partial<IPartenaireForm> => {
  const {
    nameSchema,
    matriculeSchema,
    // numberSchema
  } = createPartenaireSchemas(translation);

  const newErrors: Partial<IPartenaireForm> = {};

  newErrors.name = validateField(nameSchema, formData.name);
  newErrors.matricule = validateField(matriculeSchema, formData.matricule);
  // newErrors.number = validateField(numberSchema, formData.number);


  return Object.fromEntries(
    Object.entries(newErrors).filter(([_, value]) => value !== undefined)
  ) as Partial<IPartenaireForm>;
};

const PartenaireValidator = {
  validatePartenaireForm,
};

export default PartenaireValidator;
