"use client";
import { DictionaryType } from "@/lib/i18n";
import PartenaireForm from "./PartenaireForm";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import useModalStore from "@/store/modalStore";
import { Locale } from "@/i18n-config";
import { IPartenaireForm } from "@/dto/partenaire/partenaireForm";
import { IPartenaire } from "@/interfaces/IPartenaire";
import { log } from "console";

interface PartenaireFormProps {
  translation: DictionaryType;
  lang: Locale;
  selectedRecord: IPartenaire | undefined;
}

const UpdatePartenaireForm: React.FC<PartenaireFormProps> = ({
  translation,
  lang,
  selectedRecord,
}) => {
  const { modalType } = useModalStore();

  const [errors, setErrors] = useState<Partial<IPartenaireForm>>({});
  const initialFormData = useMemo<IPartenaireForm>(
    () =>
      selectedRecord || {
        name: "",
        matricule: "",
        // number: "",
      },
    [selectedRecord]
  );

  const handleSubmit = async (data: IPartenaireForm): Promise<boolean> => {
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/partenaires/${selectedRecord?.id}`,
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
      console.error("Error during paternaire updating:", error);
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
      isOpen={modalType == "update"}
    />
  );
};

export default UpdatePartenaireForm;