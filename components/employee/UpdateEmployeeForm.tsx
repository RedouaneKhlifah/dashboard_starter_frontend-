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
import { IEmployee } from "@/interfaces/IEmployee";
import { DeepPartialString } from "@/utils/typeScript_interface";

interface EmployeesFormProps {
  translation: DictionaryType;
  lang: Locale;
  selectedRecord?: IEmployee;
}

const UpdateEmployeesForm: React.FC<EmployeesFormProps> = ({
  translation,
  lang,
  selectedRecord,
}) => {
  // Modal store
  const { modalType } = useModalStore();

  // State
  const [errors, setErrors] = useState<DeepPartialString<IEmployeesForm>>({});
  const { error: toastError, success: toastSuccess } = useToast();
  // Memoized initial form data
  const initialFormData = useMemo<IEmployeesForm>(
    () =>
      selectedRecord || {
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
      },
    [selectedRecord]
  );

  // Submit handler
  const handleSubmit = async (data: IEmployeesForm): Promise<boolean> => {
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/employees/${selectedRecord?.id}`,
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
