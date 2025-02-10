"use client";
import { DictionaryType } from "@/lib/i18n";
import TicketForm from "./TicketForm";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import useModalStore from "@/store/modalStore";
import { Locale } from "@/i18n-config";
import { ITicketForm } from "@/dto/ticket/ticketForm";
import { ITicket } from "@/interfaces/ITicket";
import { TicketFormErrors } from "@/validation/ticketValidators/TicketValidator";


interface TicketFormProps {
  translation: DictionaryType;
  lang: Locale;
  selectedRecord: ITicket | undefined | null;
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
      selectedRecord || {
        matricule: "",
        product_id: 0,
        number_prints: 0,
        poids_brut: 0,
        poids_tare: 0,
        status: 'ENTRY',
        client_id: null
      },
    [selectedRecord]
  );

  const handleSubmit = async (data: ITicketForm): Promise<boolean> => {
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/tickets/${selectedRecord?.id}`,
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
      console.error("Error during ticket updating:", error);
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
      isOpen={modalType == "update"}
    />
  );
};

export default UpdateTicketForm;