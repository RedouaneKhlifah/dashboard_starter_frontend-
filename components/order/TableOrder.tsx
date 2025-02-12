"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { IDevis } from "@/interfaces/IDevis";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import CreateOrderForm from "./CreateOrderForm";
import Header from "../shared/Header";
import { usePusher } from "@/hooks/usePusher";
import { useEntityUpdate } from "@/hooks/useEntityUpdate";
import useRefresh from "@/hooks/useRefresh";
import useDebounce from "@/hooks/useDebounce";
import http from "@/lib/http";
import UpdateOrderForm from "./UpdateOrderForm";

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
  const { openModal, modalType, closeModal } = useModalStore();
  const {
    sidebar: { orders_table },
  } = translation;

  // State
  const [orders, setOrders] = useState<IDevis[]>(records);
  const [totalOrders, setTotalOrders] = useState(totalRecords);
  const [selectedRecord, setSelectedRecord] = useState<IDevis | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const didMountRef = useRef(false);

  const handleOrderUpdate = useEntityUpdate<IDevis>(setOrders);
  usePusher("order", handleOrderUpdate);

  const refreshOrders = useRefresh({
    searchQuery,
    currentPage,
    setIsLoading,
    entity: "devis",
    setRecords: setOrders,
    setTotalRecords: setTotalOrders
  });

  const debouncedSearch = useDebounce(refreshOrders, 300);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    debouncedSearch();
  }, [searchQuery, debouncedSearch, currentPage]);

  const handleEdit = useCallback(
    (orderId: number) => {
      const record = orders.find((o) => o.id === orderId);
      setSelectedRecord(record);
      openModal(ModalTypeEnum.UPDATE);
    },
    [openModal, orders]
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

  const handlePdf = useCallback((orderId: number) => {
    // Implement PDF download functionality
  }, []);



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
        label: orders_table.headers.clien,
      },
      {
        key: "total" as keyof IDevis,
        label: orders_table.headers.total,
      },
      {
        key: "id" as keyof IDevis,
        label: orders_table.headers.actions,
        renderCell: (_: any, row: IDevis) => (
          <ActionButtons
            Id={row.id}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            onEmail={(id) => handleEmail(id)}
            onPdf={(id) => handlePdf(id)}
            editText={orders_table.actions.edit}
            deleteText={orders_table.actions.delete}
          />
        ),
      },
    ],
    [handleEdit, openDeleteModal, handleEmail, handlePdf, orders_table]
  );

  return (
    <>
      <Header
        title={orders_table.order_management}
        searchPlaceholder={orders_table.search_placeholder}
        showButton={false}
        showSearch={true}  
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
        itemName={selectedRecord?.refrence || ""}
        translation={translation}
      />

      <CreateOrderForm
        lang={lang}
        translation={translation}
      />
    </>
  );
}