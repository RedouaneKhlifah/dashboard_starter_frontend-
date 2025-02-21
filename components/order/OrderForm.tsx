"use client";
import { Dispatch, SetStateAction, useState, useMemo, useEffect } from "react";
import { UserSearch, ShoppingCart, Calculator, FileText } from "lucide-react";
import GlobalModal from "@/components/shared/GlobalModal";
import useModalStore from "@/store/modalStore";
import { hasNoErrors } from "@/components/utils/formHandlers";
import { orderValidation } from "@/validation";
import { IOrderForm } from "@/dto/order/orderForm";
import { orderFormErrors } from "@/validation/orderValidators/orderValidator";
import { ClientTab, ProductsTab, SummaryTab, NotesTab } from "./tabs";
import { IOrder } from "@/interfaces/IOrder";
import { DictionaryType } from "@/lib/i18n";

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

interface orderFormProps {
  initialFormData: IOrderForm;
  translation: DictionaryType;
  errors: orderFormErrors;
  setErrors: Dispatch<SetStateAction<orderFormErrors>>;
  onSubmit: (formData: IOrderForm) => Promise<boolean>;
  isOpen: boolean;
  selectedRecord?: IOrder;
}

const OrderForm = ({
  initialFormData,
  translation,
  errors,
  setErrors,
  onSubmit,
  isOpen,
  selectedRecord,
}: orderFormProps) => {
  const { modalType, closeModal, isSecondOpen } = useModalStore();
  const [formData, setFormData] = useState<IOrderForm>(initialFormData);
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const submitButtonText = useMemo(
    () =>
      activeTab.name === "notes"
        ? modalType === "create"
          ? translation.sidebar.orders_table.create_new_order
          : translation.sidebar.orders_table.update_order
        : translation.order.common.continue,
    [activeTab.name, modalType, translation]
  );

  const validateTab = (tabName: TabName): orderFormErrors => {
    const newErrors: orderFormErrors = {};

    if (tabName === "client") {
      if (!formData.reference?.trim())
        newErrors.reference = translation.order.reference_required;
      if (!formData.order_date)
        newErrors.order_date = translation.order.order_date_required;
      if (!formData.expiration_date)
        newErrors.expiration_date = translation.order.expiration_date_required;
      if (!formData.client?.title)
        newErrors.client = translation.order.client_required;
    } else if (tabName === "products") {
      if (!formData.products || formData.products.length === 0)
        newErrors.products = translation.order.product_required;
    }

    return newErrors;
  };

  const handleTabChange = (targetTab: Tab) => {
    if (targetTab.index > activeTab.index + 1) return; // Prevent skipping tabs

    if (targetTab.index > activeTab.index) {
      const currentTabErrors = validateTab(activeTab.name);
      setErrors(currentTabErrors);

      if (hasNoErrors(currentTabErrors)) setActiveTab(targetTab);
    } else {
      setActiveTab(targetTab);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("for ma data ggggggggggggggggggg", formData);

    if (activeTab.name !== "notes") {
      const nextTab = tabs.find((t) => t.index === activeTab.index + 1);
      if (nextTab) handleTabChange(nextTab);
      return;
    }

    const newErrors = orderValidation.validateorderForm(formData, translation);
    setErrors(newErrors);

    if (hasNoErrors(newErrors)) {
      setIsSubmitting(true);
      try {
        const success = await onSubmit(formData);
        if (success) {
          closeModal();
          resetForm();
        }
      } catch (error) {
        console.error("Submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setActiveTab(tabs[0]);
    setErrors({});
  };

  const hasTabError = (tabName: TabName): boolean => {
    return (
      (tabName === "client" &&
        (!!errors.reference ||
          !!errors.order_date ||
          !!errors.expiration_date)) ||
      (tabName === "products" && !!errors.products) ||
      (tabName === "notes" && !!errors.note)
    );
  };

  return (
    <GlobalModal
      open={isOpen}
      onClose={() => {
        closeModal();
        resetForm();
      }}
      title={
        modalType === "create"
          ? translation.sidebar.orders_table.create_new_order
          : translation.sidebar.orders_table.update_order
      }
      isLoading={isSubmitting}
      submitButtonText={submitButtonText}
      cancelButtonText={translation.order.common.cancel}
      onSubmit={handleSubmit}
      contentClassName="2xl:min-w-[60%]"
      dismiss={!isSecondOpen}
    >
      <div className="space-y-6">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors
                 ${
                   activeTab.name === tab.name
                     ? hasTabError(tab.name)
                       ? "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
                       : "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
                     : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                 }`}
              >
                {tab.icon}
                {translation.order.tabs[tab.name]}
              </button>
            ))}
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg min-h-[300px]">
          {activeTab.name === "client" && (
            <ClientTab
              {...{
                formData,
                setFormData,
                errors,
                setErrors,
                translation,
                selectedRecord,
              }}
            />
          )}
          {activeTab.name === "products" && (
            <ProductsTab
              {...{ formData, setFormData, translation, errors, setErrors }}
            />
          )}
          {activeTab.name === "summary" && (
            <SummaryTab
              {...{ formData, setFormData, setErrors, translation }}
            />
          )}
          {activeTab.name === "notes" && (
            <NotesTab
              {...{ formData, setFormData, errors, setErrors, translation }}
            />
          )}
        </div>
      </div>
    </GlobalModal>
  );
};

export default OrderForm;
