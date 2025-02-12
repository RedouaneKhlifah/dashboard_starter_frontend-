import { DictionaryType } from "@/lib/i18n";
import { createTicketSchemas } from "../schemas/ticketSchemas/createTicketSchemas";
import { validateField } from "../helper/validationHelpers";
import { ITicketForm } from "@/dto/ticket/ticketForm";

/**
 * Validates the authentication form data based on the form type (SignIn or SignUp).
 * @param formData - The form data to validate (email, password, and optionally fullName).
 * @param formType - The type of form (SignIn or SignUp).
 * @param translation - The dictionary containing localized strings.
 * @returns An object containing validation errors (if any).
 */

export type TicketFormErrors = {
  [K in keyof ITicketForm]?: string;
};

export const validateTiecketForm = (
  formData: ITicketForm,
  translation: DictionaryType
): TicketFormErrors => {
  const {
    matriculeSchema,
    productSchema,
    poidsBrutSchema,
    poidsTareSchema,
    statusSchema,
    clientSchema,
    numberPrintsSchema,
  } = createTicketSchemas(translation);

  const newErrors: TicketFormErrors = {};

  newErrors.number_prints = validateField(
    numberPrintsSchema,
    formData.number_prints
  );
  newErrors.poids_brut = validateField(poidsBrutSchema, formData.poids_brut);
  newErrors.poids_tare = validateField(poidsTareSchema, formData.poids_tare);
  newErrors.status = validateField(statusSchema, formData.status);

  return Object.fromEntries(
    Object.entries(newErrors).filter(([_, value]) => value !== undefined)
  ) as TicketFormErrors;
};

export const validateTiecketDetails = (
  formData: ITicketForm,
  translation: DictionaryType
): TicketFormErrors => {
  const { poidsBrutSchema, poidsTareSchema, statusSchema, numberPrintsSchema } =
    createTicketSchemas(translation);

  const newErrors: TicketFormErrors = {};

  newErrors.number_prints = validateField(
    numberPrintsSchema,
    formData.number_prints
  );
  newErrors.poids_brut = validateField(poidsBrutSchema, formData.poids_brut);
  newErrors.poids_tare = validateField(poidsTareSchema, formData.poids_tare);
  newErrors.status = validateField(statusSchema, formData.status);

  return Object.fromEntries(
    Object.entries(newErrors).filter(([_, value]) => value !== undefined)
  ) as TicketFormErrors;
};

const TicketValidator = {
  validateTiecketDetails,
};

export default TicketValidator;
