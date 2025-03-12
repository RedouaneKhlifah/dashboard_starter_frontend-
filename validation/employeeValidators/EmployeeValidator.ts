import { DictionaryType } from "@/lib/i18n";
import { createEmployeesSchemas } from "../schemas/employeeSchemas/createEmployeeSchemas";
import { validateField } from "../helper/validationHelpers";
import { IEmployeesForm } from "@/dto/employee/employeeForm";
import { DeepPartialString } from "@/utils/typeScript_interface";

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
): DeepPartialString<IEmployeesForm> => {
  const {
    firstNameSchema,
    lastNameSchema,
    citySchema,
    dateEngagementSchema,
    pricePerHourSchema,
    addressSchema,
    nationalSchema,
    matriculeSchema,
    dateBorthSchema,
  } = createEmployeesSchemas(translation);

  const newErrors: DeepPartialString<IEmployeesForm> = {};

  newErrors.first_name = validateField(firstNameSchema, formData.first_name);
  newErrors.last_name = validateField(lastNameSchema, formData.last_name);
  newErrors.matricule = validateField(matriculeSchema, formData.matricule);
  newErrors.address = validateField(addressSchema, formData.address);
  newErrors.national_id = validateField(nationalSchema, formData.national_id);
  newErrors.city = validateField(citySchema, formData.city);
  newErrors.date_of_engagement = validateField(
    dateEngagementSchema,
    formData.date_of_engagement
  );
  newErrors.birth_date = validateField(dateBorthSchema, formData.birth_date);
  newErrors.price_per_ton = validateField(
    pricePerHourSchema,
    formData.price_per_ton
  );

  return Object.fromEntries(
    Object.entries(newErrors).filter(([_, value]) => value !== undefined)
  ) as DeepPartialString<IEmployeesForm>;
};

const EmployeesValidator = {
  validateEmployeesForm,
};

export default EmployeesValidator;
