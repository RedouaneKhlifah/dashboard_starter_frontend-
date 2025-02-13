"use client";
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  use,
  useMemo,
} from "react";
import GlobalModal from "@/components/shared/GlobalModal";
import InputField from "@/components/ui/InputField";
import { DictionaryType } from "@/lib/i18n";
import { handleChange, hasNoErrors } from "@/components/utils/formHandlers";
import { TicketValidation } from "@/validation";
import useModalStore from "@/store/modalStore";
import { ITicketForm } from "@/dto/ticket/ticketForm";
import { TicketFormErrors } from "@/validation/ticketValidators/TicketValidator";
import {
  Group,
  Tag,
  BarChart,
  Package,
  UserSearch,
  Image as ImageIcon,
  Info,
  PackageSearch,
  ScanSearch,
} from "lucide-react";
import RadioGroup from "@/components/ui/RadioGroup";
import SearchAutocomplete from "@/components/ui/SearchAutocomplete";
import http from "@/lib/http";
import AutoCompleteMappers from "@/mappers/AutocCompleteMapper";
import { set } from "lodash";

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
  const { modalType, closeModal } = useModalStore();
  const [formData, setFormData] = useState<ITicketForm>(initialFormData);

  const {
    clientAutoCompleteMapper,
    partenaireAutoCompleteMapper,
    productAutoCompleteMapper,
  } = AutoCompleteMappers;

  const [activeTab, setActiveTab] = useState<Tab>({
    name: "ticket-details",
    index: 0,
  });

  const { validateTiecketDetails } = TicketValidation;
  const submitButtonText = useMemo(() => {
    return activeTab.name === "final"
      ? modalType === "create"
        ? translation.Ticket.common.create
        : translation.Ticket.common.update
      : "contune";
  }, [
    modalType,
    activeTab,
    translation.Ticket.common.create,
    translation.Ticket.common.update,
  ]);

  const handleTabChange = (targetTab: Tab) => {
    if (targetTab.index > activeTab.index) {
      // Validate current tab before proceeding
      const newErrors = validateTiecketDetails(formData, translation);
      setErrors(newErrors);
      if (hasNoErrors(newErrors)) {
        setActiveTab(targetTab);
      }
    } else {
      // Allow free navigation back without validation
      setActiveTab(targetTab);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab.name !== "final") {
      // Move to next tab with validation
      const nextTab = tabs[activeTab.index + 1];
      handleTabChange(nextTab);
      return;
    }

    if (hasNoErrors(errors)) {
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

  const fetchClients = async (query: string) => {
    const response = await http(
      `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/clients?search=${query}&page=1`
    );
    const res = await response.json();
    return clientAutoCompleteMapper(res.data);
  };
  const fetchProducts = async (query: string) => {
    const response = await http(
      `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/products?search=${query}&page=1`
    );
    const res = await response.json();
    return productAutoCompleteMapper(res.data);
  };
  const fetchPartainres = async (query: string) => {
    const response = await http(
      `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/partenaires?search=${query}&page=1`
    );
    const res = await response.json();
    return partenaireAutoCompleteMapper(res.data);
  };

  useEffect(() => {
    console.log("formData    ffff", formData);
  }, [formData]);

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
            ? translation.sidebar.ticket_table.create_new_ticket
            : translation.sidebar.ticket_table.update_ticket
        }
        submitButtonText={submitButtonText}
        cancelButtonText={translation.Ticket.common.cancel}
        onSubmit={handleSubmit}
        contentClassName="2xl:min-w-[45%] 2xl:max-w-[45%]"
      >
        <div className="space-y-6">
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
          {/* ticket details tab  */}
          {activeTab.name === "ticket-details" && (
            <div className="bg-blue-50 p-4 rounded-lg dark:bg-blue-900/20">
              <div className="">
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

                <div className="flex gap-4">
                  <RadioGroup
                    name="status"
                    label={translation.Ticket.form.status}
                    onChange={(value) =>
                      handleChange(
                        {
                          target: {
                            id: "status",
                            value: value,
                          },
                        } as React.ChangeEvent<HTMLInputElement>,
                        setFormData,
                        setErrors
                      )
                    }
                    options={[
                      {
                        value: "ENTRY",
                        label: translation.Ticket.status.entry,
                      },
                      {
                        value: "EXIT",
                        label: translation.Ticket.status.exit,
                      },
                    ]}
                    selectedValue={formData.status}
                    error={errors.status}
                    required
                    orientation="horizontal"
                    className="mt-4"
                  />
                </div>
              </div>
            </div>
          )}

          {/* final tab  */}
          {activeTab.name === "final" && (
            <div className="bg-green-50 p-4 rounded-lg dark:bg-green-900/20">
              <div className="grid grid-cols-1 gap-2">
                <div>
                  <SearchAutocomplete
                    id="matricule"
                    label={translation.Ticket.form.matricule}
                    onSearch={fetchPartainres}
                    onChange={(partenaire) => {
                      setFormData((prev) => ({ ...prev, partenaire }));
                    }}
                    placeholder={translation.Ticket.form.matricule_search}
                    icon={<ScanSearch className="w-5 h-5 text-gray-400" />}
                    error={errors.partenaire}
                    required
                    value={formData.partenaire}
                  />
                </div>
                <div>
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
                </div>
                {formData.status === "EXIT" && (
                  <div>
                    <SearchAutocomplete
                      id="client"
                      label={translation.Ticket.form.client}
                      onSearch={fetchClients}
                      value={formData.client}
                      onChange={(client) => {
                        setFormData((prev) => ({ ...prev, client }));
                      }}
                      placeholder={translation.Ticket.form.client_search}
                      icon={<UserSearch className="w-5 h-5 text-gray-400" />}
                      error={errors.client}
                      required
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </GlobalModal>
    </div>
  );
};

export default TicketForm;
