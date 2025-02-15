"use client";
import { DictionaryType } from "@/lib/i18n";
import PartenaireForm from "./PartenaireForm";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import useModalStore from "@/store/modalStore";
import { Locale } from "@/i18n-config";
import { IPartenaireForm } from "@/dto/partenaire/partenaireForm";
import { IPartenaire } from "@/interfaces/IPartenaire";
import useToast from "@/hooks/useToast";

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
  const { error: toastError, success: toastSuccess } = useToast();

  const initialFormData = useMemo<IPartenaireForm>(
    () =>
      selectedRecord || {
        name: "",
        matricule: "",
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

      if (response.ok) {
        toastSuccess(translation.partenaire.message.update_success);
        return true;
      } else {
        const error = await response.json();
        toastError(error.message || translation.partenaire.message.error);
        return false;
      }
    } catch (error) {
      console.error("Error during partenaire updating:", error);
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
      isOpen={modalType === "update"}
    />
  );
};

export default UpdatePartenaireForm;