"use client";

import { useMemo, useState } from "react";

// Components
import ProductForm from "./ProductForm";

// Store
import useModalStore from "@/store/modalStore";

// Utilities & API
import http from "@/lib/http";

// Types
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { IProductForm } from "@/dto/product/productForm";
import { IProduct } from "@/interfaces/IProduct";
import { ProductFormErrors } from "@/validation/productValidators/ProductValidator";

interface UpdateProductFormProps {
  translation: DictionaryType;
  lang: Locale;
  selectedRecord?: IProduct;
  
}

const UpdateProductForm: React.FC<UpdateProductFormProps> = ({
  translation,
  lang,
  selectedRecord,
}) => {
  const { modalType } = useModalStore();
  const [errors, setErrors] = useState<ProductFormErrors>({});

  const initialFormData = useMemo<IProductForm>(
    () =>
      selectedRecord || {
        name: "",
        sku: "",
        unit: "",
        sale_price: 0,
        cost_price: 0,
        description: "",
        tax: 0,
        image: null,
        stock: 0,
        reorder_point: 0,
      },
    [selectedRecord]
  );

  const handleSubmit = async (data: IProductForm): Promise<boolean> => {
    try {
      const formData = new FormData();

      // Append product fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(
            key,
            value instanceof File ? value : value.toString()
          );
        }
      });

      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/products/${selectedRecord?.id}`,
        {
          method: "POST",
          lang,
          body: formData,
        }
      );

      if (!response.ok) {
        await response.json();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      return false;
    }
  };

  return (
    <ProductForm
      translation={translation}
      initialFormData={initialFormData}
      errors={errors}
      setErrors={setErrors}
      onSubmit={handleSubmit}
      isOpen={modalType === "update"}
    />
  );
};

export default UpdateProductForm;
