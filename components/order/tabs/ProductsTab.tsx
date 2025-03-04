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
import { orderFormErrors } from "@/validation/orderValidators/orderValidator";

interface ProductsTabProps {
  formData: IOrderForm;
  setFormData: Dispatch<SetStateAction<IOrderForm>>;
  translation: DictionaryType;
  errors: orderFormErrors;
  setErrors: Dispatch<SetStateAction<orderFormErrors>>;
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
  setErrors,
}: ProductsTabProps) => {
  const { openSecondModal, secondModalType } = useModalStore();
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
        ...(prev.products || []),
        ...newProducts.filter(
          (np) => !prev.products?.some((p) => p.product_id === np.product_id)
        ),
      ],
    }));
    setErrors({});
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
          const newQuantity = Math.max(1, value);
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
          const newPrice = Math.max(0, value);
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
      {errors.products ? (
        <div className="flex items-center gap-2 text-sm">
          <MailWarning className="text-primary" />
          <span className="text-primary">{errors.products}</span>
        </div>
      ) : (
        ""
      )}
      <GlobalTable
        headers={[
          {
            key: "name",
            label: translation.order.form.articles.name,
          },
          {
            key: "unit",
            label: translation.order.form.articles.unit,
          },
          {
            key: "price_unitaire",
            label: translation.order.form.articles.unit_price,
            renderCell: (value: number, row: any) => (
              <InputField
                type="number"
                value={value}
                onChange={(e) =>
                  handlePriceChange(row.product_id, parseFloat(e.target.value))
                }
                className="max-w-20 px-1"
                min={0}
                id={"price_unitaire"}
                label={""}
              />
            ),
          },
          {
            key: "quantity",
            label: translation.order.form.articles.quantity,
            renderCell: (value: number, row: any) => (
              <InputField
                type="number"
                onChange={(e) => handleQuantityChange(e, row.product_id)}
                className="max-w-20"
                min={1}
                id={"quantity"}
                label={""}
                value={value}
                disabled={!!row.ticket_id}
              />
            ),
          },
          {
            key: "total",
            label: translation.order.form.articles.total,
            renderCell: (_value: number, row: any) => (
              <span className="font-medium">
                {(row.quantity * row.price_unitaire).toFixed(2)}
              </span>
            ),
          },
          {
            key: "action",
            label: translation.order.form.articles.actions,
            renderCell: (value: any, row: any) => (
              <button
                onClick={(e) => handleRemoveProduct(e, row.product_id)}
                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                {translation.order.form.articles.remove}
              </button>
            ),
          },
        ]}
        rows={formData.products || []}
        className="mt-4 max-h-60 z-10"
        totalRows={0}
        setCurrentPage={() => { }}
        currentPage={0}
      />
      <div className="flex justify-between items-center border-t-2 border-dashed border-gray-200">
        <div className="flex justify-center items-center mt-2">
          <button
            type="button"
            onClick={() => openSecondModal(ModalTypeEnum.CREATE)}
            className="px-3.5 py-2 text-sm font-medium bg-blue-300 text-white  hover:bg-blue-400 rounded-md transition-colors shadow-sm hover:shadow-md"
          >
            {translation.order.form.add_article}
          </button>
        </div>
        {(formData.products || []).length > 0 && (
          <div className=" pt-3">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-3">
                <div className="flex flex-col justify-center items-center gap-1 border-r-2 border-dashed border-gray-200 h-full px-2">
                  <span className="text-gray-500">
                    {translation.order.form.Total_Items}
                  </span>
                  <span className="text-xl font-semibold text-gray-700">
                    {formData.products.length}
                  </span>
                </div>
                <div className="flex flex-col justify-center items-center gap-1">
                  <span className="text-gray-600">
                    {translation.order.form.Total_Amount}
                  </span>
                  <span className="text-xl font-semibold text-gray-900">
                    $
                    {formData.products
                      .reduce(
                        (sum, product) =>
                          sum + product.quantity * product.price_unitaire,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
              </div>
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
