import { DictionaryType } from "@/lib/i18n";
import { createOrderSchemas } from "../schemas/orderSchemas/createOrderSchemas";
import { validateField } from "../helper/validationHelpers";
import { IOrderForm } from "@/dto/order/orderForm";

export type OrderFormErrors = {
  [K in keyof IOrderForm]?: string;
};

export const validateOrderForm = (
  formData: IOrderForm,
  translation: DictionaryType
): OrderFormErrors => {
  const {
    referenceSchema,
    devisDateSchema,
    expirationDateSchema,
    clientSchema,
    productSchema,
    noteSchema,
  } = createOrderSchemas(translation);

  const newErrors: OrderFormErrors = {};

  newErrors.reference = validateField(referenceSchema, formData.reference);
  newErrors.devis_date = validateField(devisDateSchema, formData.devis_date);
  newErrors.expiration_date = validateField(
    expirationDateSchema,
    formData.expiration_date
  );
  newErrors.client = validateField(clientSchema, formData.client?.title);
  newErrors.products = validateField(productSchema, formData.products);
  newErrors.note = validateField(noteSchema, formData.note);

  return Object.fromEntries(
    Object.entries(newErrors).filter(([_, value]) => value !== undefined)
  ) as OrderFormErrors;
};

const OrderValidator = {
  validateOrderForm,
};

export default OrderValidator;
