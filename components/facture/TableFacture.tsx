"use client";

import { useState, useMemo, useCallback, useRef, useEffect, use } from "react";
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
import { IEmployee } from "@/interfaces/IEmployee";
import { IClient } from "@/interfaces/IClient";
import Printableorder from "../facture/printable/PrintableOrder";
import ReactDOMServer from "react-dom/server";
import useToast from "@/hooks/useToast";
import { Status } from "@/dto/facture/factureForm";
import { stat } from "fs";

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
  const { error: toastError, success: toastSuccess } = useToast();

  // Refs
  const contentRef = useRef<HTMLDivElement>(null);

  // Hooks
  const handleOrderUpdate = useEntityUpdate<IFacture>(setOrders);
  usePusher("facture", handleOrderUpdate);

  const refreshOrders = useRefresh({
    searchQuery,
    currentPage,
    setIsLoading,
    entity: "factures",
    lang: lang,
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
    documentTitle: "",
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

  const generateFactureHTML = (
    facture: IFacture,
    translation: DictionaryType,
    lang: Locale
  ) => {
    return ReactDOMServer.renderToString(
      <Printableorder facture={facture} translation={translation} lang={lang} />
    );
  };

  const getStatusColor = useCallback((statusCode: string) => {
    switch (statusCode) {
      case Status.DRAFT:
        return "bg-gray-500";
      case Status.PAID:
        return "bg-green-500";
      case Status.PARTIALLY_PAID:
        return "bg-orange-500";
      case Status.UNPAID:
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  }, []);

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

  // const handleEmail = useCallback(
  //   async (orderId: number) => {
  //     try {
  //       const orderToEmail = orders.find((o) => o.id === orderId);
  //       if (!orderToEmail) {
  //         toastError("facture not found");
  //         return;
  //       }

  //       const htmlContent = generateFactureHTML(
  //         orderToEmail,
  //         translation,
  //         lang
  //       );

  //       const response = await http(
  //         `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/factures/send-facture-email/${orderId}`,
  //         {
  //           method: "PUT",
  //           lang,
  //           body: JSON.stringify({ htmlContent }),
  //         }
  //       );

  //       if (response.ok) {
  //         const responseData = await response.json();
  //         toastSuccess(responseData.message || "Email sent successfully");
  //       }
  //     } catch (error) {
  //       toastError("Failed to send email");
  //     }
  //   },
  //   [orders, translation, lang, toastError, toastSuccess]
  // );

  const headers = useMemo(
    () => [
      {
        key: "invoice_number" as keyof IFacture,
        label: factures_table.headers.invoice_number,
        width: "100px",
        renderCell: (_: any, row: IFacture) => row.reference,
      },
      {
        key: "client_name" as keyof IFacture,
        label: factures_table.headers.client_name,
        width: "100px",
        renderCell: (_: any, row: IFacture) => (row.client as IClient)?.company,
      },
      {
        key: "due_date" as keyof IFacture,
        label: factures_table.headers.due_date,
        width: "100px",
        renderCell: (_: any, row: IFacture) => (
          <>
            <span>{row.facture_date}</span>
          </>
        ),
      },
      {
        key: "total" as keyof IFacture,
        label: factures_table.headers.amount,
        width: "70px",
        renderCell: (_: any, row: IFacture) => (
          <>
            {row.total}{" "}
            <span className="text-xs text-gray-500">
              {translation.shared.currency}
            </span>
          </>
        ),
      },
      {
        key: "paid" as keyof IFacture,
        label: factures_table.headers.paid,
        width: "70px",
        renderCell: (_: any, row: IFacture) => (
          <>
            {row.paid_amount}{" "}
            <span className="text-xs text-gray-500">
              {translation.shared.currency}
            </span>
          </>
        ),
      },
      {
        key: "rest" as keyof IFacture,
        label: factures_table.headers.rest,
        width: "70px",
        renderCell: (_: any, row: IFacture) => {
          const rest = row.total - row.paid_amount;
          return (
            <>
              {rest.toFixed(2)}{" "}
              <span className="text-xs text-gray-500">
                {translation.shared.currency}
              </span>
            </>
          );
        },
      },
      {
        key: "status" as keyof IFacture,
        label: factures_table.headers.status,
        width: "140px",
        renderCell: (_: any, row: IFacture) => (
          <span
            className={`
              inline-block 
              px-2 
              py-1 
              rounded-full 
              text-xs 
              font-semibold 
              text-white 
              ${getStatusColor(row.status)}
            `}
          >
            {row?.statusText}
          </span>
        ),
      },
      {
        key: "actions" as keyof IFacture,
        label: factures_table.headers.actions,
        renderCell: (_: any, row: IFacture) => (
          <ActionButtons
            Id={row.id}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            onPrint={handlePrintRequest}
            editText={factures_table.actions.edit}
            deleteText={factures_table.actions.delete}
          />
        ),
      },
    ],
    [
      factures_table.headers.invoice_number,
      factures_table.headers.client_name,
      factures_table.headers.due_date,
      factures_table.headers.amount,
      factures_table.headers.paid,
      factures_table.headers.rest,
      factures_table.headers.status,
      factures_table.headers.actions,
      factures_table.actions.edit,
      factures_table.actions.delete,
      translation.shared.currency,
      getStatusColor,
      handleEdit,
      openDeleteModal,
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
        className="shadow-lg rounded-lg overflow-y-hidden overflow-x-auto"
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
          facture={selectedOrderForPrint}
          translation={translation}
          lang={lang}
        />
      </div>
    </>
  );
}
