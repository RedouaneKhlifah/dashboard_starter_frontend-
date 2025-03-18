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
import { ICreateClient } from "@/dto/client/createClient";
import { es } from "date-fns/locale";

interface ClientFormProps {
  translation: DictionaryType;
  lang: Locale;
}

const CreateClientForm: React.FC<ClientFormProps> = ({ translation, lang }) => {
  // Modal store
  const { modalType, setIsLoading } = useModalStore();

  // State
  const [errors, setErrors] = useState<Partial<ICreateClient>>({});
  const { error: toastError, success: toastSuccess } = useToast();
  // Memoized initial form data
  const initialFormData = useMemo<ICreateClient>(
    () => ({
      company_ice: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      city: "",
    }),
    []
  );

  // Submit handler
  const handleSubmit = async (data: ICreateClient): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/clients`,
        {
          method: "PUT",
          lang,
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toastSuccess(translation.client.message.success);
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
      console.error("Error during client creation:", error);
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
      isOpen={modalType === "create"}
    />
  );
};

export default CreateClientForm;
