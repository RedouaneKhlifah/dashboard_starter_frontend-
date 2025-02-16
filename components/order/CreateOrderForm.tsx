"use client";
import { DictionaryType } from "@/lib/i18n";
import OrderForm from "./OrderForm";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import { Locale } from "@/i18n-config";
import useModalStore from "@/store/modalStore";
import { OrderFormErrors } from "@/validation/orderValidators/orderValidator";
import { IOrderForm } from "@/dto/order/orderForm";
import useToast from "@/hooks/useToast";


interface OrderFormProps {
  translation: DictionaryType;
  lang: Locale;
}

const CreateOrderFormPropsForm: React.FC<OrderFormProps> = ({
  translation,
  lang,
}) => {
  const { modalType } = useModalStore();
  const [errors, setErrors] = useState<OrderFormErrors>({});
  const { error: toastError, success: toastSuccess } = useToast();

  const initialFormData = useMemo<IOrderForm>(
    () => ({
      client_id: 0,
      reference: "",
      devis_date: "",
      expiration_date: "",
      tva: 0,
      remise_type: "PERCENT",
      remise: 0,
      note: "",
      products: [],
      client: {
        id: 0,
        title: ""
      },
      subtotal: 0,
      total: 0
    }),
    []
  );

  const handleSubmit = async (data: IOrderForm): Promise<boolean> => {
    const formattedData = {
      reference: data.reference,
      devis_date: data.devis_date,
      experation_date: data.expiration_date,
      client_id: data.client.id,
      products: data.products,
      note: data.note,
      subtotal: data.subtotal,
      tva: data.tva,
      remise_type: data.remise_type,
      remise: data.remise,
      total: data.total,
      notes: data.note,
    };
    try {
      const response = await http(
        process.env.NEXT_PUBLIC_API_BASE_PATH + "/api/devis",
        {
          method: "POST",
          lang,
          body: JSON.stringify(formattedData),
        }
      );

      if (response.ok) {
        toastSuccess(translation.Order.form.message.success);
        return true;
      } else {
        const error = await response.json();
        toastError(error.message || translation.Order.form.message.error);
        return false;
      }
    } catch (error) {
      console.error("Error during order creation:", error);
      toastError(translation.Order.form.message.error);
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
      isOpen={modalType === "create"}
    />
  );
};

export default CreateOrderFormPropsForm;