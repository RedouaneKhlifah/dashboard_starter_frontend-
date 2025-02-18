import { Dispatch, SetStateAction } from "react";
import InputField from "@/components/ui/InputField";
import { handleChange } from "@/components/utils/formHandlers";
import { IorderForm } from "@/dto/order/orderForm";
import { orderFormErrors } from "@/validation/orderValidators/orderValidator";
import { DictionaryType } from "@/lib/i18n";

interface NotesTabProps {
  formData: IorderForm;
  setFormData: Dispatch<SetStateAction<IorderForm>>;
  errors: orderFormErrors;
  setErrors: Dispatch<SetStateAction<orderFormErrors>>;
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
