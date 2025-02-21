"use Employees";

// React & Hooks
import { useState, useEffect, Dispatch, SetStateAction } from "react";

// Components
import GlobalModal from "@/components/shared/GlobalModal";
import InputField from "@/components/ui/InputField";

// Store & Utils
import useModalStore from "@/store/modalStore";
import { handleChange, hasNoErrors } from "@/components/utils/formHandlers";

// Validation & Types
import { EmployeesValidation } from "@/validation";
import { DictionaryType } from "@/lib/i18n";
import { IEmployeesForm } from "@/dto/employee/employeeForm";

interface EmployeesFormProps {
  initialFormData: IEmployeesForm;
  translation: DictionaryType;
  errors: Partial<IEmployeesForm>;
  setErrors: Dispatch<SetStateAction<Partial<IEmployeesForm>>>;
  onSubmit: (formData: IEmployeesForm) => Promise<boolean>;
  isOpen: boolean;
}

const EmployeesForm: React.FC<EmployeesFormProps> = ({
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
  const [formData, setFormData] = useState<IEmployeesForm>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const { validateEmployeesForm } = EmployeesValidation;

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateEmployeesForm(formData, translation);
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
          ? translation.sidebar.users_table.create_new_Employees
          : translation.sidebar.users_table.update_Employees
      }
      submitButtonText={
        modalType === "create"
          ? translation.employee.common.create
          : translation.employee.common.update
      }
      cancelButtonText={translation.employee.common.cancel}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        {/* First & Last Name */}
        <div className="flex gap-4">
          <InputField
            id="first_name"
            label={translation.employee.form.first_name}
            value={formData.first_name}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.first_name}
            required
          />
          <InputField
            id="last_name"
            label={translation.employee.form.last_name}
            value={formData.last_name}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.last_name}
            required
          />
        </div>

        {/* Email */}
        <InputField
          id="email"
          label={translation.employee.form.email}
          value={formData.email}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          error={errors.email}
          required
        />

        {/* Phone */}
        <InputField
          id="phone"
          label={translation.employee.form.phone}
          value={formData.phone}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          error={errors.phone}
          required
        />

        {/* Address */}
        <InputField
          id="address"
          label={translation.employee.form.address}
          value={formData.address}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          error={errors.address}
          required
        />

        {/* Country & City */}
        <div className="flex gap-4">
          <InputField
            id="country"
            label={translation.employee.form.country}
            value={formData.country}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.country}
            required
          />
          <InputField
            id="city"
            label={translation.employee.form.city}
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

export default EmployeesForm;
