"use client";

// React & Hooks
import { useState, useEffect, Dispatch, SetStateAction } from "react";

// Components
import GlobalModal from "@/components/shared/GlobalModal";
import InputField from "@/components/ui/InputField";

// Store & Utils
import useModalStore from "@/store/modalStore";
import { handleChange, hasNoErrors } from "@/components/utils/formHandlers";

// Validation & Types
import { ClientValidation } from "@/validation";
import { DictionaryType } from "@/lib/i18n";
import { IClientForm } from "@/dto/client/clientForm";

interface ClientFormProps {
  initialFormData: IClientForm;
  translation: DictionaryType;
  errors: Partial<IClientForm>;
  setErrors: Dispatch<SetStateAction<Partial<IClientForm>>>;
  onSubmit: (formData: IClientForm) => Promise<boolean>;
  isOpen: boolean;
}

const ClientForm: React.FC<ClientFormProps> = ({
  initialFormData,
  translation,
  errors,
  setErrors,
  onSubmit,
  isOpen,
}) => {
  // Modal Store
  const { modalType, closeModal } = useModalStore();

  // State
  const [formData, setFormData] = useState<IClientForm>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const { validateClientForm } = ClientValidation;

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateClientForm(formData, translation);
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

  // Reset form data when initial values change
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
          ? translation.sidebar.users_table.create_new_client
          : translation.sidebar.users_table.update_client
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
        {/* First & Last Name */}
        <div className="flex gap-4">
          <InputField
            id="company"
            label={translation.client.form.company}
            value={formData.company}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.company}
            required
          />
          <InputField
            id="ice"
            label={translation.client.form.ice}
            value={formData.ice}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.ice}
            required
          />
        </div>

        {/* Email */}
        <InputField
          id="email"
          label={translation.client.form.email}
          value={formData.email}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          error={errors.email}
          required
        />

        {/* Phone */}
        <InputField
          id="phone"
          label={translation.client.form.phone}
          value={formData.phone}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          error={errors.phone}
          required
        />

        {/* Address */}
        <InputField
          id="address"
          label={translation.client.form.address}
          value={formData.address}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          error={errors.address}
          required
        />

        {/* Country & City */}
        <div className="flex gap-4">
          <InputField
            id="country"
            label={translation.client.form.country}
            value={formData.country}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.country}
            required
          />
          <InputField
            id="city"
            label={translation.client.form.city}
            value={formData.city}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.city}
            required
          />
        </div>
      </div>
    </GlobalModal>
  );
};

export default ClientForm;
