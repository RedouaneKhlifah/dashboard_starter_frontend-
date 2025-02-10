"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";
import UpdatePartenaireForm from "./UpdateTicketForm";
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { ITicket } from "@/interfaces/ITicket";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import CreateTicketForm from "./CreateTicketForm";
import Header from "../shared/Header";
import { usePusher } from "@/hooks/usePusher";
import { useEntityUpdate } from "@/hooks/useEntityUpdate";
import useRefresh from "@/hooks/useRefresh";
import useDebounce from "@/hooks/useDebounce";
import http from "@/lib/http";
import { set } from "zod";

interface TableTicketProps {
  records: ITicket[];
  totalRecords: number;
  translation: DictionaryType;
  lang: Locale;
}

export function TableTicket({
  records = [],
  totalRecords = 0,
  translation,
  lang,
}: TableTicketProps) {
  const { openModal, modalType, closeModal } = useModalStore();
  const {
    sidebar: { ticket_table },
  } = translation;



  // State
  const [tickets, setTickets] = useState<ITicket[]>(records);
  const [totalTickets, setTotalTickets] = useState(totalRecords);
  const [selectedRecord, setSelectedRecord] = useState<ITicket | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");


  const didMountRef = useRef(false);


  const handleTicketUpdate = useEntityUpdate<ITicket>(setTickets);
  usePusher("ticket", handleTicketUpdate);


  const refreshTickets = useRefresh({
    searchQuery,
    currentPage,
    setIsLoading,
    entity: "tickets",
    setRecords: setTickets,
    setTotalRecords: setTotalTickets,
  });

  const debouncedSearch = useDebounce(refreshTickets, 300);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    debouncedSearch();
  }, [searchQuery, debouncedSearch, currentPage]);


  const handleEdit = useCallback(
    (partenaireId: number) => {
      const record = tickets.find((p) => p.id === partenaireId);
      setSelectedRecord(record);
      openModal(ModalTypeEnum.UPDATE);
    },
    [openModal, tickets]
  );

  const openDeleteModal = useCallback(
    (productId: number) => {
      const record = tickets.find((p) => p.id === productId);
      setSelectedRecord(record);
      openModal(ModalTypeEnum.DELETE);
    },
    [tickets, openModal]
  );

  const handleDeleteConfirm = async () => {
    if (!selectedRecord) return;
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/products/${selectedRecord.id}`,
        { method: "DELETE", lang }
      );

      if (!response.ok) return;

      closeModal();
      refreshTickets(true);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

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
         headers={[
          { 
            key: "partenaire", 
            label: ticket_table.headers.matricule,
            renderCell: (_, row: ITicket) => row.partenaire?.matricule 
          },
          { 
            key: "product", 
            label: ticket_table.headers.product,
            renderCell: (_, row: ITicket) => row.product?.name 
          },
          { key: "number_prints", label: ticket_table.headers.number_prints },
          { key: "poids_brut", label: ticket_table.headers.poids_brut },
          { key: "poids_tare", label: ticket_table.headers.poids_tare },
          { key: "status", label: ticket_table.headers.status },
          { 
            key: "client", 
            label: ticket_table.headers.client,
            renderCell: (_, row: ITicket) => row.client?.full_name 
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
        ]}
        rows={records}
        totalRows={totalTickets}
        isLoading={isLoading}
        className="shadow-lg rounded-lg overflow-hidden"
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
      />

      <CreateTicketForm
        lang={lang}
        translation={translation}
      />
    </>
  );
}