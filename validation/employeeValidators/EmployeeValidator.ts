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
    monthlySalarySchema,
    firstNameSchema,
    lastNameSchema,
    citySchema,
    dateEngagementSchema,
    pricePerDaySchema,
    pricePerHourSchema,
    addressSchema,
    nationalSchema,
    employee_idSchema,
  } = createEmployeesSchemas(translation);

  const newErrors: DeepPartialString<IEmployeesForm> = {};

  newErrors.first_name = validateField(firstNameSchema, formData.first_name);
  newErrors.last_name = validateField(lastNameSchema, formData.last_name);
  newErrors.employee_id = validateField(
    employee_idSchema,
    formData.employee_id
  );
  newErrors.address = validateField(addressSchema, formData.address);
  newErrors.national_id = validateField(nationalSchema, formData.national_id);
  newErrors.monthly_salary = validateField(
    monthlySalarySchema,
    formData.monthly_salary
  );
  newErrors.city = validateField(citySchema, formData.city);
  newErrors.date_of_engagement = validateField(
    dateEngagementSchema,
    formData.date_of_engagement
  );
  newErrors.price_per_day = validateField(
    pricePerDaySchema,
    formData.price_per_day
  );
  newErrors.price_per_hour = validateField(
    pricePerHourSchema,
    formData.price_per_hour
  );

  return Object.fromEntries(
    Object.entries(newErrors).filter(([_, value]) => value !== undefined)
  ) as DeepPartialString<IEmployeesForm>;
};

const EmployeesValidator = {
  validateEmployeesForm,
};

export default EmployeesValidator;
