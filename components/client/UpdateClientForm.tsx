"use client";
import { DictionaryType } from "@/lib/i18n";
import ClientForm from "./ClientForm";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import useModalStore from "@/store/modalStore";
import { Locale } from "@/i18n-config";
import { IUpdateClient } from "@/dto/client/updateClient";
import { IClientForm } from "@/dto/client/clientForm";
import { IClient } from "@/interfaces/IClient";
import { log } from "console";

interface ClientFormProps {
  translation: DictionaryType;
  lang: Locale;
  selectedRecord: IClient | undefined;
}

const UpdateClientForm: React.FC<ClientFormProps> = ({
  translation,
  lang,
  selectedRecord,
}) => {
  const { modalType } = useModalStore();

  const [errors, setErrors] = useState<Partial<IClientForm>>({});
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
        const error = await response.json();
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
      isOpen={modalType == "update"}
    />
  );
};

export default UpdateClientForm;