"use client";
import { DictionaryType } from "@/lib/i18n";
import OrderForm from "./OrderForm";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import { Locale } from "@/i18n-config";
import useModalStore from "@/store/modalStore";
import { IOrderForm } from "@/dto/order/orderForm";
import { OrderFormErrors } from "@/validation/orderValidators/orderValidator";
import { ICreateOrder } from "@/dto/order/createProduct";

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
      reference: "",
      devis_date: "",
      expiration_date: "",
      client_id: 0,
      client: "",
      product: "",
      note: "",
      articles: [],
      subtotal: 0,
      vat: 0,
      total: 0,
      notes: "",
      status: "draft"
    }),
    []
  );

  const handleSubmit = async (data: ICreateOrder): Promise<boolean> => {
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