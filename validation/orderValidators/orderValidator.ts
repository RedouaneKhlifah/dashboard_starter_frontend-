import { DictionaryType } from "@/lib/i18n";
import { createorderSchemas } from "../schemas/orderSchemas/createOrderSchemas";
import { validateField } from "../helper/validationHelpers";
import { IOrderForm } from "@/dto/order/orderForm";

export type orderFormErrors = {
  [K in keyof IOrderForm]?: string;
};

export const validateorderForm = (
  formData: IOrderForm,
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
  newErrors.order_date = validateField(ordersDateSchema, formData.order_date);
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
