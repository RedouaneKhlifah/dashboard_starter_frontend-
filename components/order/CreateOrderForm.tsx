"use client";
import { DictionaryType } from "@/lib/i18n";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import { Locale } from "@/i18n-config";
import useModalStore from "@/store/modalStore";
import { orderFormErrors } from "@/validation/orderValidators/orderValidator";
import { IOrderForm } from "@/dto/order/orderForm";
import useToast from "@/hooks/useToast";
import { ordersMapper } from "@/mappers/OrderMapper";
import OrderForm from "./OrderForm";

interface orderFormProps {
  translation: DictionaryType;
  lang: Locale;
}

const CreateorderFormPropsForm: React.FC<orderFormProps> = ({
  translation,
  lang,
}) => {
  const { modalType } = useModalStore();
  const [errors, setErrors] = useState<orderFormErrors>({});
  const { error: toastError, success: toastSuccess } = useToast();
  const { ordersDataMapper } = ordersMapper;

  const initialFormData = useMemo<IOrderForm>(
    () => ({
      client_id: null,
      reference: "",
      order_date: "",
      expiration_date: "",
      tva: 0,
      remise_type: "PERCENT",
      remise: 0,
      note: "",
      products: [],
      client: null,
      subtotal: 0,
      total: 0,
      paid_amount: 0,
    }),
    []
  );

  const handleSubmit = async (data: IOrderForm): Promise<boolean> => {
    const formattedData = ordersDataMapper(data);
    try {
      const response = await http(
        process.env.NEXT_PUBLIC_API_BASE_PATH + "/api/orders",
        {
          method: "PUT",
          lang,
          body: JSON.stringify(formattedData),
        }
      );

      if (response.ok) {
        toastSuccess(translation.order.form.message.success);
        return true;
      } else {
        const error = await response.json();
        toastError(error.message || translation.order.form.message.error);
        return false;
      }
    } catch (error) {
      console.error("Error during order creation:", error);
      toastError(translation.order.form.message.error);
      return false;
    }
  };

  const handlePublich = async (data: IOrderForm): Promise<boolean> => {
    const formattedData = ordersDataMapper(data);
    try {
      const response = await http(
        process.env.NEXT_PUBLIC_API_BASE_PATH + "/api/orders/store-and-publish",
        {
          method: "PUT",
          lang,
          body: JSON.stringify(formattedData),
        }
      );

      if (response.ok) {
        toastSuccess(translation.order.form.message.success);
        return true;
      } else {
        const error = await response.json();
        toastError(error.message || translation.order.form.message.error);
        return false;
      }
    } catch (error) {
      console.error("Error during order creation:", error);
      toastError(translation.order.form.message.error);
      return false;
    }
  };

  return (
    <OrderForm
      translation={translation}
      initialFormData={initialFormData}
      errors={errors}
      setErrors={setErrors}
      onSubmit={handleSubmit}
      OnPublish={handlePublich}
      isOpen={modalType === "create"}
    />
  );
};

export default CreateorderFormPropsForm;
