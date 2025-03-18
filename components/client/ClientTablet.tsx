"use client";

// React & Hooks
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import useToast from "@/hooks/useToast";

// Components
import { GlobalTable, TableHeader } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import UpdateClientForm from "./UpdateClientForm";
import CreateClientForm from "./CreateClientForm";
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
import { IClient } from "@/interfaces/IClient";
import clientMappers, { UserRow } from "@/mappers/ClientMapper";
import http from "@/lib/http";

interface ClientTableProps {
  records: IClient[];
  totalRecords: number;
  translation: DictionaryType;
  lang: Locale;
}

export function ClientTable({
  records = [],
  totalRecords = 0,
  translation,
  lang,
}: ClientTableProps) {
  // Store & Hooks
  const { openModal, closeModal } = useModalStore();
  const { rowMapper } = clientMappers;
  const {
    sidebar: { users_table },
  } = translation;

  // State
  const [clients, setClients] = useState<IClient[]>(records);
  const [totalClients, setTotalClients] = useState(totalRecords);
  const [selectedRecord, setSelectedRecord] = useState<IClient | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error: toastError, success: toastSuccess } = useToast();
  // Refs
  const didMountRef = useRef(false);

  // Real-time updates
  const handleClientUpdate = useEntityUpdate<IClient>(setClients);
  usePusher("client", handleClientUpdate);

  // Handlers
  const handleEdit = useCallback(
    (recordId: number) => {
      const record = clients.find((user) => user.id === recordId);
      setSelectedRecord(record);
      openModal(ModalTypeEnum.UPDATE);
    },
    [openModal, clients]
  );

  const openDeleteModal = useCallback(
    (recordId: number) => {
      const record = clients.find((client) => client.id === recordId);
      setSelectedRecord(record);
      openModal(ModalTypeEnum.DELETE);
    },
    [clients, openModal]
  );

  const handleDeleteConfirm = async () => {
    if (!selectedRecord) return;
    setIsSubmitting(true);
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/clients/${selectedRecord.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) return;
      toastSuccess(translation.client.message.delete_success);
      closeModal();
      refreshClients(true);
    } catch (error) {
      console.error("Error deleting client:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Refresh Clients
  const refreshClients = useRefresh({
    searchQuery,
    currentPage,
    setIsLoading,
    entity: "clients",
    setRecords: setClients,
    setTotalRecords: setTotalClients,
  });

  // Debounced Search
  const debouncedSearch = useDebounce(refreshClients, 300); //Smart khalifa

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    debouncedSearch();
  }, [searchQuery, debouncedSearch, currentPage]);

  // Memoized headers to prevent re-renders
  const tableHeaders: TableHeader<IClient>[] = useMemo(
    () => [
      {
        key: "company" as keyof IClient,
        label: translation.client.form.company,
        renderCell: (_: any, row: IClient) => row.company,
      },
      { key: "email" as keyof IClient, label: users_table.headers.email },
      { key: "phone" as keyof IClient, label: users_table.headers.phone },
      { key: "city" as keyof IClient, label: users_table.headers.city },
      {
        key: "id" as keyof IClient,
        label: users_table.headers.actions,
        renderCell: (_: any, row: IClient) => (
          <ActionButtons
            Id={row.id}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            editText={users_table.actions.edit}
            deleteText={users_table.actions.delete}
          />
        ),
      },
    ],
    [
      translation.client.form.company,
      users_table.headers.email,
      users_table.headers.phone,
      users_table.headers.city,
      users_table.headers.actions,
      users_table.actions.edit,
      users_table.actions.delete,
      handleEdit,
      openDeleteModal,
    ]
  );

  return (
    <>
      <Header
        title={users_table.customer_management}
        searchPlaceholder={users_table.search_placeholder}
        buttonText={users_table.create_new_client}
        showSearch={true}
        setSearchQuery={setSearchQuery}
      />

      {/* Clients Table */}
      <GlobalTable<IClient>
        headers={tableHeaders}
        rows={clients}
        totalRows={totalClients}
        isLoading={isLoading}
        className="shadow-lg rounded-lg"
        setCurrentPage={setCurrentPage}
        noDataMessage={users_table.no_data.message}
        sub_text={users_table.no_data.sub_text}
        currentPage={currentPage}
      />

      {/* Update Client Form */}
      <UpdateClientForm
        lang={lang}
        translation={translation}
        selectedRecord={selectedRecord}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        onConfirm={handleDeleteConfirm}
        itemName={selectedRecord?.company || ""}
        translation={translation}
        isLoading={isSubmitting}
      />

      {/* Create Client Form */}
      <CreateClientForm lang={lang} translation={translation} />
    </>
  );
}
