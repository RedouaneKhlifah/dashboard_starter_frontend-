"use client";

// React & Hooks
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import useToast from "@/hooks/useToast";

// Components
import { GlobalTable, TableHeader } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import UpdateEmployeesForm from "./UpdateEmployeeForm";
import CreateEmployeesForm from "./CreateEmployeeForm";
import Header from "../shared/Header";

// Hooks & Store
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";
import { usePusher } from "@/hooks/usePusher";
import { useEntityUpdate } from "@/hooks/useEntityUpdate";
import useRefresh from "@/hooks/useRefresh";
import useDebounce from "@/hooks/useDebounce";

// Utils & Interfaces & Mappers
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { IEmployee } from "@/interfaces/IEmployee";
import http from "@/lib/http";
import { UploadEmployee } from "./UploadEmployee";
import PrintableEmployee from "./printable/PrintableEmployee";
import { useReactToPrint } from "react-to-print";
import HistoryModal from "./HistoryModal";
import { EmployeeRow } from "@/mappers/EmployeesMapper";

interface EmployeesTableProps {
  records: IEmployee[];
  totalRecords: number;
  translation: DictionaryType;
  lang: Locale;
}

export function EmployeesTable({
  records = [],
  totalRecords = 0,
  translation,
  lang,
}: EmployeesTableProps) {
  // Store & Hooks
  const { openModal, closeModal, modalType } = useModalStore();
  const {
    sidebar: { users_table },
  } = translation;

  // State
  const [Employees, setEmployees] = useState<IEmployee[]>(records);
  const [totalEmployeess, setTotalEmployeess] = useState(totalRecords);
  const [selectedRecord, setSelectedRecord] = useState<IEmployee | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error: toastError, success: toastSuccess } = useToast();
  // Memoized values
  const [selectedEmployeeForPrint, setSelectedEmployeeForPrint] =
    useState<IEmployee | null>(null);

  // Refs
  const didMountRef = useRef(false);

  // Real-time updates
  const handleEmployeesUpdate = useEntityUpdate<IEmployee>(setEmployees);
  usePusher("employee", handleEmployeesUpdate);

  // Handlers
  const handleEdit = useCallback(
    (recordId: number) => {
      const record = Employees.find((user) => user.id === recordId);
      setSelectedRecord(record);
      openModal(ModalTypeEnum.UPDATE);
    },
    [openModal, Employees]
  );

  const handleShowHistory = useCallback(
    (recordId: number) => {
      const SelectedRecord = Employees.find((record) => record.id === recordId);
      setSelectedRecord(SelectedRecord);
      openModal(ModalTypeEnum.History);
    },
    [openModal, Employees]
  );

  const openDeleteModal = useCallback(
    (recordId: number) => {
      const record = Employees.find((Employees) => Employees.id === recordId);
      setSelectedRecord(record);
      openModal(ModalTypeEnum.DELETE);
    },
    [Employees, openModal]
  );

  const handleDeleteConfirm = async () => {
    if (!selectedRecord) return;
    setIsSubmitting(true);
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/employees/${selectedRecord.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) return;
      toastSuccess(translation.employee.message.delete_success);
      closeModal();
      refreshEmployeess(true);
    } catch (error) {
      console.error("Error deleting Employees:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Refresh Employees
  const refreshEmployeess = useRefresh({
    searchQuery,
    currentPage,
    setIsLoading,
    entity: "employee",
    setRecords: setEmployees,
    setTotalRecords: setTotalEmployeess,
  });

  // Debounced Search
  const debouncedSearch = useDebounce(refreshEmployeess, 300); //Smart khalifa

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    debouncedSearch();
  }, [searchQuery, debouncedSearch, currentPage]);

  // Memoized headers to prevent re-renders
  const tableHeaders: TableHeader<IEmployee>[] = useMemo(
    () => [
      {
        key: "matricule" as keyof IEmployee,
        label: users_table.headers.matricule,
      },
      {
        key: "full_name" as keyof IEmployee,
        label: users_table.headers.name,
        renderCell: (_: any, row: IEmployee) => `${row.full_name}`,
      },
      {
        key: "national_id",
        label: users_table.headers.national_id,
      },
      {
        key: "date_of_engagement",
        label: users_table.headers.date_of_engagement,
      },
      {
        key: "price_per_hour" as keyof EmployeeRow,
        label: users_table.headers.price_per_hour,
        renderCell: (_: any, row: EmployeeRow) =>
          `${row.price_per_hour} ${translation.shared.currency}`,
      },
      {
        key: "id" as keyof IEmployee,
        label: users_table.headers.actions,
        renderCell: (_: any, row: IEmployee) => (
          <ActionButtons
            Id={row.id}
            onShowHistory={handleShowHistory}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            editText={users_table.actions.edit}
            deleteText={users_table.actions.delete}
          />
        ),
      },
    ],
    [
      users_table.headers.matricule,
      users_table.headers.name,
      users_table.headers.national_id,
      users_table.headers.date_of_engagement,
      users_table.headers.price_per_hour,
      users_table.headers.actions,
      users_table.actions.edit,
      users_table.actions.delete,
      translation.shared.currency,
      handleShowHistory,
      handleEdit,
      openDeleteModal,
    ]
  );

  return (
    <>
      <Header
        title={users_table.Employee_management}
        searchPlaceholder={users_table.search_placeholder}
        buttonText={users_table.create_new_Employees}
        execlButtonText={users_table.upload_execl}
        execlButton={true}
        showSearch={true}
        setSearchQuery={setSearchQuery}
      />

      {/* Employees Table */}
      <GlobalTable<IEmployee>
        headers={tableHeaders}
        rows={Employees}
        totalRows={totalEmployeess}
        isLoading={isLoading}
        className="shadow-lg rounded-lg overflow-hidden"
        setCurrentPage={setCurrentPage}
        noDataMessage={users_table.no_data.message}
        sub_text={users_table.no_data.sub_text}
        currentPage={currentPage}
      />

      {/* Update Employees Form */}
      <UpdateEmployeesForm
        lang={lang}
        translation={translation}
        selectedRecord={selectedRecord}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        onConfirm={handleDeleteConfirm}
        itemName={selectedRecord?.first_name || ""}
        translation={translation}
        isLoading={isSubmitting}
      />

      {/* Create Employees Form */}
      <CreateEmployeesForm lang={lang} translation={translation} />

      <UploadEmployee translation={translation} lang={lang} />
      {/* history modal */}
      <HistoryModal
        lang={lang}
        isOpen={modalType === ModalTypeEnum.History}
        translation={translation}
        selectedRecord={selectedRecord}
      />
    </>
  );
}
