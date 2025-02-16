// tabs/ClientTab.tsx
import { Dispatch, SetStateAction } from "react";
import { Fingerprint, UserSearch } from "lucide-react";
import InputField from "@/components/ui/InputField";
import SearchAutocomplete from "@/components/ui/SearchAutocomplete";
import { handleChange } from "@/components/utils/formHandlers";
import { IOrderForm, DevisRelationShipData } from "@/dto/order/orderForm";
import { OrderFormErrors } from "@/validation/orderValidators/orderValidator";
import { DictionaryType } from "@/lib/i18n";
import http from "@/lib/http";
import AutoCompleteMappers from "@/mappers/AutocCompleteMapper";
import { IDevis } from "@/interfaces/IDevis";

interface ClientTabProps {
  formData: IOrderForm;
  setFormData: Dispatch<SetStateAction<IOrderForm>>;
  errors: OrderFormErrors;
  setErrors: Dispatch<SetStateAction<OrderFormErrors>>;
  translation: DictionaryType;
  selectedRecord?: IDevis | undefined;
}

const ClientTab = ({
  formData,
  setFormData,
  errors,
  setErrors,
  translation,
  selectedRecord
}: ClientTabProps) => {
  const API_ENDPOINTS = {
    clients: `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/clients`,
  };

  const fetchClients = async (query: string) => {
    const response = await http(
      `${API_ENDPOINTS.clients}?search=${query}&page=1`
    );
    const data = await response.json();
    return AutoCompleteMappers.clientAutoCompleteMapper(data.data);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <SearchAutocomplete
          id="client"
          label={translation.Order.form.client}
          onSearch={fetchClients}
          value={formData.client}
          onChange={(client) =>
            setFormData((prev) => ({
              ...prev,
              client: client as DevisRelationShipData,
            }))
          }
          placeholder={translation.Ticket.form.client_search}
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
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          value={formData.devis_date}
          error={errors.devis_date}
          disabled={selectedRecord ? true : false}
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
  );
};

export default ClientTab;
