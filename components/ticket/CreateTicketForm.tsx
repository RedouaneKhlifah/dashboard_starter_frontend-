"use client";

import { useState, useMemo } from "react";

// Components
import TicketForm from "./TicketForm";

// Store
import useModalStore from "@/store/modalStore";

// Utilities & API
import http from "@/lib/http";

// Types
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { ITicketForm } from "@/dto/ticket/ticketForm";
import { TicketFormErrors } from "@/validation/ticketValidators/TicketValidator";

interface TicketFormProps {
  translation: DictionaryType;
  lang: Locale;
}

const CreateTicketForm: React.FC<TicketFormProps> = ({ translation, lang }) => {
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
    const formattedData = {
      partenaire_id: data.partenaire?.id,
      product_id: data.product?.id,
      client_id: data.client?.id,
      number_prints: data.number_prints,
      poids_brut: data.poids_brut,
      poids_tare: data.poids_tare,
      status: data.status,
    };

    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/tickets`,
        {
          method: "POST",
          lang,
          body: JSON.stringify(formattedData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        // need toast
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error during ticket creation:", error);
      return false;
      // need toast
    }
  };

  return (
    <TicketForm
      translation={translation}
      initialFormData={initialFormData}
      errors={errors}
      setErrors={setErrors}
      onSubmit={handleSubmit}
      isOpen={modalType === "create"}
    />
  );
};

export default CreateTicketForm;
