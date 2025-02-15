"use client";
import { DictionaryType } from "@/lib/i18n";
import OrderForm from "./OrderForm";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import { Locale } from "@/i18n-config";
import useModalStore from "@/store/modalStore";
import { OrderFormErrors } from "@/validation/orderValidators/orderValidator";
import { IOrderForm } from "@/dto/order/orderForm";

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
      }
    }),
    []
  );

  const handleSubmit = async (data: IOrderForm): Promise<boolean> => {
    try {
      const response = await http(
        process.env.NEXT_PUBLIC_API_BASE_PATH + "/api/orders",
        {
          method: "POST",
          lang,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error during order creation:", error);
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