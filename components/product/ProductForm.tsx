"use client";

import { useState, useEffect, Dispatch, SetStateAction, useMemo } from "react";

// Components
import GlobalModal from "@/components/shared/GlobalModal";
import InputField from "@/components/ui/InputField";
import ImageUpload from "@/components/shared/ImageUpload";

// Store
import useModalStore from "@/store/modalStore";

// Utilities & Validation
import {
  handleChange,
  handleSelect,
  hasNoErrors,
} from "@/components/utils/formHandlers";
import { ProductValidation } from "@/validation";

// Types
import { DictionaryType } from "@/lib/i18n";
import { IProductForm } from "@/dto/product/productForm";
import { ProductFormErrors } from "@/validation/productValidators/ProductValidator";

// Icons
import { Group, Tag, BarChart, Package, Info } from "lucide-react";
import SelectInput from "../ui/SelectInput";

interface ProductFormProps {
  initialFormData: IProductForm;
  translation: DictionaryType;
  errors: ProductFormErrors;
  setErrors: Dispatch<SetStateAction<ProductFormErrors>>;
  onSubmit: (formData: IProductForm) => Promise<boolean>;
  isOpen: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialFormData,
  translation,
  errors,
  setErrors,
  onSubmit,
  isOpen,
}) => {
  const { modalType, closeModal } = useModalStore();
  const [formData, setFormData] = useState<IProductForm>(initialFormData);
  const { validateProductForm } = ProductValidation;
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateProductForm(formData, translation);
    setErrors(newErrors);

    if (hasNoErrors(newErrors)) {
      setIsSubmitting(true);
      try {
        const success = await onSubmit(formData);
        if (success) {
          closeModal();
          setFormData(initialFormData);
          setErrors({});
        }
      } catch (error) {
        console.error("Submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  const handleClose = () => {
    closeModal();
    setFormData(initialFormData);
    setErrors({});
  };

  return (
    <GlobalModal
      open={isOpen}
      onClose={handleClose}
      isLoading={isSubmitting}
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
      onSubmit={handleSubmit}
      contentClassName="2xl:min-w-[55%] 2xl:max-w-[55%]"
    >
      <div className="space-y-6">
        {/* Product Information Section */}
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
            />
            <InputField
              id="sku"
              label={translation.Product.form.sku}
              icon={<Info className="w-5 h-5 text-gray-400" />}
              value={formData.sku}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.sku}
            />
            <div>
              <SelectInput
                options={[
                  { value: "kg", label: "Kilogram" },
                  { value: "g", label: "Gram" },
                  { value: "l", label: "Liter" },
                  { value: "ml", label: "Milliliter" },
                  { value: "unit", label: "Unit" },
                ]}
                id="unit"
                label={translation.Product.form.unit}
                value={formData.unit}
                onChange={(e) => {}}
                onSelect={(option) =>
                  handleSelect(option, "unit", setFormData, setErrors)
                }
                error={errors.unit}
              />
            </div>
            <InputField
              id="description"
              label={translation.Product.form.description}
              value={formData.description}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.description}
              textarea
              rows={4}
            />
          </div>
        </div>

        {/* Pricing & Inventory Section */}
        <div className="bg-green-50 p-4 rounded-lg dark:bg-green-900/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputField
              id="sale_price"
              label={translation.Product.form.sale_price}
              type="number"
              value={formData.sale_price}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.sale_price}
              required
              prefix="DH"
              min={0}
            />
            <InputField
              id="cost_price"
              label={translation.Product.form.cost_price}
              type="number"
              value={formData.cost_price}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.cost_price}
              prefix="DH"
              min={0}
            />
            <InputField
              id="tax"
              label={translation.Product.form.tax}
              type="number"
              icon={<BarChart className="w-5 h-5 text-gray-400" />}
              value={formData.tax}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.tax}
              suffix="%"
              min={0}
            />
            <InputField
              id="stock"
              label={translation.Product.form.stock}
              type="number"
              icon={<Package className="w-5 h-5 text-gray-400" />}
              value={formData.stock}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.stock}
              required
              min={0}
            />
            <InputField
              id="reorder_point"
              label={translation.Product.form.reorder_point}
              type="number"
              icon={<Package className="w-5 h-5 text-gray-400" />}
              value={formData.reorder_point}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.reorder_point}
              required
            />
          </div>
        </div>

        {/* Image Upload Section */}
        {/* <div className="bg-purple-50 p-4 rounded-lg dark:bg-purple-900/20">
          <ImageUpload
            onFileChange={(file) =>
              setFormData({ ...formData, image: file[0] || null })
            }
            maxFiles={1}
            maxSize={10 * 1024 * 1024}
            acceptedTypes={["image/jpeg", "image/png"]}
            label={translation.sidebar.file_upload.label}
            className="p-6"
            existingImages={
              formData.image && typeof formData.image === "string"
                ? [formData.image]
                : null
            }
          />
        </div> */}
      </div>
    </GlobalModal>
  );
};

export default ProductForm;
