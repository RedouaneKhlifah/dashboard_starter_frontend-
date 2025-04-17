"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import Header from "../shared/Header";
import CreateOrderForm from "./CreateOrderForm";
import UpdateOrderForm from "./UpdateOrderForm";
import Printableorder from "./printable/PrintableOrder";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";
import { usePusher } from "@/hooks/usePusher";
import { useEntityUpdate } from "@/hooks/useEntityUpdate";
import useRefresh from "@/hooks/useRefresh";
import useDebounce from "@/hooks/useDebounce";
import { useReactToPrint } from "react-to-print";
import http from "@/lib/http";
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { IOrder } from "@/interfaces/IOrder";
import { IClient } from "@/interfaces/IClient";
import useToast from "@/hooks/useToast";
import { OrderRow, ordersMapper } from "@/mappers/OrderMapper";

interface TableorderProps {
  records: IOrder[];
  totalRecords: number;
  translation: DictionaryType;
  lang: Locale;
}

export function TableOrder({
  records = [],
  totalRecords = 0,
  translation,
  lang,
}: TableorderProps) {
  const { openModal, closeModal } = useModalStore();
  const {
    sidebar: { orders_table },
  } = translation;

  // State Management
  const [orders, setorders] = useState<IOrder[]>(records);
  const [totalorders, setTotalorders] = useState(totalRecords);
  const [selectedRecord, setSelectedRecord] = useState<IOrder | undefined>(
    undefined
  );
  const { error: toastError, success: toastSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedorderForPrint, setSelectedorderForPrint] =
    useState<IOrder | null>(null);

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);

  // Hooks
  const handleorderUpdate = useEntityUpdate<IOrder>(setorders);
  usePusher("order", handleorderUpdate);

  const refreshorders = useRefresh({
    searchQuery,
    currentPage,
    setIsLoading,
    entity: "orders",
    setRecords: setorders,
    setTotalRecords: setTotalorders,
  });

  const debouncedSearch = useDebounce(refreshorders, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchQuery, currentPage, debouncedSearch]);

  // Print Handling
  const handlePrint = useReactToPrint({
    contentRef,
    onAfterPrint: () => setSelectedorderForPrint(null),
  });

  useEffect(() => {
    if (selectedorderForPrint) handlePrint();
  }, [selectedorderForPrint, handlePrint]);

  const handlePrintRequest = useCallback(
    (orderId: number) => {
      const orderToPrint = orders.find((o) => o.id === orderId);
      if (orderToPrint) setSelectedorderForPrint(orderToPrint);
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
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/orders/${selectedRecord.id}`,
        { method: "DELETE", lang }
      );

      if (!response.ok) return;
      toastSuccess(translation.order.form.message.delete_success);
      closeModal();
      refreshorders(true);
    } catch (error) {
      toastError(translation.order.form.message.delete_success);
      console.error("Error deleting orders:", error);
    }
  };

  const generateorderHTML = (
    order: IOrder,
    translation: DictionaryType,
    lang: Locale
  ) => {
    return ReactDOMServer.renderToString(
      <Printableorder order={order} translation={translation} lang={lang} />
    );
  };

  const handleEmail = useCallback(
    async (orderId: number) => {
      try {
        const orderToEmail = orders.find((o) => o.id === orderId);
        if (!orderToEmail) return;

        // Generate HTML content
        const htmlContent = generateorderHTML(orderToEmail, translation, lang);

        const response = await http(
          `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/orders/send-order-email/${orderId}`,
          {
            method: "PUT",
            lang,
            body: JSON.stringify({ htmlContent }),
          }
        );

        if (response.ok) {
          const responseData = await response.json();
          toastSuccess(responseData.message || "Email sent successfully");
        }
      } catch (error) {
        toastError("Failed to send email");
      }
    },
    [orders, translation, lang, toastSuccess, toastError]
  );

  // Table Headers
  const headers = useMemo(
    () => [
      {
        key: "reference" as keyof IOrder,
        label: orders_table.headers.reference,
      },
      {
        key: "order_date" as keyof IOrder,
        label: orders_table.headers.order_date,
      },
      {
        key: "expiration_date" as keyof IOrder,
        label: orders_table.headers.expiration_date,
      },
      {
        key: "client" as keyof IOrder,
        label: orders_table.headers.client,
        renderCell: (_: any, row: IOrder) => (row.client as IClient)?.company,
      },
      {
        key: "total" as keyof IOrder,
        label: orders_table.headers.total,
        renderCell: (_: any, row: OrderRow) => (
          <>
            {row.total}{" "}
            <span className="text-xs text-gray-500">
              {translation.shared.currency}
            </span>
          </>
        ),
      },
      {
        key: "actions" as keyof IOrder,
        label: orders_table.headers.actions,
        renderCell: (_: any, row: IOrder) => (
          <ActionButtons
            Id={row.id}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            onPrint={handlePrintRequest}
            editText={orders_table.actions.edit}
            deleteText={orders_table.actions.delete}
          />
        ),
      },
    ],
    [
      orders_table.headers.reference,
      orders_table.headers.order_date,
      orders_table.headers.expiration_date,
      orders_table.headers.client,
      orders_table.headers.total,
      orders_table.headers.actions,
      orders_table.actions.edit,
      orders_table.actions.delete,
      translation.shared.currency,
      handleEdit,
      openDeleteModal,
      handlePrintRequest,
    ]
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
      <GlobalTable<IOrder>
        headers={headers}
        rows={orders}
        totalRows={totalorders}
        isLoading={isLoading}
        className="shadow-lg rounded-lg "
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
        <Printableorder
          ref={contentRef}
          order={selectedorderForPrint}
          translation={translation}
          lang={lang}
        />
      </div>
    </>
  );
}
