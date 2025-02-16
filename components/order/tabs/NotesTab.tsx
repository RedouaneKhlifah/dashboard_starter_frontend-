import { Dispatch, SetStateAction } from "react";
import InputField from "@/components/ui/InputField";
import { handleChange } from "@/components/utils/formHandlers";
import { IOrderForm } from "@/dto/order/orderForm";
import { OrderFormErrors } from "@/validation/orderValidators/orderValidator";
import { DictionaryType } from "@/lib/i18n";

interface NotesTabProps {
  formData: IOrderForm;
  setFormData: Dispatch<SetStateAction<IOrderForm>>;
  errors: OrderFormErrors;
  setErrors: Dispatch<SetStateAction<OrderFormErrors>>;
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
        label={translation.Order.form.note}
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
