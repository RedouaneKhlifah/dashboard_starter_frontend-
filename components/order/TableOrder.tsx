"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import Header from "../shared/Header";
import CreateOrderForm from "./CreateOrderForm";
import UpdateOrderForm from "./UpdateOrderForm";
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
import { IDevis } from "@/interfaces/IDevis";
import { IClient } from "@/interfaces/IClient";

interface TableOrderProps {
  records: IDevis[];
  totalRecords: number;
  translation: DictionaryType;
  lang: Locale;
}

export function TableOrder({
  records = [],
  totalRecords = 0,
  translation,
  lang,
}: TableOrderProps) {
  const { openModal, closeModal } = useModalStore();
  const {
    sidebar: { orders_table },
  } = translation;

  // State Management
  const [orders, setOrders] = useState<IDevis[]>(records);
  const [totalOrders, setTotalOrders] = useState(totalRecords);
  const [selectedRecord, setSelectedRecord] = useState<IDevis | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderForPrint, setSelectedOrderForPrint] =
    useState<IDevis | null>(null);

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);

  // Hooks
  const handleOrderUpdate = useEntityUpdate<IDevis>(setOrders);
  usePusher("order", handleOrderUpdate);

  const refreshOrders = useRefresh({
    searchQuery,
    currentPage,
    setIsLoading,
    entity: "devis",
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
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/devis/${selectedRecord.id}`,
        { method: "DELETE", lang }
      );

      if (!response.ok) return;

      closeModal();
      refreshOrders(true);
    } catch (error) {
      console.error("Error deleting devis:", error);
    }
  };

  const handleEmail = useCallback((orderId: number) => {
    // Implement email functionality
  }, []);

  // Table Headers
  const headers = useMemo(
    () => [
      {
        key: "reference" as keyof IDevis,
        label: orders_table.headers.reference,
      },
      {
        key: "devis_date" as keyof IDevis,
        label: orders_table.headers.devis_date,
      },
      {
        key: "expiration_date" as keyof IDevis,
        label: orders_table.headers.expiration_date,
      },
      {
        key: "client" as keyof IDevis,
        label: orders_table.headers.client,
        renderCell: (_: any, row: IDevis) => (row.client as IClient).full_name,
      },
      {
        key: "total" as keyof IDevis,
        label: orders_table.headers.total,
      },
      {
        key: "actions" as keyof IDevis,
        label: orders_table.headers.actions,
        renderCell: (_, row: IDevis) => (
          <ActionButtons
            Id={row.id}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            onEmail={handleEmail}
            onPrint={handlePrintRequest}
            editText={orders_table.actions.edit}
            deleteText={orders_table.actions.delete}
          />
        ),
      },
    ],
    [orders_table, handleEdit, openDeleteModal, handleEmail, handlePrintRequest]
  );

  return (
    <>
      <Header
        title={orders_table.order_management}
        searchPlaceholder={orders_table.search_placeholder}
        buttonText={orders_table.create_new_order}
        showSearch
        setSearchQuery={setSearchQuery}
      />
      <GlobalTable<IDevis>
        headers={headers}
        rows={orders}
        totalRows={totalOrders}
        isLoading={isLoading}
        className="shadow-lg rounded-lg overflow-hidden"
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
      <UpdateOrderForm
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
