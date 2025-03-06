"use client";
import { DictionaryType } from "@/lib/i18n";
import PartenaireForm from "./PartenaireForm";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import { Locale } from "@/i18n-config";
import useModalStore from "@/store/modalStore";
import { ICreatePartenaire } from "@/dto/partenaire/createPartenaire";
import useToast from "@/hooks/useToast";

interface PartenaireFormProps {
  translation: DictionaryType;
  lang: Locale;
}

const CreatePartenaireForm: React.FC<PartenaireFormProps> = ({
  translation,
  lang,
}) => {
  const { modalType } = useModalStore();
  const { error: toastError, success: toastSuccess } = useToast();
  const [errors, setErrors] = useState<Partial<ICreatePartenaire>>({});

  const initialFormData = useMemo<ICreatePartenaire>(
    () => ({
      name: "",
      matricule: "",
    }),
    []
  );

  const handleSubmit = async (data: ICreatePartenaire): Promise<boolean> => {
    try {
      const response = await http(
        process.env.NEXT_PUBLIC_API_BASE_PATH + "/api/partenaires",
        {
          method: "POST",
          lang,
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toastSuccess(translation.partenaire.message.success);
        return true;
      } else {
        const error = await response.json();
        toastError(error.message || translation.partenaire.message.error);

        if (error?.errors?.matricule) {
          setErrors({ matricule: error.message });
        }
        return false;
      }
    } catch (error) {
      console.error("Error during partenaire creation:", error);
      toastError(translation.partenaire.message.error);
      return false;
    }
  };

  return (
    <PartenaireForm
      translation={translation}
      initialFormData={initialFormData}
      errors={errors}
      setErrors={setErrors}
      onSubmit={handleSubmit}
      isOpen={modalType === "create"}
    />
  );
};

export default CreatePartenaireForm;
