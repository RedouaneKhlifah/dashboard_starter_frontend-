import { DictionaryType } from "@/lib/i18n";
import { createCountrySchema } from "./createCountrySchema";
import { createCitySchema } from "./createCitySchema";
import { createPhoneSchema } from "./createPhoneSchema";
import { createAddressSchema } from "./createAddressSchema";
import { createFirstNameSchema } from "./createFirstNameSchema";
import { createLastNameSchema } from "./createLastNameSchema";
import createEmailSchema from "./createEmailSchema";
import { createCompanySchema } from "./createCompanySchema";

/**
 * Creates all authentication-related Zod schemas.
 * @param t - The dictionary containing localized strings.
 * @returns An object containing email, and full name schemas.
 */
export const createClientSchemas = (t: DictionaryType) => {
  return {
    firstNameSchema: createFirstNameSchema(t),
    lastNameSchema: createLastNameSchema(t),
    phoneSchema: createPhoneSchema(t),
    addressSchema: createAddressSchema(t),
    countrySchema: createCountrySchema(t),
    citySchema: createCitySchema(t),
    emailSchema: createEmailSchema(t),
    CompanySchema: createCompanySchema(t),
  };
};
