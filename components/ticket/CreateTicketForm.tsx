"use client";
import { DictionaryType } from "@/lib/i18n";
import TicketForm from "./TicketForm";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import { Locale } from "@/i18n-config";
import useModalStore from "@/store/modalStore";
import { ITicketForm } from "@/dto/ticket/ticketForm";
import { TicketFormErrors } from "@/validation/ticketValidators/TicketValidator";
import { IClient } from "@/interfaces/IClient";

interface TicketFormProps {
  translation: DictionaryType;
  lang: Locale;
}

const CreateTicketFormPropsForm: React.FC<TicketFormProps> = ({
  translation,
  lang,
}) => {
  const { modalType } = useModalStore();

  const [errors, setErrors] = useState<TicketFormErrors>({});
  const initialFormData = useMemo<ITicketForm>(
    () => ({
      partenaire: null,
      product: null,
      number_prints: 0,
      poids_brut: 0,
      poids_tare: 0,
      status: "ENTRY",
      client: null,
    }),
    []
  );

  const handleSubmit = async (data: ITicketForm): Promise<boolean> => {
    try {
      const response = await http(
        process.env.NEXT_PUBLIC_API_BASE_PATH + "/api/tickets",
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
      console.error("Error during ticket creation:", error);
      return false;
    }
  };

  return (
    <TicketForm
      translation={translation}
      initialFormData={initialFormData}
      errors={errors}
      setErrors={setErrors}
      onSubmit={handleSubmit}
      isOpen={modalType == "create"}
    />
  );
};

export default CreateTicketFormPropsForm;
