"use Employees";

// React & Hooks
import { useState } from "react";

// Components
import GlobalModal from "@/components/shared/GlobalModal";

// Store & Utils
import useModalStore from "@/store/modalStore";

// Validation & Types
import { DictionaryType } from "@/lib/i18n";
import { IEmployees } from "@/interfaces/IEmployee";
import { Locale } from "@/i18n-config";
import { FileText, Pencil } from "lucide-react";

interface EmployeesFormProps {
  lang: Locale;
  translation: DictionaryType;
  isOpen: boolean;
  selectedRecord?: IEmployees;
}

const EmployeesForm: React.FC<EmployeesFormProps> = ({
  translation,
  isOpen,
}) => {
  // Modal Store
  const { closeModal } = useModalStore();

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const success = true;
      if (success) {
        closeModal();
      }
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlobalModal
      open={isOpen}
      onClose={closeModal}
      isLoading={isSubmitting}
      title={"Employees History"}
      submitButtonText={"update"}
      cancelButtonText={translation.employee.common.cancel}
      onSubmit={handleSubmit}
      contentClassName="2xl:min-w-[70%]"
    >
      <div className="space-y-4 ">
        {/* First & Last Name */}
        <div className="flex  items-center bg-accent p-4 rounded-sm ">
          <p className="flex-1">period</p>
          <p className="flex-1">Nom Complet</p>
          <p className="flex-1">Tarif Horaire</p>
          <p className="flex-1">Heures</p>
          <p className="flex-1">Total</p>
          <p className="flex-1">Action</p>
        </div>

        <div className="flex items-center bg-accent p-4 py-5 rounded-sm relative">
          <p className="flex-1">20/10/2021 - 20/15/2021</p>
          <p className="flex-1">Mohamed Ali</p>
          <p className="flex-1">20 DH</p>
          <p className="flex-1">8</p>
          <p className="flex-1">160 DH</p>
          <div className="flex-1">
            <button
              onClick={() => {}}
              className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex-1"
            >
              Bulletin de Paie
            </button>
          </div>
        </div>
      </div>
    </GlobalModal>
  );
};

export default EmployeesForm;
