"use Transaction";

// React & Hooks
import { useState, useMemo } from "react";
import useToast from "@/hooks/useToast";

// Components
import TransactionForm from "./TransactionForm";

// Store & Utils
import useModalStore from "@/store/modalStore";
import http from "@/lib/http";

// Types & Interfaces
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { ITransactionForm } from "@/dto/transaction/transactionForm";
import { DeepPartialString } from "@/utils/typeScript_interface";

interface TransactionFormProps {
  translation: DictionaryType;
  lang: Locale;
  setBalance: (balance: number) => void;
}

const CreateTransactionForm: React.FC<TransactionFormProps> = ({
  translation,
  lang,
  setBalance,
}) => {
  // Modal store
  const { modalType, setIsLoading } = useModalStore();

  // State
  const [errors, setErrors] = useState<DeepPartialString<ITransactionForm>>({});
  const { error: toastError, success: toastSuccess } = useToast();
  // Memoized initial form data
  const initialFormData = useMemo<ITransactionForm>(
    () => ({
      reason: "",
      amount: 0,
      type: "CREDIT",
      note: "",
    }),
    []
  );

  // Submit handler
  const handleSubmit = async (data: ITransactionForm): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/transactions`,
        {
          method: "PUT",
          lang,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        toastError(error.message || translation.transaction.message.error);
      }

      const responseData = await response.json();
      setBalance(responseData.balance);
      toastSuccess(translation.transaction.message.success);
      return true;
    } catch (error) {
      console.error("Error during Transaction creation:", error);
      return false;
    }
  };

  return (
    <TransactionForm
      translation={translation}
      initialFormData={initialFormData}
      errors={errors}
      setErrors={setErrors}
      onSubmit={handleSubmit}
      isOpen={modalType === "create"}
    />
  );
};

export default CreateTransactionForm;
