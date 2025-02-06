"use client";
import { DictionaryType } from "@/lib/i18n";
import ClientForm from "./ClientForm";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import { Locale } from "@/i18n-config";
import useModalStore from "@/store/modalStore";
import { ICreateClient } from "@/dto/client/createClient";

interface ClientFormProps {
  translation: DictionaryType;
  lang: Locale;
}

const CreateClientForm: React.FC<ClientFormProps> = ({ translation, lang }) => {
  const { modalType } = useModalStore();

  const [errors, setErrors] = useState<Partial<ICreateClient>>({});
  const initialFormData = useMemo<ICreateClient>(
    () => ({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      city: "",
    }),
    []
  );

  const handleSubmit = async (data: ICreateClient): Promise<boolean> => {
    try {
      const response = await http(
        process.env.NEXT_PUBLIC_API_BASE_PATH + "/api/clients",
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
      isOpen={modalType == "create"}
    />
  );
};

export default CreateClientForm;
