"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileText } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import GlobalModal from "@/components/shared/GlobalModal";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";
import { DictionaryType } from "@/lib/i18n";
import { IEmployee } from "@/interfaces/IEmployee";
import { Locale } from "@/i18n-config";
import http from "@/lib/http";
import PrintableEmployee from "./printable/PrintableEmployee";

export interface PaymentHistory {
  id: number;
  employee_id: number;
  total_hours: string;
  total_gain: string;
  start_date: string;
  end_date: string;
}

export interface IEmployeeWithHistory extends IEmployee {
  payment_histories: PaymentHistory[];
}

interface EmployeesFormProps {
  lang: Locale;
  translation: DictionaryType;
  isOpen: boolean;
  selectedRecord?: IEmployee;
}

interface PrintData {
  employee: IEmployeeWithHistory;
  selectedHistory: PaymentHistory;
}

const HistoryModal: React.FC<EmployeesFormProps> = ({
  lang,
  translation,
  isOpen,
  selectedRecord,
}) => {
  const { closeModal, modalType } = useModalStore();
  const contentRef = useRef<HTMLDivElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeWithHistory, setEmployeeWithHistory] =
    useState<IEmployeeWithHistory | null>(null);
  const [printData, setPrintData] = useState<PrintData | null>(null);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Bulletin-de-Paie-${printData?.employee.id || "document"}`,
    onAfterPrint: () => setPrintData(null),
  });

  const fetchEmployeeHistory = useCallback(async (employeeId: number) => {
    setIsLoading(true);
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/employees/history-of-pay/${employeeId}`
      );
      if (!response) return;
      const data = await response.json();
      setEmployeeWithHistory(data as IEmployeeWithHistory);
    } catch (error) {
      console.error("Error fetching employee history:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedRecord?.id && modalType === ModalTypeEnum.History) {
      fetchEmployeeHistory(selectedRecord.id);
    }
  }, [selectedRecord, modalType, fetchEmployeeHistory]);

  useEffect(() => {
    if (printData) {
      handlePrint();
    }
  }, [printData, handlePrint]);

  const handlePrintRequest = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, history: PaymentHistory) => {
      e.preventDefault();
      if (employeeWithHistory) {
        setPrintData({
          employee: employeeWithHistory,
          selectedHistory: history,
        });
      }
    },
    [employeeWithHistory]
  );

  const handleCloseModal = () => {
    closeModal();
    setEmployeeWithHistory(null);
  };

  return (
    <GlobalModal
      open={isOpen}
      onClose={handleCloseModal}
      isLoading={isSubmitting}
      title={translation.HistoryModal.history.title}
      submitButtonText={translation.common.update}
      cancelButtonText={translation.common.cancel}
      onSubmit={(e) => e.preventDefault()}
      contentClassName="2xl:min-w-[70%]"
    >
      <div className="space-y-4">
        {/* Table Header */}
        <div className="flex items-center bg-accent p-4 rounded-sm">
          {[
            translation.HistoryModal.history.period,
            translation.HistoryModal.fullName,
            translation.HistoryModal.hourlyRate,
             translation.HistoryModal.hours,
            translation.HistoryModal.total,
             translation.HistoryModal.common.actions,
          ].map((header, index) => (
            <p key={index} className="flex-1">
              {header}
            </p>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <>
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="flex items-center bg-accent p-4 py-4 rounded-sm animate-pulse"
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    {i === 0 && (
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}

        {/* Empty State */}
        {!isLoading && !employeeWithHistory?.payment_histories?.length && (
          <div className="text-center py-4 text-gray-500">
            {translation.HistoryModal.history.noData}
          </div>
        )}

        {/* Payment History */}
        {!isLoading &&
          employeeWithHistory?.payment_histories?.map((history) => (
            <div
              key={history.id}
              className="flex items-center bg-accent p-4 py-4 rounded-sm"
            >
              <div className="flex-1">
                <p>{history.start_date}</p>
                <p>{history.end_date}</p>
              </div>
              <p className="flex-1">{employeeWithHistory.full_name}</p>
              <p className="flex-1">{employeeWithHistory.price_per_hour} DH</p>
              <p className="flex-1">{history.total_hours}</p>
              <p className="flex-1">{history.total_gain} DH</p>
              <div className="flex-1">
                <button
                  onClick={(e) => handlePrintRequest(e, history)}
                  className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
                  title={translation.HistoryModal.common.print}
                >
                  <FileText size={18} />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Hidden Print Component */}
      <div style={{ display: "none" }}>
        <PrintableEmployee
          ref={contentRef}
          employee={printData?.employee as IEmployee}
          selectedHistory={printData?.selectedHistory}
          translation={translation}
          lang={lang}
        />
      </div>
    </GlobalModal>
  );
};

export default HistoryModal;
