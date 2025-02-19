"use client";
import { DictionaryType } from "@/lib/i18n";
import FactureForm from "./FactureForm";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import { Locale } from "@/i18n-config";
import useModalStore from "@/store/modalStore";
import { FactureFormErrors } from "@/validation/factureValidators/factureValidator";
import { IFactureForm, Status } from "@/dto/facture/factureForm";
import useToast from "@/hooks/useToast";
import { ICreateFacture } from "@/dto/facture/createFacture";
import { FactureMapper } from "@/mappers/FactureMapper";

interface FactureFormProps {
  translation: DictionaryType;
  lang: Locale;
}

const CreateFactureFormPropsForm: React.FC<FactureFormProps> = ({
  translation,
  lang,
}) => {
  const { modalType } = useModalStore();
  const [errors, setErrors] = useState<FactureFormErrors>({});
  const { error: toastError, success: toastSuccess } = useToast();
  const { FactureDataMapper } = FactureMapper;

  const initialFormData = useMemo<ICreateFacture>(
    () => ({
      client_id: 0,
      reference: "",
      facture_date: "",
      expiration_date: "",
      tva: 0,
      remise_type: "PERCENT",
      remise: 0,
      note: "",
      products: [],
      client: null,
      subtotal: 0,
      total: 0,
      paid_amount: 0,
      status: Status.DRAFT,
    }),
    []
  );

  const handleSubmit = async (data: IFactureForm): Promise<boolean> => {
    const formattedData = FactureDataMapper(data);
    try {
      const response = await http(
        process.env.NEXT_PUBLIC_API_BASE_PATH + "/api/factures",
        {
          method: "POST",
          lang,
          body: JSON.stringify(formattedData),
        }
      );

      if (response.ok) {
        toastSuccess(translation.order.form.message.success);
        return true;
      } else {
        const error = await response.json();
        toastError(error.message || translation.order.form.message.error);
        return false;
      }
    } catch (error) {
      console.error("Error during facture creation:", error);
      toastError(translation.order.form.message.error);
      return false;
    }
  };

  return (
    <FactureForm
      translation={translation}
      initialFormData={initialFormData}
      errors={errors}
      setErrors={setErrors}
      onSubmit={handleSubmit}
      isOpen={modalType === "create"}
    />
  );
};

export default CreateFactureFormPropsForm;
