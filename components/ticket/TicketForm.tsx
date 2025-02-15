"use client";

import { Dispatch, SetStateAction, useState, useEffect, useMemo } from "react";
import { DictionaryType } from "@/lib/i18n";
import { ITicketForm } from "@/dto/ticket/ticketForm";
import {
  IValidateTiecketForm,
  TicketFormErrors,
} from "@/validation/ticketValidators/TicketValidator";
import GlobalModal from "@/components/shared/GlobalModal";
import { Condition } from "../utils";
import { hasNoErrors } from "@/components/utils/formHandlers";
import { TicketValidation } from "@/validation";
import useModalStore from "@/store/modalStore";
import { TicketDetailsTab, FinalTab } from "./tabs";

interface TicketFormProps {
  initialFormData: ITicketForm;
  translation: DictionaryType;
  errors: TicketFormErrors;
  setErrors: Dispatch<SetStateAction<TicketFormErrors>>;
  onSubmit: (formData: ITicketForm) => Promise<boolean>;
  isOpen: boolean;
}

type TabName = "ticket-details" | "final";

interface Tab {
  name: TabName;
  index: number;
  isVisible: boolean;
}

const TicketForm = ({
  initialFormData,
  translation,
  errors,
  setErrors,
  onSubmit,
  isOpen,
}: TicketFormProps) => {
  const { modalType, closeModal } = useModalStore();
  const [formData, setFormData] = useState<ITicketForm>(initialFormData);

  const tabs: Tab[] = useMemo(
    () => [
      { name: "ticket-details", index: 0, isVisible: true },
      { name: "final", index: 1, isVisible: modalType !== "update" },
    ],
    [modalType]
  );
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { validateTiecketDetails, validateTiecketForm } = TicketValidation;

  const submitButtonText = useMemo(() => {
    if (tabs[activeTab.index + 1]?.isVisible) return "Continue";
    return modalType === "create"
      ? translation.Ticket.common.create
      : translation.Ticket.common.update;
  }, [activeTab.index, modalType, tabs, translation.Ticket.common]);

  const handleTabChange = (targetTab: Tab) => {
    if (targetTab.index > activeTab.index) {
      const newErrors = validateTiecketDetails(formData, translation);
      setErrors(newErrors);
      if (hasNoErrors(newErrors)) setActiveTab(targetTab);
    } else {
      setActiveTab(targetTab);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tabs[activeTab.index + 1]?.isVisible) {
      handleTabChange(tabs[activeTab.index + 1]);
      return;
    }
    const formattedData: IValidateTiecketForm = {
      ...formData,
      partenaire: formData.partenaire?.title,
      product: formData.product?.title,
      client: formData.client?.title,
    };
  
    const newErrors = validateTiecketForm(formattedData, translation);
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

  const handleModalClose = () => {
    closeModal();
    setActiveTab(tabs[0]);
    setFormData(initialFormData);
    setErrors({});
  };

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  return (
    <GlobalModal
      open={isOpen}
      isLoading={isSubmitting}
      onClose={handleModalClose}
      title={
        modalType === "create"
          ? translation.sidebar.ticket_table.create_new_ticket
          : translation.sidebar.ticket_table.update_ticket
      }
      submitButtonText={submitButtonText}
      cancelButtonText={translation.Ticket.common.cancel}
      onSubmit={handleSubmit}
      contentClassName="2xl:min-w-[45%] 2xl:max-w-[45%]"
    >
      <div className="space-y-6">
        {/* Tabs Header */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTabChange(tabs[0])}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                activeTab.index === 0
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              }`}
            >
              {translation.Ticket.tabs.ticket_details}
            </button>
            <Condition
              if={tabs[1].isVisible}
              render={
                <button
                  type="button"
                  onClick={() => handleTabChange(tabs[1])}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                    activeTab.name === "final"
                      ? "text-green-600 bg-green-50 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  {translation.Ticket.tabs.client_info}
                </button>
              }
            />
          </div>
        </div>

        {/* Tab Content */}
        <Condition
          if={activeTab.name === "ticket-details"}
          render={
            <TicketDetailsTab
              formData={formData}
              setFormData={setFormData}
              translation={translation}
              errors={errors}
              setErrors={setErrors}
            />
          }
        />
        <Condition
          if={tabs[1].isVisible && activeTab.name === "final"}
          render={
            <FinalTab
              formData={formData}
              setFormData={setFormData}
              translation={translation}
              errors={errors}
            />
          }
        />
      </div>
    </GlobalModal>
  );
};

export default TicketForm;
