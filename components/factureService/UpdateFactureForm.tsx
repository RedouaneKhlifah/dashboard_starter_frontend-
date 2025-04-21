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
  refreshRecords: (refresh: boolean) => void;
}

const UpdateFactureForm: React.FC<FactureFormProps> = ({
  translation,
  lang,
  selectedRecord,
  refreshRecords,
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
              title: selectedRecord.client?.company || "",
            },
            reference: selectedRecord.reference || "",
            bcn: selectedRecord.bcn || "",
            facture_date: selectedRecord.facture_date || "",
            expiration_date: selectedRecord.expiration_date || "",
            tva: selectedRecord.tva || 0,
            remise_type: selectedRecord.remise_type || "PERCENT",
            remise: selectedRecord.remise || 0,
            note: selectedRecord.note || "",
            is_in_tone: selectedRecord.is_in_tone || false,
            paid_amount: selectedRecord.paid_amount || 0,
            status: selectedRecord.status || Status.DRAFT,
            services:
              selectedRecord.services?.map((service) => ({
                designation: service.designation || "",
                service_id: service.service_id,
                prix: service.prix,
                order_id: service?.order_id,
                quantity: service.quantity || 0,
              })) || [],
            subtotal: selectedRecord.subtotal || 0,
            total: selectedRecord.total || 0,
          }
        : {
            client_id: 0,
            reference: "",
            facture_date: "",
            bcn: "",
            is_in_tone: false,
            expiration_date: "",
            tva: 0,
            remise_type: "PERCENT",
            remise: 0,
            note: "",
            paid_amount: 0,
            status: Status.DRAFT,
            services: [],
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
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/facture-services/${selectedRecord.id}`,
        {
          method: "PATCH",
          lang,
          body: JSON.stringify(formattedData),
        }
      );

      if (response.ok) {
        toastSuccess(translation.order.form.message.update_success_facture);
        refreshRecords(true);
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
      lang={lang}
    />
  );
};

export default UpdateFactureForm;
