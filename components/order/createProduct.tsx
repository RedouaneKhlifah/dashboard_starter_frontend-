import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import SearchInput from "@/components/ui/SearchInput";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { DictionaryType } from "@/lib/i18n";
import { IProduct } from "@/interfaces/IProduct";
import http from "@/lib/http";
import GlobalModal from "../shared/GlobalModal";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";

interface CreateProductProps {
  translation: DictionaryType;
  selectedProductIds?: number[];
  onSelect: (products: IProduct[]) => void;
  isSecondOpen: boolean;
}

const CreateProduct: React.FC<CreateProductProps> = ({
  translation,
  selectedProductIds = [],
  onSelect,
  isSecondOpen,
}) => {
  const { secondModalType, closeSecondModal, openModal } = useModalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [availableProducts, setAvailableProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set(selectedProductIds)
  );

  

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      try {
        setLoading(true);
        const url = `${
          process.env.NEXT_PUBLIC_API_BASE_PATH
        }/api/products?search=${encodeURIComponent(query)}&page=1`;
        const response = await http(url);
        
        if (!response.ok) throw new Error(translation.common.errors.fetch_error);
        
        const data = await response.json();
        setAvailableProducts(data.data || []);
        setError("");
      } catch (err) {
        setError(translation.common.errors.fetch_error);
      } finally {
        setLoading(false);
      }
    }, 500),
    [translation]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
    return () => debouncedSearch.cancel();
  }, [searchQuery, debouncedSearch]);

  const toggleSelection = useCallback((productId: number) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      newSet.has(productId) ? newSet.delete(productId) : newSet.add(productId);
      return newSet;
    });
  }, []);

  const handleSelect = useCallback(() => {
    const selected = availableProducts.filter((product) =>
      selectedProducts.has(product.id)
    );
    onSelect(selected); 
    closeSecondModal();
  }, [availableProducts, selectedProducts, onSelect, closeSecondModal]);

  return (
    <GlobalModal
      open={isSecondOpen}
      onClose={closeSecondModal}
      title={secondModalType === "create" ? translation.Order.select_products : ""}
      submitButtonText={translation.common.select}
      cancelButtonText={translation.common.cancel}
      onSubmit={handleSelect}
      contentClassName="2xl:min-w-[60%]"
      backdrop={false}
      dismiss={false}
    >
      <div className="space-y-4">
        <SearchInput
          placeholder={translation.Order.form.product_search}
          setSearch={setSearchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
          aria-label={translation.Order.form.product_search}
        />

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {loading ? (
          <div className="text-gray-500 text-center py-4">
            {translation.common.loading}
          </div>
        ) : (
          <GlobalTable
            headers={[
              {
                key: "image",
                label: translation.Order.form.articles.image,
                isImage: true,
              },
              {
                key: "name",
                label: translation.Order.form.articles.name,
              },
              {
                key: "unit",
                label: translation.Order.form.articles.unit,
              },
              {
                key: "selected",
                label: translation.Order.form.articles.select,
                renderCell: (_, row: IProduct) => (
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(row.id)}
                    onChange={() => toggleSelection(row.id)}
                    className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                    aria-label={`Select ${row.name}`}
                  />
                ),
              },
            ]}
            rows={availableProducts}
            className="mt-4"
            emptyMessage={translation.common.no_results}
          />
        )}
      </div>
    </GlobalModal>
  );
};

export default React.memo(CreateProduct);