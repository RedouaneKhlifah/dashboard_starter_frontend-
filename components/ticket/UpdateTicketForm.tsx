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
  selectedRecord?: ITicketForm | null;
}

const UpdateTicketForm: React.FC<TicketFormProps> = ({
  translation,
  lang,
  selectedRecord,
}) => {
  const { modalType } = useModalStore();
  const [errors, setErrors] = useState<TicketFormErrors>({});

  const initialFormData = useMemo<ITicketForm>(
    () =>
      selectedRecord ?? {
        partenaire: null,
        product: null,
        number_prints: 0,
        poids_brut: 0,
        poids_tare: 0,
        status: "ENTRY",
        client: null,
      },
    [selectedRecord]
  );

  const handleSubmit = async (data: ITicketForm): Promise<boolean> => {
    if (!selectedRecord?.id) return false;

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
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/tickets/${selectedRecord.id}`,
        {
          method: "PATCH",
          lang,
          body: JSON.stringify(formattedData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error updating ticket:", error);
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
      isOpen={modalType === "update"}
    />
  );
};

export default UpdateTicketForm;
