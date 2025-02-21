import { DictionaryType } from "@/lib/i18n";
import { createEmployeesSchemas } from "../schemas/employeeSchemas/createEmployeeSchemas";
import { validateField } from "../helper/validationHelpers";
import { IEmployeesForm } from "@/dto/employee/employeeForm";

/**
 * Validates the authentication form data based on the form type (SignIn or SignUp).
 * @param formData - The form data to validate (email, password, and optionally fullName).
 * @param formType - The type of form (SignIn or SignUp).
 * @param translation - The dictionary containing localized strings.
 * @returns An object containing validation errors (if any).
 */

export const validateEmployeesForm = (
  formData: IEmployeesForm,
  translation: DictionaryType
): Partial<IEmployeesForm> => {
  const {
    emailSchema,
    firstNameSchema,
    lastNameSchema,
    citySchema,
    countrySchema,
    addressSchema,
    phoneSchema,
  } = createEmployeesSchemas(translation);

  const newErrors: Partial<IEmployeesForm> = {};

  newErrors.first_name = validateField(firstNameSchema, formData.first_name);
  newErrors.last_name = validateField(lastNameSchema, formData.last_name);
  newErrors.email = validateField(emailSchema, formData.email);
  newErrors.phone = validateField(phoneSchema, formData.phone.toString());
  newErrors.address = validateField(addressSchema, formData.address);
  newErrors.country = validateField(countrySchema, formData.country);
  newErrors.city = validateField(citySchema, formData.city);

  return Object.fromEntries(
    Object.entries(newErrors).filter(([_, value]) => value !== undefined)
  ) as Partial<IEmployeesForm>;
};

const EmployeesValidator = {
  validateEmployeesForm,
};

export default EmployeesValidator;
