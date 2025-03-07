// CreateProduct.tsx
import React, {
  useState,
  useEffect,
  useCallback,
  FormEvent,
  useMemo,
} from "react";
import { debounce } from "lodash";
import SearchInput from "@/components/ui/SearchInput";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { DictionaryType } from "@/lib/i18n";
import { IProduct } from "@/interfaces/IProduct";
import http from "@/lib/http";
import GlobalModal from "../shared/GlobalModal";
import useModalStore from "@/store/modalStore";

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
  const { closeSecondModal } = useModalStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [availableProducts, setAvailableProducts] = useState<IProduct[]>([]);
  const [selectedProductsData, setSelectedProductsData] = useState<IProduct[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set(selectedProductIds)
  );

  

  useEffect(() => {
    const fetchSelectedProducts = async () => {
      setLoading(true);
      if (!isSecondOpen || selectedProductIds.length === 0) return;

      try {
        const promises = selectedProductIds.map(async (id) => {
          const response = await http(
            `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/factures/${id}`
          );
          if (!response.ok) throw new Error();
          return response.json();
        });

        const products = await Promise.all(promises);
        setSelectedProductsData(products);
      } catch (err) {
        setError(translation.common.errors.fetch_error);
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedProducts();
  }, [isSecondOpen, selectedProductIds, translation]);

  useEffect(() => {
    if (isSecondOpen) {
      setSelectedProducts(new Set(selectedProductIds));
    }
  }, [isSecondOpen, selectedProductIds]);

  useEffect(() => {
    const debouncedSearch = debounce(async (query: string) => {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_BASE_PATH
          }/api/products?search=${encodeURIComponent(query)}&page=1`;
        const response = await http(url);

        if (!response.ok)
          throw new Error(translation.common.errors.fetch_error);

        const data = await response.json();
        setAvailableProducts(data.data || []);
        setError("");
      } catch (err) {
        setError(translation.common.errors.fetch_error);
      } finally {
        setLoading(false);
      }
    }, 500);

    if (isSecondOpen) {
      debouncedSearch(searchQuery);
    }
    return () => debouncedSearch.cancel();
  }, [searchQuery, translation, isSecondOpen]);

  const displayedProducts = useMemo(() => {
    const productsMap = new Map<number, IProduct>();

    availableProducts.forEach((product) => {
      productsMap.set(product.id, product);
    });

    selectedProductsData.forEach((product) => {
      if (!productsMap.has(product.id)) {
        productsMap.set(product.id, product);
      }
    });

    return Array.from(productsMap.values());
  }, [availableProducts, selectedProductsData]);

  const toggleSelection = useCallback(
    (productId: number, product: IProduct) => {
      setSelectedProducts((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(productId)) {
          newSet.delete(productId);
        } else {
          newSet.add(productId);
          setSelectedProductsData((prevData) => {
            if (!prevData.some((p) => p.id === productId)) {
              return [...prevData, product];
            }
            return prevData;
          });
        }
        return newSet;
      });
    },
    []
  );

  const handleSelect = useCallback(
    (e: FormEvent<Element>) => {
      e.preventDefault();
      e.stopPropagation();

      const selected = displayedProducts.filter((product: { id: number }) =>
        selectedProducts.has(product.id)
      );

      onSelect(selected);
      closeSecondModal();
      setSearchQuery("");
      setSelectedProducts(new Set());
      setSelectedProductsData([]);
    },
    [displayedProducts, selectedProducts, onSelect, closeSecondModal]
  );

  const handleClose = useCallback(() => {
    closeSecondModal();
    setSearchQuery("");
    setSelectedProducts(new Set(selectedProductIds));
    setSelectedProductsData([]);
  }, [closeSecondModal, selectedProductIds]);

  return (
    <GlobalModal
      open={isSecondOpen}
      onClose={handleClose}
      title={translation.order.select_products}
      submitButtonText={translation.common.select}
      cancelButtonText={translation.common.cancel}
      onSubmit={handleSelect}
      contentClassName="2xl:min-w-[50%]"
      backdrop={false}
      dismiss={false}
    >
      <div className="space-y-4">
        <SearchInput
          placeholder={translation.order.form.product_search}
          value={searchQuery}
          className="w-full"
          aria-label={translation.order.form.product_search}
          setSearch={setSearchQuery}
        />

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <GlobalTable<IProduct>
          headers={[
            {
              key: "name",
              label: translation.order.form.articles.name,
            },
            {
              key: "unit",
              renderCell(value, row) {
                return `${value}`;
              },
              label: translation.order.form.articles.unit,
            },
            {
              key: "selected" as keyof IProduct,
              label: translation.order.form.articles.select,
              renderCell: (_, row: IProduct) => (
                <input
                  type="checkbox"
                  id={`select-${row.id}`}
                  checked={selectedProducts.has(row.id)}
                  onChange={() => toggleSelection(row.id, row)}
                  className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                  aria-label={`Select ${row.name}`}
                />
              ),
            },
          ]}
          rows={displayedProducts}
          className="mt-4 max-h-60"
          classHead="z-10"
          totalRows={0}
          setCurrentPage={() => { }}
          currentPage={0}
          isLoading={loading}
        />
      </div>
    </GlobalModal>
  );
};

export default React.memo(CreateProduct);
