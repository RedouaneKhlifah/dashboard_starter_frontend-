import { DictionaryType } from "@/lib/i18n";
import { createFactureSchemas } from "../schemas/factureSchemas/createFactureSchemas";
import { validateField } from "../helper/validationHelpers";
import { IFactureForm } from "@/dto/facture/factureForm";

export type FactureFormErrors = {
  [K in keyof IFactureForm]?: string;
};

export const validateOrderForm = (
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
  newErrors.paid_amount = validateField(paidAmountSchema, formData.paid_amount);

  newErrors.facture_date = validateField(
    devisDateSchema,
    formData.facture_date
  );
  newErrors.expiration_date = validateField(
    expirationDateSchema,
    formData.expiration_date
  );
  newErrors.client = validateField(clientSchema, formData.client?.title);
  newErrors.products = validateField(productSchema, formData.products);
  newErrors.note = validateField(noteSchema, formData.note);

  return Object.fromEntries(
    Object.entries(newErrors).filter(([_, value]) => value !== undefined)
  ) as FactureFormErrors;
};

const OrderValidator = {
  validateOrderForm,
};

export default OrderValidator;
