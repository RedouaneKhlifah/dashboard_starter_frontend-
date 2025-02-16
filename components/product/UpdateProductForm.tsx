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
import useToast from "@/hooks/useToast";
import productMappers from "@/mappers/ProductMapper";

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
  const { error: toastError, success: toastSuccess } = useToast(); 
  const { mapProductToFormData } = productMappers;
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
      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/products/${selectedRecord?.id}`,
        {
          method: "POST",
          lang,
          body: mapProductToFormData(data),
        }
      );

      if (response.ok) {
        toastSuccess(translation.Product.message.update_success);
        return true;
      } else {
        const error = await response.json();
        toastError(error.message || translation.Product.message.error);
        return false;
      }
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
