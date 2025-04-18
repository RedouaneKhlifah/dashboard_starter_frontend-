"use client";

// React & Hooks
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import useToast from "@/hooks/useToast";

// Components
import { GlobalTable, TableHeader } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";
import Header from "../../shared/Header";

// Hooks & Store
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";
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
    client,
  } = translation;

  // State
  const [clients, setClients] = useState<IClient[]>(records);
  const [totalClients, setTotalClients] = useState(totalRecords);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { error: toastError, success: toastSuccess } = useToast();
  // Refs
  const didMountRef = useRef(false);

  // Refresh Clients
  const refreshClients = useRefresh({
    searchQuery,
    currentPage,
    setIsLoading,
    entity: "clients/archived",
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

  // Restore  client
  const handleRestore = useCallback(
    async (id: number) => {
      const url = `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/clients/${id}/restore`;
      const response = await http(url, {
        method: "PATCH",
        lang,
      });
      if (!response.ok) {
        toastError(client.message.restore_error);
        return;
      }

      toastSuccess(client.message.restore_success);
      refreshClients(true);
    },
    [
      client.message.restore_error,
      client.message.restore_success,
      lang,
      refreshClients,
      toastError,
      toastSuccess,
    ]
  );

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
            deleteText={users_table.actions.Restore}
            onDeleteAsync={handleRestore}
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
      users_table.actions.Restore,
      handleRestore,
    ]
  );

  return (
    <>
      <Header
        title={users_table.customer_history}
        searchPlaceholder={users_table.search_placeholder}
        showButton={false}
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
    </>
  );
}
