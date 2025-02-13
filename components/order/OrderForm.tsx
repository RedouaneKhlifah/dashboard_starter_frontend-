"use client";
import { Dispatch, SetStateAction, useState, useEffect, useMemo } from "react";
import GlobalModal from "@/components/shared/GlobalModal";
import InputField from "@/components/ui/InputField";
import { DictionaryType } from "@/lib/i18n";
import { handleChange, hasNoErrors } from "@/components/utils/formHandlers";
import { OrderValidation } from "@/validation";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";
import { IOrderForm, IProduct } from "@/dto/order/orderForm";
import { OrderFormErrors } from "@/validation/orderValidators/orderValidator";
import { Fingerprint, UserSearch, Receipt, Calculator, FileText, ShoppingCart } from "lucide-react";
import { GlobalTable } from "@/components/shared/GlobalTable";
import CreateProduct from "./createProduct";
import { Button } from "@material-tailwind/react";
import http from "@/lib/http";

interface OrderFormProps {
  initialFormData: IOrderForm;
  translation: DictionaryType;
  errors: OrderFormErrors;
  setErrors: Dispatch<SetStateAction<OrderFormErrors>>;
  onSubmit: (formData: IOrderForm) => Promise<boolean>;
  isOpen: boolean;
}

type TabName = 'client' | 'products' | 'summary' | 'notes';

interface Tab {
  name: TabName;
  index: number;
}

const tabs: Tab[] = [
  { name: 'client', index: 0 },
  { name: 'products', index: 1 },
  { name: 'summary', index: 2 },
  { name: 'notes', index: 3 },
];

const OrderForm = ({
  initialFormData,
  translation,
  errors,
  setErrors,
  onSubmit,
  isOpen,
}: OrderFormProps) => {
  const { modalType, closeModal, openModal, secondModalType } = useModalStore();
  const [formData, setFormData] = useState<IOrderForm>(initialFormData);
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const { validateOrderForm } = OrderValidation;

  const submitButtonText = useMemo(() => {
    return activeTab.name === 'notes'
      ? modalType === "create"
        ? translation.sidebar.orders_table.create_new_order
        : translation.sidebar.orders_table.update_order
      : translation.Order.common.continue;
  }, [activeTab.name, modalType, translation]);

  const calculateTotals = () => {
    const sous_total = formData.articles?.reduce((sum, product) =>
      sum + (product.unit_price * product.quantity), 0) || 0;

    const remiseAmount = formData.remise?.type === 'percentage'
      ? sous_total * (formData.remise.value / 100)
      : formData.remise?.value || 0;

    const sous_total_after_remise = sous_total - remiseAmount;
    const tva = sous_total_after_remise * 0.2;
    const total = sous_total_after_remise + tva;

    setFormData(prev => ({
      ...prev,
      subtotal: Number(sous_total.toFixed(2)),
      vat: Number(tva.toFixed(2)),
      total: Number(total.toFixed(2))
    }));
  };

  useEffect(() => {
    calculateTotals();
  }, [formData.articles]);

  const validateCurrentTab = (tabName: TabName): OrderFormErrors => {
    const newErrors: OrderFormErrors = {};

    switch (tabName) {
      case 'client':
        if (!formData.client?.trim()) newErrors.client = translation.Order.client_required;
        if (!formData.reference?.trim()) newErrors.reference = translation.Order.reference_required;
        if (!formData.devis_date) newErrors.devis_date = translation.Order.devis_date_required;
        if (!formData.expiration_date) newErrors.expiration_date = translation.Order.expiration_date_required;
        break;
      case 'products':
        if (!formData.articles?.length) {
          newErrors.articles = translation.Order.product_required;
        }
        break;
    }
    return newErrors;
  };

  const handleTabChange = (targetTab: Tab) => {
    if (targetTab.index > activeTab.index) {
      const currentTabErrors = validateCurrentTab(activeTab.name);
      setErrors(currentTabErrors);
      if (hasNoErrors(currentTabErrors)) {
        setActiveTab(targetTab);
      }
    } else {
      setActiveTab(targetTab);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab.name !== 'notes') {
      const nextTab = tabs.find(t => t.index === activeTab.index + 1);
      if (nextTab) handleTabChange(nextTab);
    } else {
      const newErrors = validateOrderForm(formData, translation);
      setErrors(newErrors);
      if (hasNoErrors(newErrors)) {
        const success = await onSubmit(formData);
        if (success) {
          closeModal();
          setFormData(initialFormData);
          setErrors({});
        }
      }
    }
  };

  const handleAddProducts = (selectedProducts: IProduct[]) => {
    const newArticles = selectedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      unit_price: product.costPrice,
      quantity: 1,
      total: product.costPrice,
      selected: true
    }));

    setFormData(prev => ({
      ...prev,
      articles: [...(prev.articles || []), ...newArticles],
    }));
    setIsAddingProduct(false);
  };

  function openSecondModal(CREATE: ModalTypeEnum): void {
    throw new Error("Function not implemented.");
  }

  return (
    <GlobalModal
      open={isOpen}
      onClose={() => {
        closeModal();
        setFormData(initialFormData);
        setErrors({});
      }}
      title={modalType === "create" ? translation.sidebar.orders_table.create_new_order : translation.sidebar.orders_table.update_order}
      submitButtonText={submitButtonText}
      cancelButtonText={translation.Order.common.cancel}
      onSubmit={handleSubmit}
      contentClassName="2xl:min-w-[60%]"
    >
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                  ${activeTab.name === tab.name
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
              >
                {tab.name === 'client' && <UserSearch className="w-4 h-4" />}
                {tab.name === 'products' && <ShoppingCart className="w-4 h-4" />}
                {tab.name === 'summary' && <Calculator className="w-4 h-4" />}
                {tab.name === 'notes' && <FileText className="w-4 h-4" />}
                {translation.Order.tabs[tab.name]}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg min-h-[300px]">
          {activeTab.name === 'client' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  id="client"
                  label={translation.Order.form.client}
                  value={formData.client}
                  onChange={(e) => handleChange(e, setFormData, setErrors)}
                  icon={<UserSearch className="w-5 h-5 text-gray-400" />}
                  error={errors.client}
                  required
                />
                <InputField
                  id="reference"
                  label={translation.Order.form.reference}
                  value={formData.reference}
                  onChange={(e) => handleChange(e, setFormData, setErrors)}
                  icon={<Fingerprint className="w-5 h-5 text-gray-400" />}
                  error={errors.reference}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  id="devis_date"
                  type="date"
                  label={translation.Order.form.devis_date}
                  value={formData.devis_date}
                  onChange={(e) => handleChange(e, setFormData, setErrors)}
                  error={errors.devis_date}
                  required
                />
                <InputField
                  id="expiration_date"
                  type="date"
                  label={translation.Order.form.expiration_date}
                  value={formData.expiration_date}
                  onChange={(e) => handleChange(e, setFormData, setErrors)}
                  error={errors.expiration_date}
                  required
                />
              </div>
            </div>
          )}

          {activeTab.name === 'products' && (
            <div className="space-y-4">
              <GlobalTable
                headers={[
                  { key: 'name', label: translation.Order.form.articles.name },
                  { key: 'unit_price', label: translation.Order.form.articles.unit_price },
                  { key: 'total', label: translation.Order.form.articles.total },
                  { key: 'quantity', label: translation.Order.form.articles.quantity },
                  {
                    key: 'action',
                    label: translation.Order.form.articles.actions,
                    renderCell: (value: boolean, row: any) => (
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => {
                          const updatedArticles = formData.articles?.map(article =>
                            article.id === row.id ? { ...article, selected: e.target.checked } : article
                          );
                          setFormData({ ...formData, articles: updatedArticles });
                        }}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    ),
                  },
                ]}
                rows={formData.articles || []}
                className="mt-4"
              />
              <Button
                onClick={() => openSecondModal(ModalTypeEnum.CREATE)}
                className="bg-black text-primary"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {translation.Order.form.add_article}
              </Button>

              <CreateProduct
                translation={translation}
                selectedProductIds={formData.articles?.map(a => a.id) || []}
                onSelect={handleAddProducts}
                isSecondOpen={secondModalType === "create"}
                
              // initialFormData={initialFormData}
              // onSubmit={onSubmit}
              />

            </div>
          )}

          {activeTab.name === 'summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  id="sous_total"
                  type="number"
                  label={translation.Order.form.subtotal}
                  value={formData.subtotal?.toString() || ""}
                  onChange={(e) => handleChange(e, setFormData, setErrors)}

                  disabled
                />
                <div className="space-y-2">
                  <label>{translation.Order.form.remise.type}</label>
                  <select
                    id="remise.type"
                    value={formData.remise?.type || 'percentage'}
                    onChange={(e) => handleChange(e, setFormData, setErrors)}
                  >
                    <option value="percentage">%</option>
                    <option value="fixed">{translation.Order.form.remise.fixed}</option>
                  </select>
                </div>
                <InputField
                  id="remise.value"
                  type="number"
                  label={translation.Order.form.remise.value}
                  value={formData.remise?.value?.toString() || "0"}
                  onChange={(e) => handleChange(e, setFormData, setErrors)}
                />
                <InputField
                  id="tva"
                  type="number"
                  label={translation.Order.form.vat}
                  value={formData.vat?.toString() || ""}
                  onChange={(e) => handleChange(e, setFormData, setErrors)}
                  disabled
                />
              </div>
              <InputField
                id="total"
                type="number"
                label={translation.Order.form.total}
                value={formData.total?.toString() || ""}
                onChange={(e) => handleChange(e, setFormData, setErrors)}
                disabled
              />
            </div>
          )}
          {activeTab.name === 'notes' && (
            <div className="space-y-4">
              <InputField
                id="note"
                label={translation.Order.form.note}
                value={formData.note}
                onChange={(e) => handleChange(e, setFormData, setErrors)}
                error={errors.note}
                textarea
                rows={4}
              />
            </div>
          )}
        </div>
      </div>
    </GlobalModal>
  );
};

export default OrderForm;