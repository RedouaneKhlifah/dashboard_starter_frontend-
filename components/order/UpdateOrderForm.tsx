"use client";

import { useState, useMemo } from "react";
import useToast from "@/hooks/useToast";

// Components
import OrderForm from "./OrderForm";

// Store
import useModalStore from "@/store/modalStore";

// Utilities & API
import http from "@/lib/http";

// Types
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { IOrderForm } from "@/dto/order/orderForm";
import { OrderFormErrors } from "@/validation/orderValidators/orderValidator";
import { IDevis } from "@/interfaces/IDevis";
import { DevisMapper } from "@/mappers/DevisMapper";

interface OrderFormProps {
  translation: DictionaryType;
  lang: Locale;
  selectedRecord?: IDevis | null;
}

const UpdateOrderForm: React.FC<OrderFormProps> = ({
  translation,
  lang,
  selectedRecord,
}) => {
  const { modalType } = useModalStore();
  const [errors, setErrors] = useState<OrderFormErrors>({});
  const { error: toastError, success: toastSuccess } = useToast();
  const { DevisDataMapper } = DevisMapper;

  const initialFormData = useMemo<IOrderForm>(
    () =>
      selectedRecord
        ? {
            client: {
              id: selectedRecord.client_id || 0,
              title: selectedRecord.client?.full_name || "",
            },
            reference: selectedRecord.reference || "",
            devis_date: selectedRecord.devis_date || "",
            expiration_date: selectedRecord.expiration_date || "",
            tva: selectedRecord.tva || 0,
            remise_type: selectedRecord.remise_type || "PERCENT",
            remise: selectedRecord.remise || 0,
            note: selectedRecord.note || "",
            products:
              selectedRecord.products?.map((product) => ({
                name: product.name,
                unit: product.unit,
                product_id: product.product_id,
                price_unitaire: product.price_unitaire,
                quantity: product.quantity,
                tiket_id: product?.tiket_id,
              })) || [],
            subtotal: selectedRecord.subtotal || 0,
            total: selectedRecord.total || 0,
          }

        : {
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
            title: "",
          },
          subtotal: 0,
          total: 0,
        },
    [selectedRecord]
  );

  const handleSubmit = async (data: IOrderForm): Promise<boolean> => {
    if (!selectedRecord?.id) return false;
    const formattedData = DevisDataMapper(data);

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
      console.error("Error updating order:", error);
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
    />
  );
};

export default UpdateOrderForm;
