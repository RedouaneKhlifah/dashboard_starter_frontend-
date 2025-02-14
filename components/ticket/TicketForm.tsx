"use client";

// React Core Imports
import { Dispatch, SetStateAction, useState, useEffect, useMemo } from "react";

// Third-Party Library Imports (Icons)
import {
  BarChart,
  Info,
  UserSearch,
  PackageSearch,
  ScanSearch,
} from "lucide-react";

// UI Component Imports
import GlobalModal from "@/components/shared/GlobalModal";
import InputField from "@/components/ui/InputField";
import RadioGroup from "@/components/ui/RadioGroup";
import SearchAutocomplete from "@/components/ui/SearchAutocomplete";

// Domain-Specific and Utility Imports
import { DictionaryType } from "@/lib/i18n";
import { handleChange, hasNoErrors } from "@/components/utils/formHandlers";
import { TicketValidation } from "@/validation";
import useModalStore from "@/store/modalStore";
import { ITicketForm } from "@/dto/ticket/ticketForm";
import {
  IValidateTiecketForm,
  TicketFormErrors,
} from "@/validation/ticketValidators/TicketValidator";
import http from "@/lib/http";
import AutoCompleteMappers from "@/mappers/AutocCompleteMapper";

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
}

const tabs: Tab[] = [
  { name: "ticket-details", index: 0 },
  { name: "final", index: 1 },
];

const TicketForm = ({
  initialFormData,
  translation,
  errors,
  setErrors,
  onSubmit,
  isOpen,
}: TicketFormProps) => {
  // Modal state and form data
  const { modalType, closeModal } = useModalStore();
  const [formData, setFormData] = useState<ITicketForm>(initialFormData);
  const [activeTab, setActiveTab] = useState<Tab>(tabs[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions and autocomplete mappers
  const { validateTiecketDetails, validateTiecketForm } = TicketValidation;
  const {
    clientAutoCompleteMapper,
    partenaireAutoCompleteMapper,
    productAutoCompleteMapper,
  } = AutoCompleteMappers;

  // Determine submit button text based on current tab and modal type
  const submitButtonText = useMemo(() => {
    if (isSubmitting && activeTab.name === "final") {
      return modalType === "create" 
        ? translation.Ticket.common.creating 
        : translation.Ticket.common.updating;
    }
    if (activeTab.name !== "final") {
      return translation.Ticket.common.continue;
    }
    return modalType === "create"
      ? translation.Ticket.common.create
      : translation.Ticket.common.update;
  }, [activeTab, modalType, isSubmitting, translation]);
  // Handle tab change with validation when moving forward
  const handleTabChange = (targetTab: Tab) => {
    if (targetTab.index > activeTab.index) {
      const newErrors = validateTiecketDetails(formData, translation);
      setErrors(newErrors);
      if (hasNoErrors(newErrors)) {
        setActiveTab(targetTab);
      }
    } else {
      setActiveTab(targetTab);
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (activeTab.name !== "final") {
      const nextTab = tabs[activeTab.index + 1];
      handleTabChange(nextTab);
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

  // Reset form data when initialFormData changes
  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  // Autocomplete fetch functions
  const fetchClients = async (query: string) => {
    const response = await http(
      `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/clients?search=${query}&page=1`
    );
    const data = await response.json();
    return clientAutoCompleteMapper(data.data);
  };

  const fetchProducts = async (query: string) => {
    const response = await http(
      `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/products?search=${query}&page=1`
    );
    const data = await response.json();
    return productAutoCompleteMapper(data.data);
  };

  const fetchPartenaires = async (query: string) => {
    const response = await http(
      `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/partenaires?search=${query}&page=1`
    );
    const data = await response.json();
    return partenaireAutoCompleteMapper(data.data);
  };

  return (
    <GlobalModal
      open={isOpen}
      onClose={() => {
        closeModal();
        setActiveTab(tabs[0]);
        setFormData(initialFormData);
        setErrors({});
      }}
      isLoading={isSubmitting}
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
          </div>
        </div>

        {/* Ticket Details Tab */}
        {activeTab.name === "ticket-details" && (
          <div className="bg-blue-50 p-4 rounded-lg dark:bg-blue-900/20">
            <InputField
              id="number_prints"
              type="number"
              label={translation.Ticket.form.number_prints}
              icon={<BarChart className="w-5 h-5 text-gray-400" />}
              value={formData.number_prints.toString()}
              onChange={(e) => handleChange(e, setFormData, setErrors)}
              error={errors.number_prints}
            />

            <div className="grid grid-cols-2 gap-4 mt-2">
              <InputField
                id="poids_brut"
                type="number"
                label={translation.Ticket.form.poids_brut}
                icon={<Info className="w-5 h-5 text-gray-400" />}
                value={formData.poids_brut.toString()}
                onChange={(e) => handleChange(e, setFormData, setErrors)}
                error={errors.poids_brut}
              />
              <InputField
                id="poids_tare"
                type="number"
                label={translation.Ticket.form.poids_tare}
                icon={<Info className="w-5 h-5 text-gray-400" />}
                value={formData.poids_tare.toString()}
                onChange={(e) => handleChange(e, setFormData, setErrors)}
                error={errors.poids_tare}
              />
            </div>

            <div className="flex gap-4 mt-4">
              <RadioGroup
                name="status"
                label={translation.Ticket.form.status}
                onChange={(value) =>
                  handleChange(
                    {
                      target: { id: "status", value },
                    } as React.ChangeEvent<HTMLInputElement>,
                    setFormData,
                    setErrors
                  )
                }
                options={[
                  { value: "ENTRY", label: translation.Ticket.status.entry },
                  { value: "EXIT", label: translation.Ticket.status.exit },
                ]}
                selectedValue={formData.status}
                error={errors.status}
                required
                orientation="horizontal"
              />
            </div>
          </div>
        )}

        {/* Final Tab */}
        {activeTab.name === "final" && (
          <div className="bg-green-50 p-4 rounded-lg dark:bg-green-900/20">
            <div className="grid grid-cols-1 gap-2">
              <SearchAutocomplete
                id="matricule"
                label={translation.Ticket.form.matricule}
                onSearch={fetchPartenaires}
                onChange={(partenaire) =>
                  setFormData((prev) => ({ ...prev, partenaire }))
                }
                placeholder={translation.Ticket.form.matricule_search}
                icon={<ScanSearch className="w-5 h-5 text-gray-400" />}
                error={errors.partenaire}
                required
                value={formData.partenaire}
              />
              <SearchAutocomplete
                id="product"
                label={translation.Ticket.form.product}
                onSearch={fetchProducts}
                value={formData.product}
                onChange={(product) =>
                  setFormData((prev) => ({ ...prev, product }))
                }
                placeholder={translation.Ticket.form.product_search}
                icon={<PackageSearch className="w-5 h-5 text-gray-400" />}
                error={errors.product}
                required
              />
              {formData.status === "EXIT" && (
                <SearchAutocomplete
                  id="client"
                  label={translation.Ticket.form.client}
                  onSearch={fetchClients}
                  value={formData.client}
                  onChange={(client) =>
                    setFormData((prev) => ({ ...prev, client }))
                  }
                  placeholder={translation.Ticket.form.client_search}
                  icon={<UserSearch className="w-5 h-5 text-gray-400" />}
                  error={errors.client}
                  required
                />
              )}
            </div>
          </div>
        )}
      </div>
    </GlobalModal>
  );
};

export default TicketForm;
