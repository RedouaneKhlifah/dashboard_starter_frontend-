"use client";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import GlobalModal from "@/components/shared/GlobalModal";
import InputField from "@/components/ui/InputField";
import { DictionaryType } from "@/lib/i18n";
import { handleChange, hasNoErrors } from "@/components/utils/formHandlers";
import { ProductValidation } from "@/validation";
import useModalStore from "@/store/modalStore";
import { IProductForm } from "@/dto/product/productForm";
import { ProductFormErrors } from "@/validation/productValidators/ProductValidator";
import {
  Group,
  Tag,
  BarChart,
  Package,
  Image as ImageIcon,
  Info,
} from "lucide-react";
import Image from "next/image";
import { ImageUpload } from "@/components/shared/ImageUpload";

interface ProductFormProps {
  initialFormData: IProductForm;
  translation: DictionaryType;
  errors: ProductFormErrors;
  setErrors: Dispatch<SetStateAction<ProductFormErrors>>;
  onSubmit: (formData: IProductForm) => Promise<boolean>;
  isOpen: boolean;
}

const ProductForm = ({
  initialFormData,
  translation,
  errors,
  setErrors,
  onSubmit,
  isOpen,
}: ProductFormProps) => {
  const { modalType, closeModal } = useModalStore();
  const [formData, setFormData] = useState<IProductForm>(initialFormData);
  const { validateProductForm } = ProductValidation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateProductForm(formData, translation);
    setErrors(newErrors);

    if (hasNoErrors(newErrors)) {
      const success = await onSubmit(formData);
      if (success) {
        closeModal();
        setFormData(initialFormData);
        setErrors({});
      }
    }
  };

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  return (
    <div>
      <GlobalModal
        open={isOpen}
        onClose={() => {
          closeModal();
          setFormData(initialFormData);
          setErrors({});
        }}
        title={
          modalType === "create"
            ? translation.sidebar.products_table.create_new_product
            : translation.sidebar.products_table.update_product
        }
        submitButtonText={
          modalType === "create"
            ? translation.client.common.create
            : translation.client.common.update
        }
        cancelButtonText={translation.client.common.cancel}
        contentClassName="2xl:min-w-[55%] 2xl:max-w-[55%]"
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg dark:bg-blue-900/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                id="name"
                label={translation.Product.form.name}
                icon={<Tag className="w-5 h-5 text-gray-400" />}
                value={formData.name}
                onChange={(e) => handleChange(e, setFormData, setErrors)}
                error={errors.name}
                required
                // placeholder={translation.Product.placeholders.name}
              />
              <InputField
                id="sku"
                label={translation.Product.form.sku}
                icon={<Info className="w-5 h-5 text-gray-400" />}
                value={formData.sku || ""}
                onChange={(e) => handleChange(e, setFormData, setErrors)}
                error={errors.sku}
                // placeholder={translation.Product.placeholders.sku}
              />
              <InputField
                id="unit"
                label={translation.Product.form.unit}
                icon={<Group className="w-5 h-5 text-gray-400" />}
                value={formData.unit}
                onChange={(e) => handleChange(e, setFormData, setErrors)}
                error={errors.unit}
                required
              />
              <InputField
                id="description"
                label={translation.Product.form.description}
                value={formData.description || ""}
                onChange={(e) => handleChange(e, setFormData, setErrors)}
                error={errors.description}
                textarea
                rows={4}
              />
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg dark:bg-green-900/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InputField
                id="sale_price"
                label={translation.Product.form.sale_price}
                type="number"
                value={formData.sale_price.toString()}
                onChange={(e) => handleChange(e, setFormData, setErrors)}
                error={errors.sale_price}
                required
                prefix="DH"
              />
              <InputField
                id="cost_price"
                label={translation.Product.form.cost_price}
                type="number"
                value={formData.cost_price?.toString() || ""}
                onChange={(e) => handleChange(e, setFormData, setErrors)}
                error={errors.cost_price}
                // step="0.01"
                prefix="DH"
              />
              <InputField
                id="tax"
                label={translation.Product.form.tax}
                type="number"
                icon={<BarChart className="w-5 h-5 text-gray-400" />}
                value={formData.tax?.toString() || ""}
                onChange={(e) => handleChange(e, setFormData, setErrors)}
                error={errors.tax}
                suffix="%"
              />
              <InputField
                id="stock"
                label={translation.Product.form.stock}
                type="number"
                icon={<Package className="w-5 h-5 text-gray-400" />}
                value={formData.stock.toString()}
                onChange={(e) => handleChange(e, setFormData, setErrors)}
                error={errors.stock}
                required
              />
              <InputField
                id="reorder_point"
                label={translation.Product.form.reorder_point}
                type="number"
                icon={<Package className="w-5 h-5 text-gray-400" />}
                value={formData.reorder_point.toString()}
                onChange={(e) => handleChange(e, setFormData, setErrors)}
                error={errors.reorder_point}
                required
              />
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg dark:bg-purple-900/20">
            <ImageUpload
              onFileChange={(files: any) => console.log(files)}
              maxFiles={1}
              maxSize={10 * 1024 * 1024}
              acceptedTypes={["image/jpeg", "image/png"]}
              allowMultiple
              label={translation.sidebar.file_upload.label}
              className="p-6"
            />
          </div>

          {/* Required Fields Note */}
          {/* <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span className="text-red-500">*</span>
            {translation.Product.form.required_fields_note}
          </p> */}
        </div>
      </GlobalModal>
    </div>
  );
};

export default ProductForm;
