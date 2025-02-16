// OrderForm.tsx
"use client";
import { Dispatch, SetStateAction, useState, useMemo } from "react";
import { UserSearch, ShoppingCart, Calculator, FileText } from "lucide-react";
import GlobalModal from "@/components/shared/GlobalModal";
import { DictionaryType } from "@/lib/i18n";
import { hasNoErrors } from "@/components/utils/formHandlers";
import { OrderValidation } from "@/validation";
import useModalStore from "@/store/modalStore";
import { IOrderForm } from "@/dto/order/orderForm";
import { OrderFormErrors } from "@/validation/orderValidators/orderValidator";
import { ClientTab, ProductsTab, SummaryTab, NotesTab } from "./tabs";
import { IDevis } from "@/interfaces/IDevis";

export type TabName = "client" | "products" | "summary" | "notes";

interface Tab {
  name: TabName;
  index: number;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { name: "client", index: 0, icon: <UserSearch className="w-4 h-4" /> },
  { name: "products", index: 1, icon: <ShoppingCart className="w-4 h-4" /> },
  { name: "summary", index: 2, icon: <Calculator className="w-4 h-4" /> },
  { name: "notes", index: 3, icon: <FileText className="w-4 h-4" /> },
];

interface OrderFormProps {
  initialFormData: IOrderForm;
  translation: DictionaryType;
  errors: OrderFormErrors;
  setErrors: Dispatch<SetStateAction<OrderFormErrors>>;
  onSubmit: (formData: IOrderForm) => Promise<boolean>;
  isOpen: boolean;
  selectedRecord?: IDevis | undefined;
}

const OrderForm = ({
  initialFormData,
  translation,
  errors,
  setErrors,
  onSubmit,
  isOpen,
  selectedRecord
}: OrderFormProps) => {
  const { modalType, closeModal, isSecondOpen } = useModalStore();
  const [formData, setFormData] = useState<IOrderForm>(initialFormData);
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitButtonText = useMemo(() => {
    return activeTab.name === "notes"
      ? modalType === "create"
        ? translation.sidebar.orders_table.create_new_order
        : translation.sidebar.orders_table.update_order
      : translation.Order.common.continue;
  }, [activeTab.name, modalType, translation]);
  const validateCurrentTab = (tabName: TabName): OrderFormErrors => {
    const newErrors: OrderFormErrors = {};

    switch (tabName) {
      case "client":
        if (!formData.reference?.trim())
          newErrors.reference = translation.Order.reference_required;
        if (!formData.devis_date)
          newErrors.devis_date = translation.Order.devis_date_required;
        if (!formData.expiration_date)
          newErrors.expiration_date = translation.Order.expiration_date_required;
        break;
      case "products":
        if (!formData.products || formData.products.length === 0) {
          newErrors.products = translation.Order.product_required;
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
    if (activeTab.name !== "notes") {
      const nextTab = tabs.find((t) => t.index === activeTab.index + 1);
      if (nextTab) handleTabChange(nextTab);
    } else {
      const newErrors = OrderValidation.validateOrderForm(
        formData,
        translation
      );
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
    }
  };

  const hasTabError = (tabName: TabName): boolean => {
    switch (tabName) {
      case "client":
        return !!errors.reference || !!errors.devis_date || !!errors.expiration_date;
      case "products":
        return !!errors.products;
      case "notes":
        return !!errors.note;
      default:
        return false;
    }
  };

  return (
    <GlobalModal
      open={isOpen}
      onClose={() => {
        closeModal();
        setFormData(initialFormData);
        setActiveTab(tabs[0]);
        setErrors({});
      }}
      title={
        modalType === "create"
          ? translation.sidebar.orders_table.create_new_order
          : translation.sidebar.orders_table.update_order
      }
      isLoading={isSubmitting}
      submitButtonText={submitButtonText}
      cancelButtonText={translation.Order.common.cancel}
      onSubmit={handleSubmit}
      contentClassName="2xl:min-w-[60%]"
      dismiss={!isSecondOpen}
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
                    ? hasTabError(tab.name)
                      ? "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
                      : "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
              >
                {tab.icon}
                {translation.Order.tabs[tab.name]}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg min-h-[300px]">
          {activeTab.name === "client" && (
            <ClientTab
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              translation={translation}
              selectedRecord={selectedRecord}
            />
          )}
          {activeTab.name === "products" && (
            <ProductsTab
              formData={formData}
              setFormData={setFormData}
              translation={translation}
              errors={errors}
              setErrors={setErrors}
            />
          )}
          {activeTab.name === "summary" && (
            <SummaryTab
              formData={formData}
              setFormData={setFormData}
              setErrors={setErrors}
              translation={translation}
            />
          )}
          {activeTab.name === "notes" && (
            <NotesTab
              formData={formData}
              setFormData={setFormData}
              errors={errors}
              setErrors={setErrors}
              translation={translation}
            />
          )}
        </div>
      </div>
    </GlobalModal>
  );
};

export default OrderForm;
