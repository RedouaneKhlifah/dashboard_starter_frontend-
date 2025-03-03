"use client";

// React & Hooks
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import useToast from "@/hooks/useToast";

// Components
import { GlobalTable, TableHeader } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
// import UpdateTransactionForm from "./UpdateTransactionForm";
import CreateTransactionForm from "./CreateTransactionForm";
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
import { ITransaction } from "@/interfaces/ITransaction";
import http from "@/lib/http";
import LiveClock from "../shared/LiveClock";
import UpdateTransactionForm from "./UpdateTransactionForm";
import { Clock9, CreditCard } from "lucide-react";
import { formatDate } from "@/utils/Date";

interface TransactionTableProps {
  initialBalance: number;
  records: ITransaction[];
  totalRecords: number;
  translation: DictionaryType;
  lang: Locale;
}

export function TransactionTable({
  initialBalance,
  records = [],
  totalRecords = 0,
  translation,
  lang,
}: TransactionTableProps) {
  // Store & Hooks
  const { openModal, closeModal } = useModalStore();
  const {
    sidebar: { transactions_table },
  } = translation;

  // State
  const [balance, setBalance] = useState(initialBalance);
  const [transactions, setTransactions] = useState<ITransaction[]>(records);
  const [totalTransactions, setTotalTransactions] = useState(totalRecords);
  const [selectedRecord, setSelectedRecord] = useState<
    ITransaction | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error: toastError, success: toastSuccess } = useToast();

  // Refs
  const didMountRef = useRef(false);

  // Real-time updates
  const handleTransactionUpdate =
    useEntityUpdate<ITransaction>(setTransactions);
  usePusher("transaction", handleTransactionUpdate);

  // RealTimeBalence
  const handleBalanceUpdate = (
    action: "created" | "updated" | "deleted",
    value: number
  ) => {
    if (action === "updated") {
      setBalance(value);
    }
  };
  usePusher("balance", handleBalanceUpdate);

  // Handlers
  const handleEdit = useCallback(
    (recordId: number) => {
      const record = transactions.find((user) => user.id === recordId);
      setSelectedRecord(record);
      openModal(ModalTypeEnum.UPDATE);
    },
    [openModal, transactions]
  );

  const openDeleteModal = useCallback(
    (recordId: number) => {
      const record = transactions.find(
        (transaction) => transaction.id === recordId
      );
      setSelectedRecord(record);
      openModal(ModalTypeEnum.DELETE);
    },
    [transactions, openModal]
  );

  const handleDeleteConfirm = async () => {
    if (!selectedRecord) return;
    setIsSubmitting(true);
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/transactions/${selectedRecord.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) return;
      const responseData = await response.json();
      setBalance(responseData.balance);
      toastSuccess(translation.transaction.message.delete_success);
      closeModal();
      refreshTransactions(true);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Refresh Transactions
  const refreshTransactions = useRefresh({
    searchQuery,
    currentPage,
    setIsLoading,
    entity: "transactions",
    setRecords: setTransactions,
    setTotalRecords: setTotalTransactions,
  });

  // Debounced Search
  const debouncedSearch = useDebounce(refreshTransactions, 300); //Smart khalifa

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (totalRecords === 0) return;
    debouncedSearch();
  }, [searchQuery, debouncedSearch, currentPage, totalRecords]);

  // Memoized headers to prevent re-renders

  const tableHeaders: TableHeader<ITransaction>[] = useMemo(
    () => [
      {
        key: "date" as keyof ITransaction,
        label: transactions_table.headers.date,
        renderCell: (_: any, row: ITransaction) =>
          formatDate(new Date(row.created_at)),
      },
      { key: "reason", label: transactions_table.headers.reason },
      { key: "amount", label: transactions_table.headers.amount },
      { key: "type", label: transactions_table.headers.type },
      {
        key: "id",
        label: transactions_table.headers.actions,
        renderCell: (_: any, row: ITransaction) => (
          <ActionButtons
            Id={row.id}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            editText={transactions_table.actions.edit}
            deleteText={transactions_table.actions.delete}
          />
        ),
      },
    ],
    [transactions_table, handleEdit, openDeleteModal]
  );

  return (
    <>
      <div className="grid grid-cols-3 gap-6 items-center p-6 mb-6 bg-primary/5 rounded-lg">
        <div className="p-5 rounded-lg shadow-md border border-gray-100 bg-background hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            {transactions_table.transaction_management}
          </h3>
          <div className="h-1 w-16 bg-primary rounded"></div>
        </div>

        <div className="p-5 rounded-lg shadow-md border border-gray-100 bg-background hover:shadow-lg transition-shadow flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-full">
            <CreditCard className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <span className="text-sm text-gray-500">
              {translation.transaction.balance}
            </span>
            <p className="text-xl font-semibold text-gray-800">{balance} DH</p>
          </div>
        </div>

        <div className="p-5 rounded-lg shadow-md border border-gray-100 bg-background hover:shadow-lg transition-shadow flex items-center space-x-3">
          <div className="bg-black p-2 rounded-full">
            <Clock9 className="h-5 w-5 text-white" />
          </div>
          <LiveClock className="text-xl font-semibold text-gray-800" />
        </div>
      </div>
      <Header
        searchPlaceholder={transactions_table.search_placeholder}
        buttonText={transactions_table.create_new_transaction}
        showSearch={true}
        setSearchQuery={setSearchQuery}
      />
      {/* Transactions Table */}
      <GlobalTable<ITransaction>
        headers={tableHeaders}
        rows={transactions}
        totalRows={totalTransactions}
        isLoading={isLoading}
        className="shadow-lg rounded-lg overflow-hidden"
        setCurrentPage={setCurrentPage}
        noDataMessage={transactions_table.no_data.message}
        sub_text={transactions_table.no_data.sub_text}
        currentPage={currentPage}
      />
      {/* Update Transaction Form */}
      <UpdateTransactionForm
        lang={lang}
        translation={translation}
        selectedRecord={selectedRecord}
        setBalance={setBalance}
      />
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        onConfirm={handleDeleteConfirm}
        itemName={selectedRecord?.reason + " " + selectedRecord?.amount || ""}
        translation={translation}
        isLoading={isSubmitting}
      />
      {/* Create Transaction Form */}
      <CreateTransactionForm
        lang={lang}
        translation={translation}
        setBalance={setBalance}
      />
    </>
  );
}
