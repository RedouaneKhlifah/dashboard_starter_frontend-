import React, { useState } from 'react';
import Header from "../shared/Header";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { DictionaryType } from "@/lib/i18n";
import { IProduct } from "@/dto/order/orderForm";
import {
    Button,
} from "@material-tailwind/react";
import SearchInput from "@/components/ui/SearchInput";

interface CreateProductProps {
    translation: DictionaryType;
    selectedProductIds?: number[];
    onSelect: (products: IProduct[]) => void;
    onCancel: () => void;
}

const CreateProduct: React.FC<CreateProductProps> = ({
    translation,
    selectedProductIds,
    onSelect,
    onCancel,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [availableProducts, setAvailableProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');



    return (
        <div className="space-y-4">
            <SearchInput
                placeholder={translation.Order.form.product_search}
                setSearch={setSearchQuery}
                className="w-full"
            />

            {error && (
                <div className="text-red-500 text-sm mb-4">{error}</div>
            )}

            <div className="space-y-4">

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
                            renderCell: (value: boolean, row: any) => (
                                <input
                                    type="checkbox"
                                    checked={value}
                                    // onChange={(e) => {
                                    // }}
                                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                            ),
                        },
                    ]}
                    rows={availableProducts.map(product => ({
                        ...product,
                        selected: (selectedProductIds ?? []).includes(product.id),
                    }))}
                    className="mt-4"
                />
            </div>
            <div className="flex justify-end gap-2 mt-4">
                <Button
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    onClick={onCancel}
                    className="mr-2 bg-gray-500 text-white"
                >
                    cancel
                </Button>
                <Button
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    // onClick={() => onSelect(selectedArticles)}
                    className="bg-blue-500 text-white"
                >
                    selected
                </Button>
            </div>
        </div>
    );
};

export default CreateProduct;