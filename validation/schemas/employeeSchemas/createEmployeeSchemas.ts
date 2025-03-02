import { DictionaryType } from "@/lib/i18n";
import { createNationalSchema } from "./createNationalSchema";
import { createCitySchema } from "./createCitySchema";
import { createPricePerHourSchema } from "./createPricePerHourSchema";
import { createPricePerDaySchema } from "./createPricePerDaySchema";
import { createAddressSchema } from "./createAddressSchema";
import { createFirstNameSchema } from "./createFirstNameSchema";
import { createLastNameSchema } from "./createLastNameSchema";
import { createDateEngagementSchema } from "./createDateEngagementSchema";
import createMonthlySalarySchema from "./createMonthlySalarySchema";
import { createMatriculeSchema } from "./createEmployeeIdSchema";

/**
 * Creates all authentication-related Zod schemas.
 * @param t - The dictionary containing localized strings.
 * @returns An object containing email, and full name schemas.
 */
export const createEmployeesSchemas = (t: DictionaryType) => {
  return {
    firstNameSchema: createFirstNameSchema(t),
    lastNameSchema: createLastNameSchema(t),
    monthlySalarySchema: createMonthlySalarySchema(t),
    addressSchema: createAddressSchema(t),
    nationalSchema: createNationalSchema(t),
    citySchema: createCitySchema(t),
    pricePerHourSchema: createPricePerHourSchema(t),
    pricePerDaySchema: createPricePerDaySchema(t),
    dateEngagementSchema: createDateEngagementSchema(t),
    matriculeSchema: createMatriculeSchema(t),
  };
};
