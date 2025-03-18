import { DictionaryType } from "@/lib/i18n";
import { createClientSchemas } from "../schemas/clientSchemas/createClientSchemas";
import { validateField } from "../helper/validationHelpers";
import { IClientForm } from "@/dto/client/clientForm";

/**
 * Validates the authentication form data based on the form type (SignIn or SignUp).
 * @param formData - The form data to validate (email, password, and optionally fullName).
 * @param formType - The type of form (SignIn or SignUp).
 * @param translation - The dictionary containing localized strings.
 * @returns An object containing validation errors (if any).
 */

export const validateClientForm = (
  formData: IClientForm,
  translation: DictionaryType
): Partial<IClientForm> => {
  const {
    emailSchema,
    firstNameSchema,
    lastNameSchema,
    citySchema,
    countrySchema,
    addressSchema,
    phoneSchema,
    CompanySchema,
  } = createClientSchemas(translation);

  const newErrors: Partial<IClientForm> = {};

  newErrors.company_ice = validateField(CompanySchema, formData.company_ice);
  newErrors.email = validateField(emailSchema, formData.email);
  newErrors.phone = validateField(phoneSchema, formData.phone.toString());
  newErrors.address = validateField(addressSchema, formData.address);
  newErrors.country = validateField(countrySchema, formData.country);
  newErrors.city = validateField(citySchema, formData.city);

  return Object.fromEntries(
    Object.entries(newErrors).filter(([_, value]) => value !== undefined)
  ) as Partial<IClientForm>;
};

const ClientValidator = {
  validateClientForm,
};

export default ClientValidator;
