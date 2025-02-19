"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import Header from "../shared/Header";
import CreateOrderForm from "./CreateFactureForm";
import UpdateFactureForm from "./UpdateFactureForm";
import PrintableOrder from "./printable/PrintableOrder";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";
import { usePusher } from "@/hooks/usePusher";
import { useEntityUpdate } from "@/hooks/useEntityUpdate";
import useRefresh from "@/hooks/useRefresh";
import useDebounce from "@/hooks/useDebounce";
import { useReactToPrint } from "react-to-print";
import http from "@/lib/http";
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { IFacture } from "@/interfaces/IFacture";
import { IClient } from "@/interfaces/IClient";

interface TableFactureProps {
  records: IFacture[];
  totalRecords: number;
  translation: DictionaryType;
  lang: Locale;
}

export function TableFacture({
  records = [],
  totalRecords = 0,
  translation,
  lang,
}: TableFactureProps) {
  const { openModal, closeModal } = useModalStore();
  const {
    sidebar: { factures_table },
  } = translation;

  // State Management
  const [orders, setOrders] = useState<IFacture[]>(records);
  const [totalOrders, setTotalOrders] = useState(totalRecords);
  const [selectedRecord, setSelectedRecord] = useState<IFacture | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderForPrint, setSelectedOrderForPrint] =
    useState<IFacture | null>(null);

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);

  // Hooks
  const handleOrderUpdate = useEntityUpdate<IFacture>(setOrders);
  usePusher("facture", handleOrderUpdate);

  const refreshOrders = useRefresh({
    searchQuery,
    currentPage,
    setIsLoading,
    entity: "facture",
    setRecords: setOrders,
    setTotalRecords: setTotalOrders,
  });

  const debouncedSearch = useDebounce(refreshOrders, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchQuery, currentPage, debouncedSearch]);

  // Print Handling
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Order_${selectedOrderForPrint?.reference || "document"}`,
    onAfterPrint: () => setSelectedOrderForPrint(null),
  });

  useEffect(() => {
    if (selectedOrderForPrint) handlePrint();
  }, [selectedOrderForPrint, handlePrint]);

  const handlePrintRequest = useCallback(
    (orderId: number) => {
      const orderToPrint = orders.find((o) => o.id === orderId);
      if (orderToPrint) setSelectedOrderForPrint(orderToPrint);
    },
    [orders]
  );

  // CRUD Actions
  const handleEdit = useCallback(
    (orderId: number) => {
      const record = orders.find((o) => o.id === orderId);
      if (!record) return;
      setSelectedRecord(record);
      openModal(ModalTypeEnum.UPDATE);
    },
    [orders, openModal]
  );

  const openDeleteModal = useCallback(
    (orderId: number) => {
      const record = orders.find((o) => o.id === orderId);
      setSelectedRecord(record);
      openModal(ModalTypeEnum.DELETE);
    },
    [orders, openModal]
  );

  const handleDeleteConfirm = async () => {
    if (!selectedRecord) return;
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/factures/${selectedRecord.id}`,
        { method: "DELETE", lang }
      );

      if (!response.ok) return;

      closeModal();
      refreshOrders(true);
    } catch (error) {
      console.error("Error deleting factures:", error);
    }
  };

  const handleEmail = useCallback((orderId: number) => {
    // Implement email functionality
  }, []);

  const headers = useMemo(
    () => [
      {
        key: "invoice_number" as keyof IFacture,
        label: factures_table.headers.invoice_number,
        renderCell: (_: any, row: IFacture) => row.reference,
      },
      {
        key: "client_name" as keyof IFacture,
        label: factures_table.headers.client_name,
        renderCell: (_: any, row: IFacture) =>
          (row.client as IClient)?.full_name,
      },
      {
        key: "due_date" as keyof IFacture,
        label: factures_table.headers.due_date,
        renderCell: (_: any, row: IFacture) => row.facture_date,
      },
      {
        key: "tva" as keyof IFacture,
        label: factures_table.headers.vat,
        renderCell: (_: any, row: IFacture) => row.tva,
      },
      {
        key: "total" as keyof IFacture,
        label: factures_table.headers.amount,
        renderCell: (_: any, row: IFacture) => row.total,
      },
      {
        key: "paid" as keyof IFacture,
        label: factures_table.headers.paid,
        renderCell: (_: any, row: IFacture) => row.paid_amount,
      },
      {
        key: "status" as keyof IFacture,
        label: factures_table.headers.status,
        renderCell: (_: any, row: IFacture) => row?.status,
      },
      {
        key: "actions" as keyof IFacture,
        label: factures_table.headers.actions,
        renderCell: (_, row: IFacture) => (
          <ActionButtons
            Id={row.id}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            onEmail={handleEmail}
            onPrint={handlePrintRequest}
            editText={factures_table.actions.edit}
            deleteText={factures_table.actions.delete}
          />
        ),
      },
    ],
    [
      factures_table,
      handleEdit,
      openDeleteModal,
      handleEmail,
      handlePrintRequest,
    ]
  );

  return (
    <>
      <Header
        title={factures_table.invoice_management}
        searchPlaceholder={factures_table.search_placeholder}
        buttonText={factures_table.create_new_invoice}
        showSearch
        setSearchQuery={setSearchQuery}
      />
      <GlobalTable<IFacture>
        headers={headers}
        rows={orders}
        totalRows={totalOrders}
        isLoading={isLoading}
        className="shadow-lg rounded-lg overflow-hidden"
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      <UpdateFactureForm
        lang={lang}
        translation={translation}
        selectedRecord={selectedRecord}
      />
      <ConfirmationModal
        onConfirm={handleDeleteConfirm}
        itemName={selectedRecord?.reference || ""}
        translation={translation}
      />
      <CreateOrderForm lang={lang} translation={translation} />
      <div style={{ display: "none" }}>
        <PrintableOrder
          ref={contentRef}
          order={selectedOrderForPrint}
          translation={translation}
          lang={lang}
        />
      </div>
    </>
  );
}
