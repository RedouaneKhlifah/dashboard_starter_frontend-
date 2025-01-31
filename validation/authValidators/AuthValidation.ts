import { FormTypeEnum, IAuthForm, IAuthFormErrors } from "@/interfaces";
import { DictionaryType } from "@/lib/i18n";
import { createAuthSchemas } from "../schemas/authSchemas/createAuthSchemas";
import { validateField } from "../helper/validationHelpers";

/**
 * Validates the authentication form data based on the form type (SignIn or SignUp).
 * @param formData - The form data to validate (email, password, and optionally fullName).
 * @param formType - The type of form (SignIn or SignUp).
 * @param translation - The dictionary containing localized strings.
 * @returns An object containing validation errors (if any).
 */
export const validateAuthForm = (
  formData: IAuthForm,
  formType: FormTypeEnum,
  translation: DictionaryType
): IAuthFormErrors => {
  // Create Zod schemas for email, password, and full name
  const { emailSchema, passwordSchema, fullNameSchema } =
    createAuthSchemas(translation);

  // Initialize an empty errors object
  const newErrors: IAuthFormErrors = {};

  // Validate email field
  newErrors.email = validateField(emailSchema, formData.email);

  // Validate password field
  newErrors.password = validateField(passwordSchema, formData.password);

  // Validate full name field (only for SignUp)
  if (formType === FormTypeEnum.SignUp) {
    newErrors.fullName = validateField(fullNameSchema, formData.fullName);
  }

  // Remove undefined keys to ensure a clean error object
  return Object.fromEntries(
    Object.entries(newErrors).filter(([_, value]) => value !== undefined)
  ) as IAuthFormErrors;
};

// Export the validation function as part of an AuthValidation object
const AuthValidation = {
  validateAuthForm,
};

export default AuthValidation;
