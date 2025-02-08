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
  const { rowMapper } = productMappers;
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


  const productRows = useMemo(() => rowMapper(products), [rowMapper, products]);


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
        headers={[
          { key: "name", label: products_table.headers.name },
          { key: "sku", label: products_table.headers.sku },
          { key: "unit", label: products_table.headers.unit },
          { key: "sale_price", label: products_table.headers.sale_price },
          { key: "cost_price", label: products_table.headers.cost_price },
          { key: "tax", label: products_table.headers.tax },
          { key: "stock", label: products_table.headers.stock },
          {
            key: "id",
            label: products_table.headers.actions,
            renderCell: (_, row) => (
              <ActionButtons
                Id={row.id}
                onEdit={handleEdit}
                onDelete={openDeleteModal}
                editText={products_table.actions.edit}
                deleteText={products_table.actions.delete}
              />
            ),
          },
        ]}
        rows={productRows}
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