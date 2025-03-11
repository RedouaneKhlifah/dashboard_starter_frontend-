import { UserSearch, PackageSearch, ScanSearch } from "lucide-react";
import { DictionaryType } from "@/lib/i18n";
import { ITicketForm } from "@/dto/ticket/ticketForm";
import { TicketFormErrors } from "@/validation/ticketValidators/TicketValidator";
import SearchAutocomplete from "@/components/ui/SearchAutocomplete";
import http from "@/lib/http";
import AutoCompleteMappers from "@/mappers/AutocCompleteMapper";
import useModalStore, { ModalTypeEnum } from "@/store/modalStore";

interface FinalTabProps {
  formData: ITicketForm;
  setFormData: React.Dispatch<React.SetStateAction<ITicketForm>>;
  translation: DictionaryType;
  errors: TicketFormErrors;
}

const API_ENDPOINTS = {
  clients: `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/clients`,
  products: `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/products`,
  partenaires: `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/partenaires`,
};

const fetchAutocompleteData = async (endpoint: string, query: string) => {
  const response = await http(`${endpoint}?search=${query}&page=1&unit=kg`);
  return response.json();
};

const FinalTab = ({
  formData,
  setFormData,
  translation,
  errors,
}: FinalTabProps) => {
  const {
    clientAutoCompleteMapper,
    partenaireAutoCompleteMapper,
    productAutoCompleteMapper,
  } = AutoCompleteMappers;

  const { modalType } = useModalStore();

  const fetchClients = async (query: string) => {
    const data = await fetchAutocompleteData(API_ENDPOINTS.clients, query);
    return clientAutoCompleteMapper(data.data);
  };

  const fetchProducts = async (query: string) => {
    const data = await fetchAutocompleteData(API_ENDPOINTS.products, query);
    return productAutoCompleteMapper(data.data);
  };

  const fetchPartenaires = async (query: string) => {
    const data = await fetchAutocompleteData(API_ENDPOINTS.partenaires, query);
    return partenaireAutoCompleteMapper(data.data);
  };

  return (
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
          disabled={modalType === ModalTypeEnum.UPDATE}
          minChars={0}
        />
        <SearchAutocomplete
          id="product"
          label={translation.Ticket.form.product}
          onSearch={fetchProducts}
          value={formData.product}
          onChange={(product) => setFormData((prev) => ({ ...prev, product }))}
          placeholder={translation.Ticket.form.product_search}
          icon={<PackageSearch className="w-5 h-5 text-gray-400" />}
          error={errors.product}
          disabled={modalType === ModalTypeEnum.UPDATE}
          dropdownPosition={formData.status === "EXIT" ? "below" : "above"}
          required
          minChars={0}
        />
        {formData.status === "EXIT" && (
          <SearchAutocomplete
            id="client"
            label={translation.Ticket.form.client}
            onSearch={fetchClients}
            value={formData.client}
            onChange={(client) => setFormData((prev) => ({ ...prev, client }))}
            placeholder={translation.Ticket.form.client_search}
            icon={<UserSearch className="w-5 h-5 text-gray-400" />}
            error={errors.client}
            disabled={modalType === ModalTypeEnum.UPDATE}
            dropdownPosition="above"
            required
          />
        )}
      </div>
    </div>
  );
};

export default FinalTab;
