"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import useToast from "@/hooks/useToast";

// Components
import { GlobalTable } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";
import UpdateProductForm from "./UpdateProductForm";
import CreateProductForm from "./CreateProductForm";
import Header from "../shared/Header";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";

// Store & Hooks
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";
import { usePusher } from "@/hooks/usePusher";
import { useEntityUpdate } from "@/hooks/useEntityUpdate";
import useRefresh from "@/hooks/useRefresh";
import useDebounce from "@/hooks/useDebounce";

// Utilities & API
import http from "@/lib/http";

// Types
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { IProduct } from "@/interfaces/IProduct";
import productMappers, { ProductRow } from "@/mappers/ProductMapper";

interface UsersTableProductProps {
  records: IProduct[];
  totalRecords: number;
  translation: DictionaryType;
  lang: Locale;
}

export function UsersTableProduct({
  records = [],
  totalRecords = 0,
  translation,
  lang,
}: UsersTableProductProps) {
  const { openModal, modalType, closeModal } = useModalStore();
  const {
    sidebar: { products_table },
  } = translation;

  // State
  const [products, setProducts] = useState<IProduct[]>(records);
  const [totalProducts, setTotalProducts] = useState(totalRecords);
  const [selectedRecord, setSelectedRecord] = useState<IProduct | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { error: toastError, success: toastSuccess } = useToast();
  const didMountRef = useRef(false);

  // Hooks
  const handleProductUpdate = useEntityUpdate<IProduct>(setProducts);
  usePusher("product", handleProductUpdate);

  const refreshProducts = useRefresh({
    searchQuery,
    currentPage,
    setIsLoading,
    entity: "products",
    setRecords: setProducts,
    setTotalRecords: setTotalProducts,
  });

  const debouncedSearch = useDebounce(refreshProducts, 300);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    debouncedSearch();
  }, [searchQuery, debouncedSearch, currentPage]);

  // Handlers
  const handleEdit = useCallback(
    (productId: number) => {
      const record = products.find((p) => p.id === productId);
      if (!record) return;
      setSelectedRecord(record);
      openModal(ModalTypeEnum.UPDATE);
    },
    [products, openModal]
  );

  const openDeleteModal = useCallback(
    (productId: number) => {
      const record = products.find((p) => p.id === productId);
      setSelectedRecord(record);
      openModal(ModalTypeEnum.DELETE);
    },
    [products, openModal]
  );

  const handleDeleteConfirm = async () => {
    if (!selectedRecord) return;
    setIsSubmitting(true);
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/products/${selectedRecord.id}`,
        { method: "DELETE", lang }
      );

      if (!response.ok) return;
      toastSuccess(translation.Product.message.delete_success);

      closeModal();
      refreshProducts(true);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Table Headers
  const headers = useMemo(
    () => [
      {
        key: "image" as keyof ProductRow,
        label: products_table.headers.image,
        isImage: true,
      },
      { key: "name" as keyof ProductRow, label: products_table.headers.name },
      { key: "sku" as keyof ProductRow, label: products_table.headers.sku },
      { key: "unit" as keyof ProductRow, label: products_table.headers.unit },
      {
        key: "sale_price" as keyof ProductRow,
        label: products_table.headers.sale_price,
      },
      {
        key: "cost_price" as keyof ProductRow,
        label: products_table.headers.cost_price,
      },
      { key: "tax" as keyof ProductRow, label: products_table.headers.tax },
      { key: "stock" as keyof ProductRow, label: products_table.headers.stock },
      {
        key: "description" as keyof ProductRow,
        label: products_table.headers.description,
      },
      {
        key: "reorder_point" as keyof ProductRow,
        label: products_table.headers.reorder_point,
      },
      {
        key: "id" as keyof ProductRow,
        label: products_table.headers.actions,
        renderCell: (_: any, row: ProductRow) => (
          <ActionButtons
            Id={row.id}
            onEdit={handleEdit}
            onDelete={openDeleteModal}
            editText={products_table.actions.edit}
            deleteText={products_table.actions.delete}
          />
        ),
      },
    ],
    [handleEdit, openDeleteModal, products_table]
  );

  return (
    <>
      <Header
        title={products_table.product_management}
        searchPlaceholder={products_table.search_placeholder}
        buttonText={products_table.create_new_product}
        showSearch={true}
        setSearchQuery={setSearchQuery}
      />

      <GlobalTable<ProductRow>
        headers={headers}
        rows={products}
        totalRows={totalProducts}
        isLoading={isLoading}
        noDataMessage={products_table.no_data.message}
        sub_text={products_table.no_data.sub_text}
        className="shadow-lg rounded-lg overflow-hidden"
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />

      <UpdateProductForm
        lang={lang}
        translation={translation}
        selectedRecord={selectedRecord}
      />

      <ConfirmationModal
        onConfirm={handleDeleteConfirm}
        itemName={selectedRecord?.name || ""}
        translation={translation}
        isLoading={isSubmitting}
      />

      <CreateProductForm lang={lang} translation={translation} />
    </>
  );
}
