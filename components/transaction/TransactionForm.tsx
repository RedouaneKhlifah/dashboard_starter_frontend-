"use transaction";

// React & Hooks
import { useState, useEffect, Dispatch, SetStateAction } from "react";

// Components
import GlobalModal from "@/components/shared/GlobalModal";
import InputField from "@/components/ui/InputField";

// Store & Utils
import useModalStore from "@/store/modalStore";
import {
  handleChange,
  handleSelect,
  hasNoErrors,
} from "@/components/utils/formHandlers";

// Validation & Types
import { TransactionValidation } from "@/validation";
import { DictionaryType } from "@/lib/i18n";
import { ITransactionForm } from "@/dto/transaction/transactionForm";
import { DeepPartialString } from "@/utils/typeScript_interface";
import SelectInput, { SelectOption } from "../ui/SelectInput";

interface TransactionFormProps {
  initialFormData: ITransactionForm;
  translation: DictionaryType;
  errors: DeepPartialString<ITransactionForm>;
  setErrors: Dispatch<SetStateAction<DeepPartialString<ITransactionForm>>>;
  onSubmit: (formData: ITransactionForm) => Promise<boolean>;
  isOpen: boolean;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
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
  const [formData, setFormData] = useState<ITransactionForm>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation
  const { validateTransactionForm } = TransactionValidation;

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateTransactionForm(formData, translation);
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
          ? translation.sidebar.transactions_table.create_new_transaction
          : translation.sidebar.transactions_table.update_transaction
      }
      submitButtonText={
        modalType === "create"
          ? translation.common.create
          : translation.common.update
      }
      cancelButtonText={translation.common.cancel}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        {/* First & Last Name */}
        <div className="flex gap-4">
          <InputField
            id="reason"
            label={translation.transaction.form.reason}
            value={formData.reason}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.reason}
            required
          />
          <InputField
            id="amount"
            label={translation.transaction.form.amount}
            value={formData.amount}
            type="number"
            min={0}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            error={errors.amount}
            suffix={translation.shared.currency}
            required
          />
        </div>

        {/* Email */}
        <SelectInput
          id="type"
          label={translation.transaction.form.type}
          value={formData.type}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          error={errors.type}
          required
          options={[
            {
              value: "CREDIT",
              label:
                translation.sidebar.transactions_table.transaction_types.credit,
            },
            {
              value: "DEBIT",
              label:
                translation.sidebar.transactions_table.transaction_types.debit,
            },
          ]}
          onSelect={(option) =>
            handleSelect(option, "type", setFormData, setErrors)
          }
        />

        <InputField
          id="note"
          label={translation.transaction.form.note}
          value={formData.note}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          error={errors.note}
          textarea
          rows={4}
        />
      </div>
    </GlobalModal>
  );
};

export default TransactionForm;
