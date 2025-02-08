"use client";
import { DictionaryType } from "@/lib/i18n";
import ProductForm from "./ProductForm";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import useModalStore from "@/store/modalStore";
import { Locale } from "@/i18n-config";
import { IProductForm } from "@/dto/product/productForm";
import { IProduct } from "@/interfaces/IProduct";
import { log } from "console";

interface PartenaireFormProps {
  translation: DictionaryType;
  lang: Locale;
  selectedRecord: IProduct | undefined;
}

const UpdateProductForm: React.FC<PartenaireFormProps> = ({
  translation,
  lang,
  selectedRecord,
}) => {
  const { modalType } = useModalStore();

  const [errors, setErrors] = useState<Partial<IProductForm>>({});
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
        image: "",
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
          method: "PATCH",
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
      console.error("Error during product updating:", error);
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
      isOpen={modalType == "update"}
    />
  );
};

export default UpdateProductForm;