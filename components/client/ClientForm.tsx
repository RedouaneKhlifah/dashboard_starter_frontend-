"use client";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import GlobalModal from "@/components/shared/GlobalModal";
import InputField from "@/components/ui/InputField";
import { DictionaryType } from "@/lib/i18n";
import { handleChange, hasNoErrors } from "@/components/utils/formHandlers";
import { ClientValidation } from "@/validation";
import useModalStore from "@/store/modalStore";
import { IClientForm } from "@/dto/client/clientForm";

interface ClientFormProps {
  initialFormData: IClientForm;
  translation: DictionaryType;
  errors: Partial<IClientForm>;
  setErrors: Dispatch<SetStateAction<Partial<IClientForm>>>;
  onSubmit: (formData: IClientForm) => Promise<boolean>;
  isOpen: boolean;
}

const ClientForm = ({
  initialFormData,
  translation,
  errors,
  setErrors,
  onSubmit,
  isOpen,
}: ClientFormProps) => {
  const { modalType, closeModal } = useModalStore()

  const [formData, setFormData] = useState<IClientForm>(initialFormData);

  const { validateClientForm } = ClientValidation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateClientForm(formData, translation);
    setErrors(newErrors);

    if (hasNoErrors(newErrors)) {
      const success = await onSubmit(formData);
      if (success) {
        closeModal();
        setFormData(initialFormData);
        setErrors({});
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
          <div className="flex gap-4">
            <InputField
              id="first_name"
              label={translation.client.form.first_name}
              value={formData.first_name}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.first_name}
              required
            />
            <InputField
              id="last_name"
              label={translation.client.form.last_name}
              value={formData.last_name}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.last_name}
              required
            />
          </div>

          <InputField
            id="email"
            label={translation.client.form.email}
            value={formData.email}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.email}
            required
          />

          <InputField
            id="phone"
            label={translation.client.form.phone}
            value={formData.phone}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.phone}
            required
          />

          <InputField
            id="address"
            label={translation.client.form.address}
            value={formData.address}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.address}
            required
          />

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
    </div>
  );
};

export default ClientForm;
