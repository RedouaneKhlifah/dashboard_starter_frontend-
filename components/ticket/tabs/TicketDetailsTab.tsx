// TicketDetailsTab.tsx
import { BarChart, Info } from "lucide-react";
import { DictionaryType } from "@/lib/i18n";
import { ITicketForm } from "@/dto/ticket/ticketForm";
import { TicketFormErrors } from "@/validation/ticketValidators/TicketValidator";
import InputField from "@/components/ui/InputField";
import RadioGroup from "@/components/ui/RadioGroup";
import { handleChange } from "@/components/utils/formHandlers";
import useModalStore from "@/store/modalStore";

interface TicketDetailsTabProps {
  formData: ITicketForm;
  setFormData: React.Dispatch<React.SetStateAction<ITicketForm>>;
  translation: DictionaryType;
  errors: TicketFormErrors;
  setErrors: React.Dispatch<React.SetStateAction<TicketFormErrors>>;
}

const TicketDetailsTab = ({
  formData,
  setFormData,
  translation,
  errors,
  setErrors,
}: TicketDetailsTabProps) => {
  const {modalType} = useModalStore();
  return (
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
          suffix="Kg"
          error={errors.poids_brut}
        />
        <InputField
          id="poids_tare"
          type="number"
          label={translation.Ticket.form.poids_tare}
          icon={<Info className="w-5 h-5 text-gray-400" />}
          value={formData.poids_tare.toString()}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          suffix="Kg"
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
          disabled={modalType === "update"}
        />
      </div>
    </div>
  );
};

export default TicketDetailsTab;
