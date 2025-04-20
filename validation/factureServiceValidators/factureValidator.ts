import { DictionaryType } from "@/lib/i18n";
import { createFactureSchemas } from "../schemas/factureSchemas/createFactureSchemas";
import { validateField, ValidationTypeEnum } from "../helper/validationHelpers";
import { IFactureForm } from "@/dto/facture/factureForm";

export type FactureFormErrors = {
  [K in keyof IFactureForm]?: string;
};

export const validateFactureServiceForm = (
  formData: IFactureForm,
  translation: DictionaryType
): FactureFormErrors => {
  const {
    referenceSchema,
    devisDateSchema,
    expirationDateSchema,
    clientSchema,
    productSchema,
    noteSchema,
    paidAmountSchema,
  } = createFactureSchemas(translation);

  const newErrors: FactureFormErrors = {};

  newErrors.reference = validateField(referenceSchema, formData.reference);
  newErrors.paid_amount = validateField(
    paidAmountSchema,
    formData.paid_amount,
    ValidationTypeEnum.NUMBER
  );

  newErrors.facture_date = validateField(
    devisDateSchema,
    formData.facture_date
  );
  newErrors.expiration_date = validateField(
    expirationDateSchema,
    formData.expiration_date
  );
  newErrors.client = validateField(clientSchema, formData.client?.title);
  newErrors.services = validateField(
    productSchema,
    formData.services,
    ValidationTypeEnum.ARRAY
  );
  newErrors.note = validateField(noteSchema, formData.note);

  return Object.fromEntries(
    Object.entries(newErrors).filter(([_, value]) => value !== undefined)
  ) as FactureFormErrors;
};

const FactureServiceValidator = {
  validateFactureServiceForm,
};

export default FactureServiceValidator;
