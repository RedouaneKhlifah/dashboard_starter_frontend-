createTransactionSchemas;

import { DictionaryType } from "@/lib/i18n";
import { createTransactionSchemas } from "../schemas/tranactionSchemas/createTransactionSchemas";
import { validateField, ValidationTypeEnum } from "../helper/validationHelpers";
import { ITransactionForm } from "@/dto/transaction/transactionForm";
import { DeepPartialString } from "@/utils/typeScript_interface";

/**
 * Validates the authentication form data based on the form type (SignIn or SignUp).
 * @param formData - The form data to validate (email, password, and optionally fullName).
 * @param formType - The type of form (SignIn or SignUp).
 * @param translation - The dictionary containing localized strings.
 * @returns An object containing validation errors (if any).
 */

export const validateTransactionForm = (
  formData: ITransactionForm,
  translation: DictionaryType
): DeepPartialString<ITransactionForm> => {
  const { reasonSchema, amountSchema, typeSchema } =
    createTransactionSchemas(translation);
  const newErrors: DeepPartialString<ITransactionForm> = {};

  newErrors.reason = validateField(reasonSchema, formData.reason);
  newErrors.amount = validateField(
    amountSchema,
    formData.amount,
    ValidationTypeEnum.NUMBER
  );
  newErrors.type = validateField(typeSchema, formData.type);

  return Object.fromEntries(
    Object.entries(newErrors).filter(([_, value]) => value !== undefined)
  ) as DeepPartialString<ITransactionForm>;
};

const TransactionValidator = {
  validateTransactionForm,
};

export default TransactionValidator;
