"use client";
import { DictionaryType } from "@/lib/i18n";
import OrderForm from "./OrderForm";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import { Locale } from "@/i18n-config";
import useModalStore from "@/store/modalStore";
import { IOrderForm } from "@/dto/order/orderForm";
import { OrderFormErrors } from "@/validation/orderValidators/orderValidator";
import { IDevis } from "@/interfaces/IDevis";
import { addMonths, formatDate } from "@/utils/Date";

interface OrderFormProps {
  translation: DictionaryType;
  lang: Locale;
  selectedRecord: IDevis | undefined;
}

const UpdateOrderFormPropsForm: React.FC<OrderFormProps> = ({
  translation,
  lang,
  selectedRecord,
}) => {
  const { modalType } = useModalStore();
  const [errors, setErrors] = useState<OrderFormErrors>({});

  const initialFormData = useMemo<IOrderForm>(
    () => ({
      reference: "",
      devis_date: formatDate(new Date()),
      expiration_date: formatDate(addMonths(new Date(), 3)),
      client_id: 0,
      client: "mohamed",
      product: "",
      note: "",
      articles: [],
      subtotal: 0,
      vat: 0,
      total: 0,
      notes: "",
      status: "draft",
    }),
    []
  );

  const handleSubmit = async (data: IOrderForm): Promise<boolean> => {
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/devis/${selectedRecord?.id}`,
        {
          method: "PATCH",
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
      console.error("Error during Devis updating:", error);
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
      isOpen={modalType == "update"}
    />
  );
};

export default UpdateOrderFormPropsForm;
