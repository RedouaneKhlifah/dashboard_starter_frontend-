"use client";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import GlobalModal from "@/components/shared/GlobalModal";
import InputField from "@/components/ui/InputField";
import { DictionaryType } from "@/lib/i18n";
import { handleChange, hasNoErrors } from "@/components/utils/formHandlers";
import { TicketValidation } from "@/validation";
import useModalStore from "@/store/modalStore";
import { ITicketForm } from "@/dto/ticket/ticketForm";
import { TicketFormErrors } from "@/validation/ticketValidators/TicketValidator";
import { Group, Tag, BarChart, Package, UserSearch, Image as ImageIcon, Info, PackageSearch, ScanSearch } from "lucide-react";
import RadioGroup from "@/components/ui/RadioGroup";
import { SearchAutocomplete } from "@/components/ui/SearchAutocomplete"


interface TicketFormProps {
  initialFormData: ITicketForm;
  translation: DictionaryType;
  errors: TicketFormErrors;
  setErrors: Dispatch<SetStateAction<TicketFormErrors>>;
  onSubmit: (formData: ITicketForm) => Promise<boolean>;
  isOpen: boolean;
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
  const [activeTab, setActiveTab] = useState<'info' | 'details'>('details');
  const { validateTiecketForm } = TicketValidation;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateTiecketForm(formData, translation);
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

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);


  const fetchClients = async (query: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/clients?search=${query}&page=1`
    );
    return response.json();
  };
  const fetchProducts = async (query: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/products?search=${query}&page=1`
    );
    return response.json();
  };
  const fetchPartainres = async (query: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/partenaires?search=${query}&page=1`
    );
    return response.json();
  };


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
        submitButtonText={
          modalType === "create"
            ? translation.client.common.create
            : translation.client.common.update
        }
        cancelButtonText={translation.client.common.cancel}
        onSubmit={handleSubmit}
      // contentClassName="max-w-3xl"
      >
        <div className="space-y-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'details'
                  ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
              >
                {translation.Ticket.tabs.ticket_details}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('info')}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'info'
                  ? 'text-green-600 bg-green-50 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
              >
                {translation.Ticket.tabs.client_info}
              </button>
            </div>
          </div>

          {activeTab === 'info' && (
            <div className="bg-green-50 p-4 rounded-lg dark:bg-green-900/20">
              <div className="grid grid-cols-1 gap-2">
                <div>

                  <SearchAutocomplete
                    id="matricule"
                    label={translation.Ticket.form.matricule}
                    onSearch={fetchPartainres}
                    placeholder={translation.Ticket.form.matricule_search}
                    icon={<ScanSearch className="w-5 h-5 text-gray-400" />}
                    error={errors.matricule}
                    required
                  />
                </div>
                <div>
                  <SearchAutocomplete
                    id="product"
                    label={translation.Ticket.form.product}
                    onSearch={fetchProducts}
                    value={formData.product_id}
                    onChange={(productId: any) => handleChange({
                      target: {
                        id: 'product_id',
                        value: productId
                      }
                    } as React.ChangeEvent<HTMLInputElement>, setFormData, setErrors)}
                    placeholder={translation.Ticket.form.product_search}
                    icon={<PackageSearch className="w-5 h-5 text-gray-400" />}
                    error={errors.product_id}
                    required

                  />
                </div>
                {formData.status === 'ENTRY' && (
                  <div>
                    <SearchAutocomplete
                      id="client"
                      label={translation.Ticket.form.client}
                      onSearch={fetchClients}
                      value={formData.client_id}
                      onChange={(clientId: any) => handleChange({
                        target: {
                          id: 'client_id',
                          value: clientId
                        }
                      } as React.ChangeEvent<HTMLInputElement>, setFormData, setErrors)}
                      placeholder={translation.Ticket.form.client_search}
                      icon={<UserSearch className="w-5 h-5 text-gray-400" />}
                      error={errors.client_id}
                      required

                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'details' && (
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
                    onChange={(value) => handleChange(
                      {
                        target: {
                          id: 'status',
                          value: value
                        }
                      } as React.ChangeEvent<HTMLInputElement>,
                      setFormData,
                      setErrors
                    )}
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
        </div>
      </GlobalModal>
    </div>
  );
};

export default TicketForm;