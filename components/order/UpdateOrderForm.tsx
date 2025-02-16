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
import useToast from "@/hooks/useToast";

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
  const { error: toastError, success: toastSuccess } = useToast();

const initialFormData = useMemo<IOrderForm>(() => {
console.log(selectedRecord)
  if (selectedRecord) {
    return {
      client: {
        id: selectedRecord.client_id || 0,
        title: selectedRecord.client?.full_name || ''
      },
      reference: selectedRecord.reference || '',
      devis_date: selectedRecord.devis_date || '',
      expiration_date: selectedRecord.expiration_date || '',
      tva: selectedRecord.tva || 0,
      remise_type: 'FIXED',
      remise: 0,
      note: selectedRecord.note || '',
      products: selectedRecord.products?.map(product => ({
        product_id: 0, 
        price_unitaire: 0,
        quantity: 0
      })) || [],
      subtotal: selectedRecord.subtotal || 0,
      total: selectedRecord.total || 0
    };
  }
  
  return {
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
  };
}, [selectedRecord]);

  const handleSubmit = async (data: IOrderForm): Promise<boolean> => {
    if (!selectedRecord?.id) return false;

    const formattedData = {
      reference: data.reference,
      devis_date: data.devis_date,
      expiration_date: data.expiration_date,
      client_id: data.client,
      product: data.products,
      note: data.note,
      subtotal: data.subtotal,
      vat: data.tva,
      total: data.total,
      notes: data.note,
    };

    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/devis/${selectedRecord.id}`,
        {
          method: "PATCH",
          lang,
          body: JSON.stringify(formattedData),
        }
      );

      if (response.ok) {
        toastSuccess(translation.Order.form.message.update_success);
        return true;
      } else {
        const error = await response.json();
        toastError(error.message || translation.Order.form.message.error);
        return false;
      }
    } catch (error) {
      console.error("Error during Devis updating:", error);
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
      isOpen={modalType === "update"}
      selectedRecord={selectedRecord}
    />
  );
};

export default UpdateOrderFormPropsForm;