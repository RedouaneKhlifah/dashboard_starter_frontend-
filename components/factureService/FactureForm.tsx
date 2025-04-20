"use client";
import { Dispatch, SetStateAction, useState, useMemo, useEffect } from "react";
import { UserSearch, ShoppingCart, Calculator, FileText } from "lucide-react";
import GlobalModal from "@/components/shared/GlobalModal";
import useModalStore from "@/store/modalStore";
import { hasNoErrors } from "@/components/utils/formHandlers";
import { FactureServiceValidation } from "@/validation";
import { IFactureForm } from "@/dto/facture/factureForm";
import { FactureFormErrors } from "@/validation/factureValidators/factureValidator";
import { ClientTab, ServiceTab, SummaryTab, NotesTab } from "./tabs";
import { IFacture } from "@/interfaces/IFacture";
import { DictionaryType } from "@/lib/i18n";
import { Locale } from "@/i18n-config";

export type TabName = "client" | "services" | "summary" | "notes";

interface Tab {
  name: TabName;
  index: number;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  { name: "client", index: 0, icon: <UserSearch className="w-4 h-4" /> },
  { name: "services", index: 1, icon: <ShoppingCart className="w-4 h-4" /> },
  { name: "summary", index: 2, icon: <Calculator className="w-4 h-4" /> },
  { name: "notes", index: 3, icon: <FileText className="w-4 h-4" /> },
];

interface FactureFormProps {
  initialFormData: IFactureForm;
  translation: DictionaryType;
  errors: FactureFormErrors;
  setErrors: Dispatch<SetStateAction<FactureFormErrors>>;
  onSubmit: (formData: IFactureForm) => Promise<boolean>;
  isOpen: boolean;
  selectedRecord?: IFacture;
  lang?: Locale;
}

const FactureForm = ({
  initialFormData,
  translation,
  errors,
  setErrors,
  onSubmit,
  isOpen,
  selectedRecord,
  lang,
}: FactureFormProps) => {
  const { modalType, closeModal, isSecondOpen } = useModalStore();
  const [formData, setFormData] = useState<IFactureForm>(initialFormData);
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const submitButtonText = useMemo(
    () =>
      activeTab.name === "notes"
        ? modalType === "create"
          ? translation.sidebar.factures_table.create_new_invoice
          : translation.sidebar.factures_table.update_invoice
        : translation.order.common.continue,
    [activeTab.name, modalType, translation]
  );

  const validateTab = (tabName: TabName): FactureFormErrors => {
    const newErrors: FactureFormErrors = {};

    if (tabName === "client") {
      if (!formData.reference?.trim())
        newErrors.reference = translation.order.reference_required;
      if (!formData.facture_date)
        newErrors.facture_date = translation.order.order_date_required;
      if (!formData.expiration_date)
        newErrors.expiration_date = translation.order.expiration_date_required;
      if (!formData.client?.title)
        newErrors.client = translation.order.client_required;
    } else if (tabName === "services") {
      if (!formData.services || formData.services.length === 0)
        newErrors.services = translation.order.service_required;
    }

    return newErrors;
  };

  const handleTabChange = (targetTab: Tab) => {
    if (targetTab.index <= activeTab.index) {
      setActiveTab(targetTab);
      return;
    }

    const currentTabErrors = validateTab(activeTab.name);
    setErrors(currentTabErrors);

    if (hasNoErrors(currentTabErrors)) {
      setActiveTab(targetTab);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab.name !== "notes") {
      const nextTab = tabs.find((t) => t.index === activeTab.index + 1);
      if (nextTab) handleTabChange(nextTab);
      return;
    }

    const newErrors = FactureServiceValidation.validateFactureServiceForm(
      formData,
      translation
    );
    setErrors(newErrors);

    console.log("Form data:", formData);
    console.log("services", formData.services);
    console.log("Form errors:", newErrors);

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
          !!errors.facture_date ||
          !!errors.expiration_date)) ||
      (tabName === "services" && !!errors.products) ||
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
          ? translation.sidebar.factures_table.create_new_invoice
          : translation.sidebar.factures_table.update_invoice
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
          {activeTab.name === "services" && (
            <ServiceTab
              {...{ formData, setFormData, translation, errors, setErrors }}
            />
          )}
          {activeTab.name === "summary" && (
            <SummaryTab
              {...{ formData, setFormData, setErrors, translation, lang }}
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

export default FactureForm;
