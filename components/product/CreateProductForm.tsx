"use client";

import { useMemo, useState } from "react";

// Components
import ProductForm from "./ProductForm";

// Store
import useModalStore from "@/store/modalStore";

// Utilities & API
import http from "@/lib/http";
import useToast from "@/hooks/useToast";


// Types
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";
import { ICreateProduct } from "@/dto/product/createProduct";
import { IProductForm } from "@/dto/product/productForm";
import { ProductFormErrors } from "@/validation/productValidators/ProductValidator";

interface CreateProductFormProps {
  translation: DictionaryType;
  lang: Locale;
}

const CreateProductForm: React.FC<CreateProductFormProps> = ({
  translation,
  lang,
}) => {
  const { modalType } = useModalStore();
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const { error: toastError, success: toastSuccess } = useToast(); 
  const initialFormData = useMemo<ICreateProduct>(
    () => ({
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
    }),
    []
  );

  const handleSubmit = async (data: IProductForm): Promise<boolean> => {
    try {
      const formData = new FormData();

      // Append product fields dynamically
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(
            key,
            value instanceof File ? value : value.toString()
          );
        }
      });

      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/products`,
        {
          method: "POST",
          lang,
          body: formData,
        }
      );

      if (response.ok) {
        toastSuccess(translation.Product.message.success);
        return true;
      } else {
        const error = await response.json();
        toastError(error.message || translation.Product.message.error);
        return false;
      }
    } catch (error) {
      console.error("Error during product creation:", error);
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
      isOpen={modalType === "create"}
    />
  );
};

export default CreateProductForm;
