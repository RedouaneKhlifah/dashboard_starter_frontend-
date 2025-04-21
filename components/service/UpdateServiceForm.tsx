"use client";

import { useState, useMemo } from "react";
import useToast from "@/hooks/useToast";

// Components
import ServiceForm from "./ServiceForm";

// Store
import useModalStore from "@/store/modalStore";

// Utilities & API
import http from "@/lib/http";

// Types
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { IServiceForm } from "@/dto/service/IServiceForm";
import { DeepPartialString } from "@/utils/typeScript_interface";

interface UpdateServiceFormProps {
  translation: DictionaryType;
  lang: Locale;
  selectedRecord?: IServiceForm | null;
  refreshRecords: (bool: boolean) => void;
}

const UpdateServiceForm: React.FC<UpdateServiceFormProps> = ({
  translation,
  lang,
  selectedRecord,
  refreshRecords,
}) => {
  const { modalType } = useModalStore();
  const [errors, setErrors] = useState<DeepPartialString<IServiceForm>>({});
  const { error: toastError, success: toastSuccess } = useToast();
  const initialFormData = useMemo<IServiceForm>(
    () =>
      selectedRecord ?? {
        designation: "",
        prix: 0,
      },
    [selectedRecord]
  );

  const handleSubmit = async (data: IServiceForm): Promise<boolean> => {
    if (!selectedRecord?.id) return false;
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/services/${selectedRecord.id}`,
        {
          method: "PATCH",
          lang,
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toastSuccess(translation.service.message.update_success);
        refreshRecords(true);
        return true;
      } else {
        const error = await response.json();
        toastError(error.message || translation.service.message.error);
        return false;
      }
    } catch (error) {
      console.error("Error updating service:", error);
      return false;
    }
  };

  return (
    <ServiceForm
      translation={translation}
      initialFormData={initialFormData}
      errors={errors}
      setErrors={setErrors}
      onSubmit={handleSubmit}
      isOpen={modalType === "update"}
    />
  );
};

export default UpdateServiceForm;
