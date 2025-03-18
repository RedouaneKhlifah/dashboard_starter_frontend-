"use client";

// React & Hooks
import { useState, useMemo } from "react";
import useToast from "@/hooks/useToast";

// Components
import ClientForm from "./ClientForm";

// Store & Utils
import useModalStore from "@/store/modalStore";
import http from "@/lib/http";

// Types & Interfaces
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { IClientForm } from "@/dto/client/clientForm";
import { IClient } from "@/interfaces/IClient";

interface ClientFormProps {
  translation: DictionaryType;
  lang: Locale;
  selectedRecord?: IClient;
}

const UpdateClientForm: React.FC<ClientFormProps> = ({
  translation,
  lang,
  selectedRecord,
}) => {
  // Modal store
  const { modalType } = useModalStore();

  // State
  const [errors, setErrors] = useState<Partial<IClientForm>>({});
  const { error: toastError, success: toastSuccess } = useToast();
  // Memoized initial form data
  const initialFormData = useMemo<IClientForm>(
    () =>
      selectedRecord || {
        company_ice: "",
        email: "",
        phone: "",
        address: "",
        country: "",
        city: "",
      },
    [selectedRecord]
  );

  // Submit handler
  const handleSubmit = async (data: IClientForm): Promise<boolean> => {
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/clients/${selectedRecord?.id}`,
        {
          method: "PATCH",
          lang,
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        toastSuccess(translation.client.message.update_success);
        return true;
      } else {
        const error = await response.json();
        if (error?.errors?.email) {
          setErrors((prev) => ({ ...prev, email: error.errors.email }));
        }
        if (error?.errors?.company_ice) {
          setErrors((prev) => ({
            ...prev,
            company_ice: error.errors.company_ice,
          }));
        }
        return false;
      }
    } catch (error) {
      console.error("Error during client updating:", error);
      return false;
    }
  };

  return (
    <ClientForm
      translation={translation}
      initialFormData={initialFormData}
      errors={errors}
      setErrors={setErrors}
      onSubmit={handleSubmit}
      isOpen={modalType === "update"}
    />
  );
};

export default UpdateClientForm;
