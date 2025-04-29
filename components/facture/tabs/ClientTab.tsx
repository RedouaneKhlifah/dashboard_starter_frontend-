// tabs/ClientTab.tsx
import { Dispatch, SetStateAction } from "react";
import { Command, Fingerprint, UserSearch } from "lucide-react";
import InputField from "@/components/ui/InputField";
import SearchAutocomplete from "@/components/ui/SearchAutocomplete";
import { handleChange } from "@/components/utils/formHandlers";
import {
  IFactureForm,
  FactureRelationShipData,
} from "@/dto/facture/factureForm";
import { FactureFormErrors } from "@/validation/factureValidators/factureValidator";
import { DictionaryType } from "@/lib/i18n";
import http from "@/lib/http";
import AutoCompleteMappers from "@/mappers/AutocCompleteMapper";
import { IFacture } from "@/interfaces/IFacture";

interface ClientTabProps {
  formData: IFactureForm;
  setFormData: Dispatch<SetStateAction<IFactureForm>>;
  errors: FactureFormErrors;
  setErrors: Dispatch<SetStateAction<FactureFormErrors>>;
  translation: DictionaryType;
  selectedRecord?: IFacture | undefined;
}

const ClientTab = ({
  formData,
  setFormData,
  errors,
  setErrors,
  translation,
  selectedRecord,
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
          label={translation.order.form.client}
          onSearch={fetchClients}
          value={formData.client}
          onChange={(client) => {
            setFormData((prev) => ({
              ...prev,
              client: client as FactureRelationShipData,
            }));
            setErrors((prev) => ({
              ...prev,
              client: undefined,
            }));
          }}
          placeholder={translation.Ticket.form.client_search}
          icon={<UserSearch className="w-5 h-5 text-gray-400" />}
          error={errors.client}
          required
          minChars={0}
        />
        <InputField
          id="reference"
          label={translation.order.form.reference}
          value={formData.reference}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          icon={<Fingerprint className="w-5 h-5 text-gray-400" />}
          error={errors.reference}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField
          id="bcn"
          label={translation.order.form.bcn}
          value={formData.bcn}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          icon={<Command className="w-5 h-5 text-gray-400" />}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          id="facture_date"
          type="date"
          label={translation.order.form.order_date}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          value={formData.facture_date}
          error={errors.facture_date}
          disabled={selectedRecord ? true : false}
          required
        />
        <InputField
          id="expiration_date"
          type="date"
          label={translation.order.form.expiration_date}
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
