"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { ActionButtons } from "@/components/shared/ActionButtons";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";
import UpdatePartenaireForm from "./UpdateProductForm";
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { IProduct } from "@/interfaces/IProduct";
import productMappers, { ProductRow } from "@/mappers/ProductMapper";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import CreateProductForm from "./CreateProductForm";
import Header from "../shared/Header";
import { usePusher } from "@/hooks/usePusher";
import { useEntityUpdate } from "@/hooks/useEntityUpdate";
import useRefresh from "@/hooks/useRefresh";
import useDebounce from "@/hooks/useDebounce";
import http from "@/lib/http";

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
  const [selectedRecord, setSelectedRecord] = useState<IProduct | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");


  const didMountRef = useRef(false);

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


  const handleEdit = useCallback(
    (partenaireId: number) => {
      const record = products.find((p) => p.id === partenaireId);
      if (!record) return;
      setSelectedRecord(record);
      openModal(ModalTypeEnum.UPDATE);
    },
    [openModal, products]
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
    try {
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/products/${selectedRecord.id}`,
        { method: "DELETE", lang }
      );

      if (!response.ok) return;

      closeModal();
      refreshProducts(true);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

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
    [
      handleEdit,
      openDeleteModal,
      products_table.actions.delete,
      products_table.actions.edit,
      products_table.headers.actions,
      products_table.headers.cost_price,
      products_table.headers.description,
      products_table.headers.image,
      products_table.headers.name,
      products_table.headers.reorder_point,
      products_table.headers.sale_price,
      products_table.headers.sku,
      products_table.headers.stock,
      products_table.headers.tax,
      products_table.headers.unit,
    ]
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
        itemName={selectedRecord?.name || ""}
        translation={translation}
      />

      <CreateProductForm
        lang={lang}
        translation={translation}
      />
    </>
  );
}