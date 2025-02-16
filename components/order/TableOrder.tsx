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
import { IClient } from "@/interfaces/IClient";
import { useReactToPrint } from "react-to-print";
import PrintableOrder from "./printable/PrintableOrder"
import ReactDOM from "react-dom";

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
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<IDevis | null>(null);
  const printableRef = useRef(null);
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

  const handlePrint = useReactToPrint({
    content: () => printableRef.current,
    documentTitle: `Order_${selectedOrderForPrint?.reference || "document"}`,
    onAfterPrint: () => setSelectedOrderForPrint(null),
    pageStyle: `
      @media print {
        @page { margin: 20px; }
        body { -webkit-print-color-adjust: exact; }
      }
    `,
  });
  const handlePrintRequest = useCallback((orderId: number) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) {
      console.error("No order found for printing");
      return;
    }
  
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      console.error("Could not open print window");
      return;
    }
  

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Order</title>
          <style>
            @media print {
              @page { 
                margin: 20mm;
                size: A4;
              }
              body { 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                font-family: Arial, sans-serif;
              }
              table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                padding: 8px;
                border-bottom: 1px solid #ddd;
              }
              .text-right {
                text-align: right;
              }
              .text-center {
                text-align: center;
              }
              .company-header {
                margin-bottom: 20px;
                text-align: center;
              }
              .totals-section {
                margin-top: 20px;
                margin-left: auto;
                width: 250px;
              }
              .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
              }
            }
          </style>
        </head>
        <body>
    `);
  
    // Render the PrintableOrder component
    const PrintableContent = (
      <PrintableOrder
        order={order}
        translation={translation}
        lang={lang}
      />
    );
  
    // Render to string and write to print window
    const root = ReactDOM.createRoot(printWindow.document.body);
    root.render(PrintableContent);
  
    // Wait for content to be rendered before printing
    setTimeout(() => {
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 1000);
  }, [orders, lang, translation]);

  useEffect(() => {
    if (selectedOrderForPrint) {
      handlePrint();
    }
  }, [selectedOrderForPrint]);



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
        renderCell: (client: IClient) => client.full_name,
      },
      {
        key: "id" as keyof IDevis,
        label: orders_table.headers.total,
        renderCell: (_: any, row: IDevis) => {
          const subtotal = row.products.reduce(
            (acc, product) => acc + product.sale_price,
            0
          );
          const discount = row.remise_type === "PERCENT"
            ? subtotal * (row.remise / 100)
            : row.remise;
          const totalAfterDiscount = subtotal - discount;
          const taxAmount = totalAfterDiscount * (row.tva / 100);
          return (totalAfterDiscount + taxAmount).toFixed(2);
        },
      },
      {
        key: "id" as keyof IDevis,
        label: orders_table.headers.actions,
        renderCell: (_: any, row: IDevis) => (
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
    [orders_table, handleEdit, openDeleteModal]
  );

  return (
    <>
      <Header
        title={orders_table.order_management}
        searchPlaceholder={orders_table.search_placeholder}
        buttonText={orders_table.create_new_order}
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
        itemName={selectedRecord?.reference || ""}
        translation={translation}
      />

      <CreateOrderForm
        lang={lang}
        translation={translation}
      />
      {selectedOrderForPrint && (
        <div className="hidden w-full">
          <PrintableOrder
            ref={printableRef}
            order={selectedOrderForPrint}
            translation={translation}
            lang={lang}
          />
        </div>
      )}
    </>
  );
}