"use client";
import { DictionaryType } from "@/lib/i18n";
import ProductForm from "./ProductForm";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import { Locale } from "@/i18n-config";
import useModalStore from "@/store/modalStore";
import { ICreateProduct } from "@/dto/product/createProduct";
import { ProductFormErrors } from "@/validation/productValidators/ProductValidator";

interface ProductFormProps {
  translation: DictionaryType;
  lang: Locale;
}

const CreateProductFormPropsForm: React.FC<ProductFormProps> = ({
  translation,
  lang,
}) => {
  const { modalType } = useModalStore();

  const [errors, setErrors] = useState<ProductFormErrors>({});
  const initialFormData = useMemo<ICreateProduct>(
    () => ({
      name: "",
      sku: "",
      unit: "",
      sale_price: 0,
      cost_price: 0,
      description: "",
      tax: 0,
      image: "",
      stock: 0,
      reorder_point: 0,
    }),
    []
  );

  const handleSubmit = async (data: ICreateProduct): Promise<boolean> => {
    try {
      const response = await http(
        process.env.NEXT_PUBLIC_API_BASE_PATH + "/api/products",
        {
          method: "POST",
          lang,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();

        return false;
      }
      return true;
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
      isOpen={modalType == "create"}
    />
  );
};

export default CreateProductFormPropsForm;
