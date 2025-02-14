"use client";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import GlobalModal from "@/components/shared/GlobalModal";
import InputField from "@/components/ui/InputField";
import { DictionaryType } from "@/lib/i18n";
import { handleChange, hasNoErrors } from "@/components/utils/formHandlers";
import { PartenaireValidation } from "@/validation";
import useModalStore from "@/store/modalStore";
import { IPartenaireForm } from "@/dto/partenaire/partenaireForm";
import toast from "react-hot-toast";
import { CircleCheckBig } from "lucide-react";

interface PartenaireFormProps {
  initialFormData: IPartenaireForm;
  translation: DictionaryType;
  errors: Partial<IPartenaireForm>;
  setErrors: Dispatch<SetStateAction<Partial<IPartenaireForm>>>;
  onSubmit: (formData: IPartenaireForm) => Promise<boolean>;
  isOpen: boolean;
}

const PartenaireForm = ({
  initialFormData,
  translation,
  errors,
  setErrors,
  onSubmit,
  isOpen,
}: PartenaireFormProps) => {
  const { modalType, closeModal } = useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<IPartenaireForm>(initialFormData);

  const { validatePartenaireForm } = PartenaireValidation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validatePartenaireForm(formData, translation);
    setErrors(newErrors);

    if (hasNoErrors(newErrors)) {
      setIsSubmitting(true);
      try {
        const success = await onSubmit(formData);
        if (success) {
          toast((t) => {
            t.duration =3000
            
            return(
              <div className="flex items-center gap-2">
                <CircleCheckBig className="text-green-400" /> {translation.partenaire.message.success}
              </div>
            )
          })
          closeModal();
          setFormData(initialFormData);
          setErrors({});
        }
      } catch (error) {
        console.error("Submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  return (
    <div>
      <GlobalModal
        open={isOpen}
        onClose={() => {
          closeModal();
          setFormData(initialFormData);
          setErrors({});
        }}
        isLoading={isSubmitting}
        title={
          modalType === "create"
            ? translation.sidebar.partenaires_table.create_new_partner
            : translation.sidebar.partenaires_table.update_partner
        }
        submitButtonText={
          modalType === "create"
            ? translation.client.common.create
            : translation.client.common.update
        }
        cancelButtonText={translation.client.common.cancel}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="flex gap-4">
            <InputField
              id="name"
              label={translation.partenaire.form.name}
              value={formData.name}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.name}
              required
            />
            <InputField
              id="matricule"
              label={translation.partenaire.form.matricule}
              value={formData.matricule}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.matricule}
              required
            />
          </div>
        </div>
      </GlobalModal>
    </div>
  );
};

export default PartenaireForm;
