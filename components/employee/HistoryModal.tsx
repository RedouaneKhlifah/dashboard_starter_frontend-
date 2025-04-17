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
import { GlobalTable } from "@/components/shared/GlobalTable";
import CreateBulletin from "./CreateBulletin";
import { ConfirmationModal } from "../shared/ConfirmationModal";
import useToast from "@/hooks/useToast";
import { OptimiseConfirmationModal } from "../shared/OptimiseConfirmationModal";

export interface PaymentHistory {
  id: number;
  employee_id: number;
  total_ton: string;
  price_per_ton: string;
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
  const contentRef = useRef<HTMLDivElement>(null);
  const { openSecondModal, secondModalType } = useModalStore();
  const { closeModal, modalType, openModal, closeSecondModal } =
    useModalStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [employeeWithHistory, setEmployeeWithHistory] =
    useState<IEmployeeWithHistory | null>(null);
  const [printData, setPrintData] = useState<PrintData | null>(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | null>(
    null
  );
  const { error: toastError, success: toastSuccess } = useToast();

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

  const openDeleteModal = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, historyId: number) => {
      e.preventDefault();
      setSelectedHistoryId(historyId);
      openSecondModal(ModalTypeEnum.DELETE);
    },
    [openSecondModal]
  );

  const handleDeleteConfirm = async () => {
    if (!selectedHistoryId) return;
    setIsSubmitting(true);
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/employees/history-of-pay/${selectedHistoryId}`,
        { method: "DELETE" }
      );
      if (!response.ok) return;
      toastSuccess(translation.HistoryModal.message.delete_success);
      setEmployeeWithHistory((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          payment_histories: prev.payment_histories.filter(
            (history) => history.id !== selectedHistoryId
          ),
        };
      });
      closeSecondModal();
      setSelectedHistoryId(null);
    } catch (error) {
      console.error("Error deleting Payment history:", error);
      toastError(translation.HistoryModal.message.delete_error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      cancelButtonText={translation.common.cancel}
      onSubmit={(e) => e.preventDefault()}
      contentClassName="2xl:min-w-[70%]"
    >
      <div className="space-y-4">
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={() => openSecondModal(ModalTypeEnum.CREATE)}
            className="px-3.5 py-2 text-sm font-medium bg-primary text-white rounded-md transition-colors shadow-sm hover:shadow-md"
          >
            {translation.HistoryModal.history.add_Payment}
          </button>
        </div>
        <GlobalTable
          headers={[
            {
              key: "period" as keyof PaymentHistory,
              label: translation.HistoryModal.history.period,
              renderCell: (_: any, row: PaymentHistory) => (
                <div>
                  <p>{row.start_date}</p>
                  <p>{row.end_date}</p>
                </div>
              ),
            },
            {
              key: "full_name" as keyof PaymentHistory,
              label: translation.HistoryModal.fullName,
              renderCell: (_: any, _row: PaymentHistory) => (
                <p>{employeeWithHistory?.full_name}</p>
              ),
            },
            {
              key: "price_per_ton" as keyof PaymentHistory,
              label: translation.employee.form.price_per_ton,
              renderCell: (_: any, row: PaymentHistory) => (
                <p>
                  {row?.price_per_ton}{" "}
                  <span className="text-xs">{translation.shared.currency}</span>
                </p>
              ),
            },
            {
              key: "total_ton" as keyof PaymentHistory,
              label: `${translation.order.form.articles.quantity}`,
              renderCell: (_: any, row: PaymentHistory) => (
                <p>
                  {row.total_ton}{" "}
                  <span className="text-xs">{translation.shared.ton_unit}</span>
                </p>
              ),
            },
            {
              key: "total_gain",
              label: translation.HistoryModal.total,
              renderCell: (_: any, row: PaymentHistory) => (
                <p>
                  {row.total_gain}{" "}
                  <span className="text-xs">
                    {" "}
                    {translation.shared.currency}{" "}
                  </span>
                </p>
              ),
            },
            {
              key: "actions" as keyof PaymentHistory,
              label: translation.HistoryModal.common.actions,
              renderCell: (_: any, row: PaymentHistory) => (
                <div className="flex gap-2 items-center">
                  <button
                    onClick={(e: any) => handlePrintRequest(e, row)}
                    className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors"
                    title={translation.HistoryModal.common.print}
                  >
                    <FileText size={18} />
                  </button>
                  <button
                    onClick={(e) => openDeleteModal(e, row.id)}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    {translation.sidebar.users_table.actions.delete}
                  </button>
                </div>
              ),
            },
          ]}
          rows={employeeWithHistory?.payment_histories || []}
          className="mt-4"
          totalRows={employeeWithHistory?.payment_histories?.length || 0}
          setCurrentPage={() => {}}
          currentPage={0}
          isLoading={isLoading}
        />
      </div>

      <div style={{ display: "none" }}>
        <PrintableEmployee
          ref={contentRef}
          employee={printData?.employee as IEmployee}
          selectedHistory={printData?.selectedHistory}
          translation={translation}
          lang={lang}
        />
      </div>
      <CreateBulletin
        translation={translation}
        isSecondOpen={secondModalType === "create"}
        employee={selectedRecord}
        setEmployeeWithHistory={setEmployeeWithHistory}
      />
      <OptimiseConfirmationModal
        onConfirm={handleDeleteConfirm}
        itemName={translation.HistoryModal.history_of_payment}
        translation={translation}
        isLoading={isSubmitting}
        backdrop={false}
        dismiss={false}
      />
    </GlobalModal>
  );
};

export default HistoryModal;
