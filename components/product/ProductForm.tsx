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
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            {/* Required Fields */}
            <InputField
              id="name"
              label={translation.Product.form.name}
              value={formData.name}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.name}
              required
            />
            <InputField
              id="sku"
              label={translation.Product.form.sku}
              value={formData.sku || ""}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.sku}
            />
            <InputField
              id="unit"
              label={translation.Product.form.unit}
              value={formData.unit}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.unit}
              required
            />
            <InputField
              id="sale_price"
              label={translation.Product.form.sale_price}
              type="number"
              value={formData.sale_price.toString()}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.sale_price}
              required
            />
            <InputField
              id="stock"
              label={translation.Product.form.stock}
              type="number"
              value={formData.stock.toString()}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.stock}
              required
            />
            <InputField
              id="reorder_point"
              label={translation.Product.form.reorder_point}
              type="number"
              value={formData.reorder_point.toString()}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.reorder_point}
              required
            />

            {/* Optional Fields */}
            <InputField
              id="cost_price"
              label={translation.Product.form.cost_price}
              type="number"
              value={formData.cost_price?.toString() || ""}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.cost_price}
            />
            <InputField
              id="description"
              label={translation.Product.form.description}
              value={formData.description || ""}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.description}
              // textarea
            />
            <InputField
              id="tax"
              label={translation.Product.form.tax}
              type="number"
              value={formData.tax?.toString() || ""}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.tax}
            />
            <InputField
              id="image"
              label={translation.Product.form.image}
              value={formData.image || ""}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.image}
              type="url"
            />
          </div>
        </div>
      </GlobalModal>
    </div>
  );
};

export default ProductForm;
