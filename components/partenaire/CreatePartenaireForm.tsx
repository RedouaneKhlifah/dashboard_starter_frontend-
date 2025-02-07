"use client";
import { DictionaryType } from "@/lib/i18n";
import PartenaireForm from "./PartenaireForm";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import { Locale } from "@/i18n-config";
import useModalStore from "@/store/modalStore";
import { ICreatePartenaire } from "@/dto/partenaire/createPartenaire";

interface PartenaireFormProps {
  translation: DictionaryType;
  lang: Locale;
}

const CreatePartenaireForm: React.FC<PartenaireFormProps> = ({ translation, lang }) => {
  const { modalType } = useModalStore();

  const [errors, setErrors] = useState<Partial<ICreatePartenaire>>({});
  const initialFormData = useMemo<ICreatePartenaire>(
    () => ({
      name: "",
      matricule: ""
      // number: "",
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

      if (!response.ok) {
        const error = await response.json();

        return false;
      }
      return true;
    } catch (error) {
      console.error("Error during partenaire creation:", error);
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
      isOpen={modalType == "create"}
    />
  );
};

export default CreatePartenaireForm;
