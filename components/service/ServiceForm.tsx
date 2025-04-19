"use client";

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import GlobalModal from "@/components/shared/GlobalModal";
import InputField from "@/components/ui/InputField";
import useModalStore from "@/store/modalStore";
import { handleChange, hasNoErrors } from "@/components/utils/formHandlers";
import { ServiceValidator } from "@/validation/validators";
import { DictionaryType } from "@/lib/i18n";
import { IServiceForm } from "@/dto/service/IServiceForm";
import { DeepPartialString } from "@/utils/typeScript_interface";

interface ServiceFormProps {
  initialFormData: IServiceForm;
  translation: DictionaryType;
  errors: DeepPartialString<IServiceForm>;
  setErrors: Dispatch<SetStateAction<DeepPartialString<IServiceForm>>>;
  onSubmit: (formData: IServiceForm) => Promise<boolean>;
  isOpen: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  initialFormData,
  translation,
  errors,
  setErrors,
  onSubmit,
  isOpen,
}) => {
  const { modalType, closeModal } = useModalStore();
  const [formData, setFormData] = useState<IServiceForm>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { validateServiceForm } = ServiceValidator;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateServiceForm(formData, translation);
    setErrors(newErrors);

    if (hasNoErrors(newErrors)) {
      setIsSubmitting(true);
      try {
        const success = await onSubmit(formData);
        if (success) {
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
          ? translation.sidebar.service_table.create_new
          : translation.sidebar.service_table.update
      }
      submitButtonText={
        modalType === "create"
          ? translation.service.common.create
          : translation.service.common.update
      }
      cancelButtonText={translation.service.common.cancel}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        <div className="flex gap-4">
          <InputField
            id="designation"
            label={translation.service.form.designation}
            value={formData.designation || ""}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.designation}
            type="text"
          />

          <InputField
            id="prix"
            label={translation.service.form.prix}
            value={formData.prix}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.prix}
            type="number"
            min={0}
          />
        </div>
      </div>
    </GlobalModal>
  );
};

export default ServiceForm;
