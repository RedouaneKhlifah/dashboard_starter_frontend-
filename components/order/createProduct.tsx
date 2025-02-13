import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from "@material-tailwind/react";
import { debounce } from 'lodash';
import SearchInput from "@/components/ui/SearchInput";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { DictionaryType } from "@/lib/i18n";
import { IOrderForm, IProduct } from "@/dto/order/orderForm";
import http from "@/lib/http";


interface CreateProductProps {
    translation: DictionaryType;
    selectedProductIds?: number[];
    onSelect: (products: IProduct[]) => void;
}

const CreateProduct: React.FC<CreateProductProps> = ({
    translation,
    selectedProductIds = [],
    onSelect,
}) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [availableProducts, setAvailableProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
        new Set(selectedProductIds)
    );

    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            try {
                setLoading(true);
                const response = await http(
                    `/api/products?search=${query}&page=1`
                );
                const data = await response.json();
                setAvailableProducts(data.data || []);
            } catch (err) {
                setError(translation.common.errors.fetch_error);
            } finally {
                setLoading(false);
            }
        }, 500),
        [translation]
    );

    const mockProducts: IProduct[] = [
        {
            id: 1,
            name: "Premium Coffee Beans",
            image: "/images/coffee-beans.jpg",
            unit: "kg",
            quantity: 50,
            costPrice: 12.99,
            selected: false,
            total: 0
        },
        {
            id: 2,
            name: "Organic Honey",
            image: "/images/honey.jpg",
            unit: "bottle",
            quantity: 100,
            costPrice: 8.50,
            selected: false,
            total: 0
        },
    ];

    useEffect(() => {
        if (searchQuery.trim()) {
            debouncedSearch(searchQuery);
        } else {
            setAvailableProducts(mockProducts);
        }

        return () => debouncedSearch.cancel();
    }, [searchQuery, debouncedSearch]);

    const toggleSelection = useCallback((productId: number) => {
        setSelectedProducts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) {
                newSet.delete(productId);
            } else {
                newSet.add(productId);
            }
            return newSet;
        });
    }, []);



    return (
        <div className="space-y-4 bg-accent p-3 rounded-sm w-full">
            <SearchInput
                placeholder={translation.Order.form.product_search}
                setSearch={setSearchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                aria-label={translation.Order.form.product_search}
            />

            {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
            )}

            {loading ? (
                <div className="text-gray-500 text-center py-4">
                    {translation.common.loading}
                </div>
            ) : (
                <GlobalTable
                    headers={[
                        {
                            key: 'image',
                            label: translation.Order.form.articles.image,
                            isImage: true,
                        },
                        {
                            key: 'name',
                            label: translation.Order.form.articles.name,
                        },
                        {
                            key: 'unit',
                            label: translation.Order.form.articles.unit,
                        },
                        {
                            key: 'quantity',
                            label: translation.Order.form.articles.quantity,
                        },
                        {
                            key: 'selected',
                            label: translation.Order.form.articles.select,
                            renderCell: (value: boolean, row: IProduct) => (
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
                    rows={availableProducts.length ? availableProducts : mockProducts}
                    className="mt-4"
                    emptyMessage={translation.common.no_results}
                />
            )}
        </div>
    );
};

export default React.memo(CreateProduct);