"use client";
import { DictionaryType } from "@/lib/i18n";
import ProductForm from "./ProductForm";
import { useMemo, useState } from "react";
import http from "@/lib/http";
import useModalStore from "@/store/modalStore";
import { Locale } from "@/i18n-config";
import { IProductForm } from "@/dto/product/productForm";
import { IProduct } from "@/interfaces/IProduct";
import { ProductFormErrors } from "@/validation/productValidators/ProductValidator";
import { log } from "console";
import { urlToFile } from "@/lib/utils";

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

      // Append all fields to formData
      formData.append("name", data.name);
      formData.append("sku", data.sku);
      formData.append("unit", data.unit);
      formData.append("sale_price", data.sale_price.toString());
      formData.append("cost_price", data.cost_price.toString());
      formData.append("description", data.description || "");
      formData.append("tax", data.tax.toString());
      formData.append("stock", data.stock.toString());
      formData.append("reorder_point", data.reorder_point.toString());

      console.log("file", data.image);
      console.log("file type", typeof data.image);

      // Append image if exists
      if (data.image) {
        let file: File | null = null;

        if (data.image instanceof File) {
          file = data.image;
        } else if (typeof data.image === "string") {
          file = await urlToFile(data.image, "image.png");
        }

        if (file instanceof File) {
          formData.append("image[]", file);
        }
      }

      console.log("formData", formData.get("image[]"));

      const response = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/products/${selectedRecord?.id}`,
        {
          method: "POST",
          lang,
          body: formData,
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
