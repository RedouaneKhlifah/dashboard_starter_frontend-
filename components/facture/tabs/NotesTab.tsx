import { Dispatch, SetStateAction } from "react";
import InputField from "@/components/ui/InputField";
import { handleChange } from "@/components/utils/formHandlers";
import { IFactureForm } from "@/dto/facture/factureForm";
import { FactureFormErrors } from "@/validation/factureValidators/factureValidator";
import { DictionaryType } from "@/lib/i18n";

interface NotesTabProps {
  formData: IFactureForm;
  setFormData: Dispatch<SetStateAction<IFactureForm>>;
  errors: FactureFormErrors;
  setErrors: Dispatch<SetStateAction<FactureFormErrors>>;
  translation: DictionaryType;
}

const NotesTab = ({
  formData,
  setFormData,
  errors,
  setErrors,
  translation,
}: NotesTabProps) => {
  return (
    <div className="space-y-4">
      <InputField
        id="note"
        label={translation.order.form.note}
        value={formData.note}
        onChange={(e) => handleChange(e, setFormData, setErrors)}
        error={errors.note}
        textarea
        rows={4}
      />
    </div>
  );
};

export default NotesTab;
