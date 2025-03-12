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
import { Calendar, ScanEye } from "lucide-react";
import { DeepPartialString } from "@/utils/typeScript_interface";

interface EmployeesFormProps {
  initialFormData: IEmployeesForm;
  translation: DictionaryType;
  errors: DeepPartialString<IEmployeesForm>;
  setErrors: Dispatch<SetStateAction<DeepPartialString<IEmployeesForm>>>;
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
      contentClassName="2xl:min-w-[50%]"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-4">
        <InputField
          id="matricule"
          label={translation.employee.form.matricule}
          value={formData.matricule}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          error={errors.matricule}
          required
        />
        {/* national_id */}
        <InputField
          id="national_id"
          label={translation.employee.form.national_id}
          value={formData.national_id}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          // icon={<ScanEye size={18} />}
          error={errors.national_id}
          placeholder="XX-XXX-XX"
          required
        />
      </div>
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
        <div className="flex gap-4">
          <InputField
            id="birth_date"
            type="date"
            label={translation.employee.form.birth_date}
            value={formData.birth_date || ""}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.birth_date}
            required
          />
          <InputField
            id="cnss_number"
            type="string"
            label={translation.employee.form.cnss_number}
            value={formData.cnss_number || ""}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
          />
        </div>

        {/* adress */}
        <InputField
          id="address"
          label={translation.employee.form.address}
          value={formData.address}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          error={errors.address}
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

        <div className="grid grid-cols-2 gap-4">
          <InputField
            id="price_per_ton"
            type="number"
            label={translation.employee.form.price_per_ton}
            value={formData.price_per_ton}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.price_per_ton}
            required
            suffix={translation.shared.currency}
          />
          <InputField
            id="date_of_engagement"
            type="date"
            label={translation.employee.form.date_of_engagement}
            value={formData.date_of_engagement}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.date_of_engagement}
            required
          />
        </div>
      </div>
    </GlobalModal>
  );
};

export default EmployeesForm;
