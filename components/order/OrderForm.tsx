"use client";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import GlobalModal from "@/components/shared/GlobalModal";
import InputField from "@/components/ui/InputField";
import { DictionaryType } from "@/lib/i18n";
import { handleChange, hasNoErrors } from "@/components/utils/formHandlers";
import { OrderValidation } from "@/validation";
import useModalStore from "@/store/modalStore";
import { IOrderForm } from "@/dto/order/orderForm";
import { OrderFormErrors } from "@/validation/orderValidators/orderValidator";
import { Fingerprint, UserSearch, Receipt, Calculator, FileText, Plus, ShoppingCart } from "lucide-react";
import { SearchAutocomplete } from "@/components/ui/SearchAutocomplete";
import { GlobalTable } from "@/components/shared/GlobalTable";
import {
  Button,
} from "@material-tailwind/react";

interface OrderFormProps {
  initialFormData: IOrderForm;
  translation: DictionaryType;
  errors: OrderFormErrors;
  setErrors: Dispatch<SetStateAction<OrderFormErrors>>;
  onSubmit: (formData: IOrderForm) => Promise<boolean>;
  isOpen: boolean;
}

const OrderForm = ({
  initialFormData,
  translation,
  errors,
  setErrors,
  onSubmit,
  isOpen,
}: OrderFormProps) => {
  const { modalType, closeModal } = useModalStore();
  const [formData, setFormData] = useState<IOrderForm>(initialFormData);
  const [activeTab, setActiveTab] = useState<'client' | 'products' | 'summary' | 'notes'>('client');

  const { validateOrderForm } = OrderValidation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
  };

  const fetchClients = async (query: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/clients?search=${query}&page=1`
    );
    return response.json();
  };

  const tabs = [
    { id: 'client', label: translation.Order.tabs.client_info, icon: <UserSearch className="w-4 h-4" /> },
    { id: 'products', label: translation.Order.tabs.articles, icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'summary', label: translation.Order.tabs.summary, icon: <Calculator className="w-4 h-4" /> },
    { id: 'notes', label: translation.Order.tabs.notes, icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <GlobalModal
      open={isOpen}
      onClose={() => {
        closeModal();
        setFormData(initialFormData);
        setErrors({});
      }}
      title={modalType === "create" ? translation.sidebar.orders_table.create_new_order : translation.sidebar.orders_table.update_order}
      submitButtonText={modalType === "create" ? translation.client.common.create : translation.client.common.update}
      cancelButtonText={translation.client.common.cancel}
      onSubmit={handleSubmit}
      contentClassName="2xl:min-w-[60%]"
    >
      <div className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                  ${activeTab === tab.id
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
          {activeTab === 'client' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <SearchAutocomplete
                  id="client"
                  label={translation.Order.form.client}
                  onSearch={fetchClients}
                  value={formData.client}
                  onChange={(clientId) => handleChange({
                    target: { id: 'client_id', value: clientId }
                  } as any, setFormData, setErrors)}
                  placeholder={translation.Order.form.client_search}
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
                  // icon={<Fingerprint className="w-5 h-5 text-gray-400" />}
                  value={formData.devis_date}
                  onChange={(e) => handleChange(e, setFormData, setErrors)}
                  error={errors.devis_date}
                  required
                />
                <InputField
                  id="expiration_date"
                  type="date"
                  label={translation.Order.form.expiration_date}
                  // icon={<Fingerprint className="w-5 h-5 text-gray-400" />}
                  value={formData.expiration_date}
                  onChange={(e) => handleChange(e, setFormData, setErrors)}
                  error={errors.expiration_date}
                  required
                />
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-4">
              <GlobalTable
                headers={[
                  {
                    key: 'name',
                    label: translation.Order.form.articles.name,
                  },
                  {
                    key: 'unit_price',
                    label: translation.Order.form.articles.unit_price,
                  },
                  {
                    key: 'total',
                    label: translation.Order.form.articles.total,
                  },
                  {
                    key: 'quantity',
                    label: translation.Order.form.articles.quantity,
                  },
                  {
                    key: 'action',
                    label: translation.Order.form.articles.actions,
                    renderCell: (value: boolean, row: any) => (
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => {
                          const updatedArticles = formData.articles?.map(article => {
                            if (article.id === row.id) {
                              return { ...article, selected: e.target.checked };
                            }
                            return article;
                          });
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
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                type="submit"
                className="flex items-center gap-2 bg-black text-primary"
              >
                <Plus className="w-5 h-5" />
                {translation.Order.form.add_article}
              </Button>
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  id="subtotal"
                  type="number"
                  label={translation.Order.form.subtotal}
                  onChange={(e) => handleChange(e, setFormData, setErrors)}
                  value={formData.subtotal}
                  // disabled
                  icon={<Calculator className="w-5 h-5 text-gray-400" />}
                />
                <InputField
                  id="vat"
                  type="number"
                  label={translation.Order.form.vat}
                  value={formData.vat}
                  onChange={(e) => handleChange(e, setFormData, setErrors)}
                  error={errors.vat}
                  icon={<Receipt className="w-5 h-5 text-gray-400" />}
                />
              </div>
              <InputField
                id="total"
                type="number"
                label={translation.Order.form.total}
                value={formData.client}
                onChange={(e) => handleChange(e, setFormData, setErrors)}
                // disabled
                icon={<Calculator className="w-5 h-5 text-gray-400" />}
              />
            </div>
          )}

          {activeTab === 'notes' && (
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