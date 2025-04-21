"use client";

// React & Hooks
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import useToast from "@/hooks/useToast";
import { useReactToPrint } from "react-to-print";

// Components
import { GlobalTable, TableHeader } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import UpdateServiceForm from "./UpdateServiceForm";
import CreateServiceForm from "./CreateServiceForm";
import Header from "../shared/Header";

// Hooks & Store
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";
import useRefresh from "@/hooks/useRefresh";
import useDebounce from "@/hooks/useDebounce";

// Utils & Interfaces & Mappers
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { IService } from "@/interfaces/IService";
import http from "@/lib/http";
import { formatDate } from "@/utils/Date";
//import PrintableService from "./printable/PrintableService";

interface ServiceTableProps {
  records: IService[];
  totalRecords: number;
  translation: DictionaryType;
  lang: Locale;
}

export function ServiceTable({
  records = [],
  totalRecords = 0,
  translation,
  lang,
}: ServiceTableProps) {
  // Store & Hooks
  const { openModal, closeModal } = useModalStore();
  const {
    sidebar: { service_table },
  } = translation;

  // State
  const [services, setServices] = useState<IService[]>(records);
  const [totalServices, setTotalServices] = useState(totalRecords);
  const [selectedRecord, setSelectedRecord] = useState<IService | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error: toastError, success: toastSuccess } = useToast();
  // Refs
  const didMountRef = useRef(false);

  // Handlers
  const handleEdit = useCallback(
    (recordId: number) => {
      const record = services.find((item) => item.id === recordId);
      setSelectedRecord(record);
      openModal(ModalTypeEnum.UPDATE);
    },
    [openModal, services]
  );

  const openDeleteModal = useCallback(
    (recordId: number) => {
      const record = services.find((item) => item.id === recordId);
      setSelectedRecord(record);
      openModal(ModalTypeEnum.DELETE);
    },
    [services, openModal]
  );

  const handleDeleteConfirm = async () => {
    if (!selectedRecord) return;
    setIsSubmitting(true);
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/services/${selectedRecord.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) return;
      toastSuccess(translation.service.message.delete_success);
      closeModal();
      refreshServices(true);
    } catch (error) {
      console.error("Error deleting service:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Refresh Services
  const refreshServices = useRefresh({
    searchQuery,
    currentPage,
    setIsLoading,
    entity: "services",
    setRecords: setServices,
    setTotalRecords: setTotalServices,
  });

  // Debounced Search
  const debouncedSearch = useDebounce(refreshServices, 300);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    debouncedSearch();
  }, [searchQuery, debouncedSearch, currentPage]);

  // Memoized headers to prevent re-renders
  const tableHeaders: TableHeader<IService>[] = useMemo(
    () => [
      {
        key: "id" as keyof IService,
        label: service_table.headers.id,
      },
      {
        key: "created_at" as keyof IService,
        label: service_table.headers.created_at,
        renderCell: (value: string | number) => (
          <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal truncate">
            {formatDate(new Date(value as string))}
          </p>
        ),
      },

      {
        key: "designation" as keyof IService,
        label: service_table.headers.designation || "designation",
        renderCell: (value: string | number) => (
          <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal truncate">
            {value?.toString()}
          </p>
        ),
      },

      {
        key: "prix" as keyof IService,
        label: service_table.headers.prix || "prix",
        renderCell: (value: string | number) => (
          <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal truncate">
            {value?.toString()}
          </p>
        ),
      },
      {
        key: "id" as keyof IService,
        label: service_table.headers.actions,
        renderCell: (value: string | number, row: IService) => (
          <ActionButtons
            Id={row.id}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            editText={service_table.actions.edit}
            deleteText={service_table.actions.delete}
          />
        ),
      },
    ],
    [
      service_table.headers.id,
      service_table.headers.created_at,
      service_table.headers.designation,
      service_table.headers.prix,
      service_table.headers.actions,
      service_table.actions.edit,
      service_table.actions.delete,
      handleEdit,
      openDeleteModal,
    ]
  );

  return (
    <>
      <Header
        title={service_table.service_management}
        searchPlaceholder={service_table.search_placeholder}
        buttonText={service_table.create_new}
        showSearch={true}
        setSearchQuery={setSearchQuery}
      />

      {/* Services Table */}
      <GlobalTable<IService>
        headers={tableHeaders}
        rows={services}
        totalRows={totalServices}
        isLoading={isLoading}
        className="shadow-lg rounded-lg"
        setCurrentPage={setCurrentPage}
        noDataMessage={service_table.no_data.message}
        sub_text={service_table.no_data.sub_text}
        currentPage={currentPage}
      />

      {/* Update Service Form */}
      <UpdateServiceForm
        lang={lang}
        translation={translation}
        selectedRecord={selectedRecord}
        refreshRecords={refreshServices}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        onConfirm={handleDeleteConfirm}
        itemName={selectedRecord?.designation || ""}
        translation={translation}
        isLoading={isSubmitting}
      />

      {/* Create Service Form */}
      <CreateServiceForm
        lang={lang}
        translation={translation}
        refreshRecords={refreshServices}
      />

      {/* print */}
      {/*  <div style={{ display: "none" }}>
          <PrintableService
            ref={contentRef}
            record={selectedRecordsForPrint}
            translation={translation}
            lang={lang}
          />
        </div> */}
    </>
  );
}
