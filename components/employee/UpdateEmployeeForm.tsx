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
import { IEmployeesForm } from "@/dto/employee/employeeForm";
import { IEmployees } from "@/interfaces/IEmployee";

interface EmployeesFormProps {
  translation: DictionaryType;
  lang: Locale;
  selectedRecord?: IEmployees;
}

const UpdateEmployeesForm: React.FC<EmployeesFormProps> = ({
  translation,
  lang,
  selectedRecord,
}) => {
  // Modal store
  const { modalType } = useModalStore();

  // State
  const [errors, setErrors] = useState<Partial<IEmployeesForm>>({});
  const { error: toastError, success: toastSuccess } = useToast(); 
  // Memoized initial form data
  const initialFormData = useMemo<IEmployeesForm>(
    () =>
      selectedRecord || {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        country: "",
        city: "",
      },
    [selectedRecord]
  );

  // Submit handler
  const handleSubmit = async (data: IEmployeesForm): Promise<boolean> => {
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/Employeess/${selectedRecord?.id}`,
        {
          method: "PATCH",
          lang,
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        toastSuccess(translation.employee.message.update_success);
        return true;
      } else {
        const error = await response.json();
        toastError(error.message || translation.employee.message.error);
        return false;
      }
    } catch (error) {
      console.error("Error during Employees updating:", error);
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
      isOpen={modalType === "update"}
    />
  );
};

export default UpdateEmployeesForm;
