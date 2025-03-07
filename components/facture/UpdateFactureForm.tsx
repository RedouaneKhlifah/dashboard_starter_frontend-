"use client";

import { useState, useMemo } from "react";
import useToast from "@/hooks/useToast";

// Components
import FactureForm from "./FactureForm";

// Store
import useModalStore from "@/store/modalStore";

// Utilities & API
import http from "@/lib/http";

// Types
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { IFactureForm, Status } from "@/dto/facture/factureForm";
import { FactureFormErrors } from "@/validation/factureValidators/factureValidator";
import { IFacture } from "@/interfaces/IFacture";
import { FactureMapper } from "@/mappers/FactureMapper";

interface FactureFormProps {
  translation: DictionaryType;
  lang: Locale;
  selectedRecord?: IFacture | null;
}

const UpdateFactureForm: React.FC<FactureFormProps> = ({
  translation,
  lang,
  selectedRecord,
}) => {
  const { modalType } = useModalStore();
  const [errors, setErrors] = useState<FactureFormErrors>({});
  const { error: toastError, success: toastSuccess } = useToast();
  const { FactureDataMapper } = FactureMapper;

  const initialFormData = useMemo<IFactureForm>(
    () =>
      selectedRecord
        ? {
            client: {
              id: selectedRecord.client_id || 0,
              title: selectedRecord.client?.full_name || "",
            },
            reference: selectedRecord.reference || "",
            facture_date: selectedRecord.facture_date || "",
            expiration_date: selectedRecord.expiration_date || "",
            tva: selectedRecord.tva || 0,
            remise_type: selectedRecord.remise_type || "PERCENT",
            remise: selectedRecord.remise || 0,
            note: selectedRecord.note || "",
            paid_amount: selectedRecord.paid_amount || 0,
            status: selectedRecord.status || Status.DRAFT,
            products:
              selectedRecord.products?.map((product) => ({
                name: product.name,
                unit: product.unit,
                product_id: product.product_id,
                price_unitaire: product.price_unitaire,
                quantity: product.quantity,
                order_id: product?.order_id,
              })) || [],
            subtotal: selectedRecord.subtotal || 0,
            total: selectedRecord.total || 0,
          }
        : {
            client_id: 0,
            reference: "",
            facture_date: "",
            expiration_date: "",
            tva: 0,
            remise_type: "PERCENT",
            remise: 0,
            note: "",
            paid_amount: 0,
            status: Status.DRAFT,
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

  const handleSubmit = async (data: IFactureForm): Promise<boolean> => {
    if (!selectedRecord?.id) return false;
    const formattedData = FactureDataMapper(data);

    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/factures/${selectedRecord.id}`,
        {
          method: "PATCH",
          lang,
          body: JSON.stringify(formattedData),
        }
      );

      if (response.ok) {
        toastSuccess(translation.order.form.message.update_success_facture);
        return true;
      } else {
        const error = await response.json();
        toastError(error.message || translation.order.form.message.error);
        return false;
      }
    } catch (error) {
      console.error("Error updating facture:", error);
      toastError(translation.order.form.message.error);
      return false;
    }
  };

  return (
    <FactureForm
      translation={translation}
      initialFormData={initialFormData}
      errors={errors}
      setErrors={setErrors}
      onSubmit={handleSubmit}
      isOpen={modalType === "update"}
    />
  );
};

export default UpdateFactureForm;
