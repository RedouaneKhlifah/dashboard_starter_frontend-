"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import useToast from "@/hooks/useToast";

// Shared Components
import { GlobalTable } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import Header from "../shared/Header";

// Forms
import UpdatePartenaireForm from "./UpdateTicketForm";
import CreateTicketForm from "./CreateTicketForm";

// Hooks
import { usePusher } from "@/hooks/usePusher";
import { useEntityUpdate } from "@/hooks/useEntityUpdate";
import useRefresh from "@/hooks/useRefresh";
import useDebounce from "@/hooks/useDebounce";

// Store
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";

// Utilities & API
import http from "@/lib/http";
import updateTicketMapper from "@/mappers/TiketMapper";

// Types
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { ITicket } from "@/interfaces/ITicket";
import { ITicketForm } from "@/dto/ticket/ticketForm";
import { TableHeader } from "@/components/shared/GlobalTable";

interface TableTicketProps {
  records: ITicket[];
  totalRecords: number;
  translation: DictionaryType;
  status: {
        ENTRY: string;
        EXIT: string;
      };
  lang: Locale;
}

export function TableTicket({
  records = [],
  totalRecords = 0,
  translation,
  lang,
}: TableTicketProps) {
  // ──────────────────────────────────────────────
  // Modal & Translation Setup
  // ──────────────────────────────────────────────
  const { openModal, closeModal } = useModalStore();
  const {
    sidebar: { ticket_table },
  } = translation;

  // ──────────────────────────────────────────────
  // Local State
  // ──────────────────────────────────────────────
  const [tickets, setTickets] = useState<ITicket[]>(records);
  const [totalTickets, setTotalTickets] = useState(totalRecords);
  const [selectedRecord, setSelectedRecord] = useState<ITicketForm | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error: toastError, success: toastSuccess } = useToast();

  // Ref to track initial mount.
  const didMountRef = useRef(false);

  // ──────────────────────────────────────────────
  // Real-time & Refresh Hooks
  // ──────────────────────────────────────────────
  // Update tickets in real-time via Pusher
  const handleTicketUpdate = useEntityUpdate<ITicket>(setTickets);
  usePusher("ticket", handleTicketUpdate);

  // Refresh tickets using custom refresh hook
  const refreshTickets = useRefresh({
    searchQuery,
    currentPage,
    setIsLoading,
    entity: "tickets",
    setRecords: setTickets,
    setTotalRecords: setTotalTickets,
  });
  const debouncedSearch = useDebounce(refreshTickets, 300);

  // ──────────────────────────────────────────────
  // Effects
  // ──────────────────────────────────────────────
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    debouncedSearch();
  }, [searchQuery, debouncedSearch, currentPage]);

  // ──────────────────────────────────────────────
  // Event Handlers
  // ──────────────────────────────────────────────
  const handleEdit = useCallback(
    (partenaireId: number) => {
      const record = tickets.find((p) => p.id === partenaireId);
      if (!record) return;

      const updateTicketData = updateTicketMapper(record);
      setSelectedRecord(updateTicketData);
      openModal(ModalTypeEnum.UPDATE);
    },
    [openModal, tickets]
  );

  const openDeleteModal = useCallback(
    (productId: number) => {
      const record = tickets.find((p) => p.id === productId);
      if (!record) return;

      const updateTicketData = updateTicketMapper(record);
      setSelectedRecord(updateTicketData);
      openModal(ModalTypeEnum.DELETE);
    },
    [tickets, openModal]
  );

  const handleDeleteConfirm = async () => {
    if (!selectedRecord) return;
    setIsSubmitting(true);
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/tickets/${selectedRecord.id}`,
        { method: "DELETE", lang }
      );

      if (!response.ok) return;
      toastSuccess(translation.Ticket.message.delete_success);
      closeModal();
      refreshTickets(true);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Table Headers
  const headers: TableHeader<ITicket>[] = useMemo(
    () => [
      {
        key: "partenaire" as keyof ITicket,
        label: ticket_table.headers.matricule,
        renderCell: (_: any, row: ITicket) => (
          <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal truncate">
            {row.partenaire?.matricule}
          </p>
        ),
      },
      {
        key: "product" as keyof ITicket,
        label: ticket_table.headers.product,
        width: "100px",
        renderCell: (_: any, row: ITicket) => (
          <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal truncate">
            {row.product?.name}
          </p>
        ),
      },
      {
        key: "number_prints" as keyof ITicket,
        label: ticket_table.headers.number_prints,
        width: "120px",
      },
      {
        key: "poids_brut" as keyof ITicket,
        label: ticket_table.headers.poids_brut,
        renderCell: (_: any, row: ITicket) => row.poids_brut + " Kg",
      },
      {
        key: "poids_tare" as keyof ITicket,
        label: ticket_table.headers.poids_tare,
        renderCell: (_: any, row: ITicket) => row.poids_tare + " Kg",
      },
      {
        key: "poids_tare" as keyof ITicket,
        label: ticket_table.headers.poids_net,
        renderCell: (_: any, row: ITicket) =>
          row.poids_brut - row.poids_tare + " Kg",
      },
      {
        key: "status" as keyof ITicket,
        label: ticket_table.headers.status,
        renderCell: (_: any, row: ITicket) => (
          <span
            className={`px-2 py-1 text-xs font-semibold leading-tight text-white ${
              row.status === "ENTRY" ? "bg-green-400" : "bg-red-400"
            } rounded-full`}
          >
            {ticket_table.statusValues[row.status]}
          </span>
        ),
      },
      {
        key: "client" as keyof ITicket,
        label: ticket_table.headers.client,
        width: "130px",
        renderCell: (_: any, row: ITicket) => (
          <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal truncate">
            {row.client?.full_name}
          </p>
        ),
      },
      {
        key: "id",
        label: ticket_table.headers.actions,
        renderCell: (_, row: ITicket) => (
          <ActionButtons
            Id={row.id}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            editText={ticket_table.actions.edit}
            deleteText={ticket_table.actions.delete}
          />
        ),
      },
    ],
    [ticket_table, handleEdit, openDeleteModal]
  );

  // ──────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────
  return (
    <>
      <Header
        title={ticket_table.ticket_management}
        searchPlaceholder={ticket_table.search_placeholder}
        buttonText={ticket_table.create_new_ticket}
        showSearch={true}
        setSearchQuery={setSearchQuery}
      />
      <GlobalTable
        headers={headers}
        rows={tickets}
        totalRows={totalTickets}
        isLoading={isLoading}
        className="shadow-lg rounded-lg overflow-y-hidden overflow-x-auto "
        noDataMessage={ticket_table.no_data.message}
        sub_text={ticket_table.no_data.sub_text}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />

      <UpdatePartenaireForm
        lang={lang}
        translation={translation}
        selectedRecord={selectedRecord}
      />

      <ConfirmationModal
        onConfirm={handleDeleteConfirm}
        itemName={selectedRecord?.status || ""}
        translation={translation}
        isLoading={isSubmitting}
      />

      <CreateTicketForm lang={lang} translation={translation} />
    </>
  );
}
