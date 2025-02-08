"use client";

// React & Hooks
import { useState, useMemo } from "react";

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

  // Memoized initial form data
  const initialFormData = useMemo<IClientForm>(
    () =>
      selectedRecord || {
        first_name: "",
        last_name: "",
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

      if (!response.ok) {
        await response.json();
        return false;
      }

      return true;
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
