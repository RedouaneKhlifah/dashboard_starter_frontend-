import { Dispatch, SetStateAction } from "react";
import { Button } from "@material-tailwind/react";
import { GlobalTable } from "@/components/shared/GlobalTable";
import { IOrderForm } from "@/dto/order/orderForm";
import { DictionaryType } from "@/lib/i18n";
import { IProduct } from "@/interfaces/IProduct";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";
import CreateProduct from "../createProduct";
import { MailWarning, X } from "lucide-react";
import InputField from "@/components/ui/InputField";
import { handleChange } from "@/components/utils/formHandlers";
import { OrderFormErrors } from "@/validation/orderValidators/orderValidator";

interface ProductsTabProps {
  formData: IOrderForm;
  setFormData: Dispatch<SetStateAction<IOrderForm>>;
  translation: DictionaryType;
  errors: OrderFormErrors;
  setErrors: Dispatch<SetStateAction<OrderFormErrors>>;
}

interface ProductWithTotal extends IProduct {
  quantity: number;
  price_unitaire: number;
  total: number;
}

const ProductsTab = ({
  formData,
  setFormData,
  translation,
  errors,
  setErrors

}: ProductsTabProps) => {
  const { openSecondModal, secondModalType } = useModalStore();
  console.log("newErrors" ,errors)
  const handleAddProducts = (selectedProducts: IProduct[]) => {
    const newProducts = selectedProducts.map((product) => ({
      product_id: product.id,
      name: product.name,
      unit: product.unit,
      price_unitaire: product.cost_price,
      quantity: 1,
      total: product.cost_price * 1,
    }));

    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        ...newProducts.filter(
          (np) => !prev.products.some((p) => p.product_id === np.product_id)
        ),
      ],
   
    }));
    setErrors({})
  };

  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    productId: number
  ) => {
    const value = parseInt(e.target.value, 10);
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((product) => {
        if (product.product_id === productId) {
          const newQuantity = Math.max(1, value); // Ensure quantity is at least 1
          return {
            ...product,
            quantity: newQuantity,
            total: newQuantity * product.price_unitaire,
          };
        }
        return product;
      }),
    }));
  };

  const handlePriceChange = (productId: number, value: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((product) => {
        if (product.product_id === productId) {
          const newPrice = Math.max(0, value); // Ensure price is not negative
          return {
            ...product,
            price_unitaire: newPrice,
            total: product.quantity * newPrice,
          };
        }
        return product;
      }),
    }));
  };

  const handleRemoveProduct = (e: React.FormEvent, productId: number) => {
    e.preventDefault();
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter(
        (product) => product.product_id !== productId
      ),
    }));
  };

  return (
    <div className="space-y-4">
      {errors.products ? <div className="flex items-center gap-2 text-sm"><MailWarning className="text-primary"/><span className="text-primary">{errors.products}</span></div> : ''}
      <GlobalTable
        headers={[
          {
            key: "name",
            label: translation.Order.form.articles.name,
          },
          {
            key: "unit",
            label: translation.Order.form.articles.unit,
          },
          {
            key: "price_unitaire",
            label: translation.Order.form.articles.unit_price,
            renderCell: (value: number, row: any) => (
              <InputField
                type="number"
                value={value}
                onChange={(e) =>
                  handlePriceChange(row.product_id, parseFloat(e.target.value))
                }
                className="w-24"
                min={0}
                id={"price_unitaire"}
                label={""}
              />
            ),
          },
          {
            key: "quantity",
            label: translation.Order.form.articles.quantity,
            renderCell: (value: number, row: any) => (
              <InputField
                type="number"
                onChange={(e) => handleQuantityChange(e, row.product_id)}
                className="w-20"
                min={1}
                id={"quantity"}
                label={""}
                value={value}
              />
            ),
          },
          {
            key: "total",
            label: translation.Order.form.articles.total,
            renderCell: (_value: number, row: any) => (
              <span className="font-medium">
                {(row.quantity * row.price_unitaire).toFixed(2)}
              </span>
            ),
          },
          {
            key: "action",
            label: translation.Order.form.articles.actions,
            renderCell: (value: any, row: any) => (
              <button
                onClick={(e) => handleRemoveProduct(e, row.product_id)}
                className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </button>
            ),
          },
        ]}
        rows={formData.products || []}
        className="mt-4"
        totalRows={0}
        setCurrentPage={() => {}}
        currentPage={0}
      />
      <div className="flex justify-between items-center">
        <Button
          onClick={() => openSecondModal(ModalTypeEnum.CREATE)}
          className="bg-black text-primary"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          {translation.Order.form.add_article}
        </Button>
        {formData.products.length > 0 && (
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {"total_items"}
              {formData.products.length}
            </div>
            <div className="text-lg font-medium">
              {"total_amount"}:
              {formData.products
                .reduce(
                  (sum, product) =>
                    sum + product.quantity * product.price_unitaire,
                  0
                )
                .toFixed(2)}
            </div>
          </div>
        )}
      </div>
      <CreateProduct
        translation={translation}
        selectedProductIds={formData.products?.map((a) => a.product_id) || []}
        onSelect={handleAddProducts}
        isSecondOpen={secondModalType === "create"}
      />
    </div>
  );
};

export default ProductsTab;
