"use client";

// React & Hooks
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import useToast from "@/hooks/useToast";

// Components
import { GlobalTable } from "@/components/shared/GlobalTable";
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
import EmployeesMappers, { UserRow } from "@/mappers/EmployeesMapper";
import http from "@/lib/http";
import { UploadEmployee } from "./UploadEmployee";
import PrintableEmployee from "./printable/PrintableEmployee";
import { useReactToPrint } from "react-to-print";
import HistoryModal from "./HistoryModal";

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
  const { rowMapper } = EmployeesMappers;
  const {
    sidebar: { users_table },
  } = translation;

  // State
  const [Employeess, setEmployeess] = useState<IEmployee[]>(records);
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
  const userRows = useMemo(() => rowMapper(Employeess), [rowMapper, Employeess]);
  const [selectedEmployeeForPrint, setSelectedEmployeeForPrint] = useState<IEmployees | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Refs
  const didMountRef = useRef(false);

  // Real-time updates
  const handleEmployeesUpdate = useEntityUpdate<IEmployee>(setEmployeess);
  usePusher("Employees", handleEmployeesUpdate);

  // Handlers
  const handleEdit = useCallback(
    (recordId: number) => {
      const record = Employeess.find((user) => user.id === recordId);
      setSelectedRecord(record);
      openModal(ModalTypeEnum.UPDATE);
    },
    [openModal, Employeess]
  );

  const handleShowHistory = useCallback(
    (recordId: number) => {
      const SelectedRecord = Employeess.find(
        (record) => record.id === recordId
      );
      setSelectedRecord(SelectedRecord);
      openModal(ModalTypeEnum.History);
    },
    [openModal, Employeess]
  );

  const openDeleteModal = useCallback(
    (recordId: number) => {
      const record = Employeess.find((Employees) => Employees.id === recordId);
      setSelectedRecord(record);
      openModal(ModalTypeEnum.DELETE);
    },
    [Employeess, openModal]
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

  // Refresh Employeess
  const refreshEmployeess = useRefresh({
    searchQuery,
    currentPage,
    setIsLoading,
    entity: "Employeess",
    setRecords: setEmployeess,
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

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Bulletin de Paie${selectedEmployeeForPrint?.id || "document"}`,
    onAfterPrint: () => setSelectedEmployeeForPrint(null),
  });

  useEffect(() => {
    if (selectedEmployeeForPrint) handlePrint();
  }, [selectedEmployeeForPrint, handlePrint]);

  const handlePrintRequest = useCallback(
    (employeeId: number) => {
      const employeesToPrint = Employeess.find((d) => d.id === employeeId);
      if (employeesToPrint) setSelectedEmployeeForPrint(employeesToPrint);
    },
    [Employeess]
  );

  // Memoized headers to prevent re-renders
  interface TableHeader {
    key: keyof UserRow;
    label: string;
    renderCell?: (_: any, row: UserRow) => JSX.Element;
  }

  const tableHeaders: TableHeader[] = useMemo(
    () => [
      { key: "employee_id" as keyof UserRow, label: users_table.headers.id },
      { key: "name" as keyof UserRow, label: users_table.headers.name },
      { key: "national_id" as keyof UserRow, label: users_table.headers.national_id },
      { key: "date_of_engagement" as keyof UserRow, label: users_table.headers.date_of_engagement },
      { key: "monthly_salary" as keyof UserRow, label: users_table.headers.monthly_salary },
      { key: "price_per_hour" as keyof UserRow, label: users_table.headers.price_per_hour },
      { key: "price_per_day" as keyof UserRow, label: users_table.headers.price_per_day },
      {
        key: "id" as keyof UserRow,
        label: users_table.headers.actions,
        renderCell: (_: any, row: UserRow) => (
          <ActionButtons
            Id={row.id}
            onShowHistory={handleShowHistory}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            onPrint={handlePrintRequest}
            editText={users_table.actions.edit}
            deleteText={users_table.actions.delete}
          />
        ),
      },
    ],
    [
      users_table.headers.name,
      users_table.headers.email,
      users_table.headers.phone,
      users_table.headers.country,
      users_table.headers.city,
      users_table.headers.actions,
      users_table.actions.edit,
      users_table.actions.delete,
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

      {/* Employeess Table */}
      <GlobalTable<UserRow>
        headers={tableHeaders}
        rows={userRows}
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

      <UploadEmployee
        translation={translation}
        lang={lang}
      <div style={{ display: "none" }}>
        <PrintableEmployee
          ref={contentRef}
          employee={selectedEmployeeForPrint}
          translation={translation}
          lang={lang}
        />
      </div>
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
