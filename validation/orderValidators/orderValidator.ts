import { DictionaryType } from "@/lib/i18n";
import { createorderSchemas } from "../schemas/orderSchemas/createorderSchemas";
import { validateField } from "../helper/validationHelpers";
import { IorderForm } from "@/dto/order/orderForm";

export type orderFormErrors = {
  [K in keyof IorderForm]?: string;
};

export const validateorderForm = (
  formData: IorderForm,
  translation: DictionaryType
): orderFormErrors => {
  const {
    referenceSchema,
    ordersDateSchema,
    expirationDateSchema,
    clientSchema,
    productSchema,
    noteSchema,
  } = createorderSchemas(translation);

  const newErrors: orderFormErrors = {};

  newErrors.reference = validateField(referenceSchema, formData.reference);
  newErrors.orders_date = validateField(ordersDateSchema, formData.orders_date);
  newErrors.expiration_date = validateField(
    expirationDateSchema,
    formData.expiration_date
  );
  newErrors.client = validateField(clientSchema, formData.client?.title);
  newErrors.products = validateField(productSchema, formData.products);
  newErrors.note = validateField(noteSchema, formData.note);

  return Object.fromEntries(
    Object.entries(newErrors).filter(([_, value]) => value !== undefined)
  ) as orderFormErrors;
};

const orderValidator = {
  validateorderForm,
};

export default orderValidator;
