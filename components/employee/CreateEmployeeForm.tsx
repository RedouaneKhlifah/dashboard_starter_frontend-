"use Employees";

// React & Hooks
import { useState, useMemo } from "react";
import useToast from "@/hooks/useToast";

// Components
import EmployeesForm from "./EmployeeForm";

// Store & Utils
import useModalStore from "@/store/modalStore";
import http from "@/lib/http";

// Types & Interfaces
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { ICreateEmployees } from "@/dto/employee/createEmployee";
import { DeepPartialString } from "@/utils/typeScript_interface";

interface EmployeesFormProps {
  translation: DictionaryType;
  lang: Locale;
}

const CreateEmployeesForm: React.FC<EmployeesFormProps> = ({
  translation,
  lang,
}) => {
  // Modal store
  const { modalType, setIsLoading } = useModalStore();

  // State
  const [errors, setErrors] = useState<DeepPartialString<ICreateEmployees>>({});
  const { error: toastError, success: toastSuccess } = useToast();
  // Memoized initial form data
  const initialFormData = useMemo<ICreateEmployees>(
    () => ({
      first_name: "",
      last_name: "",
      address: "",
      national_id: "",
      monthly_salary: 0,
      price_per_hour: 0,
      price_per_day: 0,
      city: "",
      date_of_engagement: "",
      employee_id: "",
    }),
    []
  );

  // Submit handler
  const handleSubmit = async (data: ICreateEmployees): Promise<boolean> => {
    try {
      setIsLoading(true);

      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/employees`,
        {
          method: "POST",
          lang,
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toastSuccess(translation.employee.message.success);
        return true;
      } else {
        const error = await response.json();
        toastError(error.message || translation.employee.message.error);

        return false;
      }
    } catch (error) {
      console.error("Error during Employees creation:", error);
      return false;
    }
  };

  return (
    <EmployeesForm
      translation={translation}
      initialFormData={initialFormData}
      errors={errors}
      setErrors={setErrors}
      onSubmit={handleSubmit}
      isOpen={modalType === "create"}
    />
  );
};

export default CreateEmployeesForm;
