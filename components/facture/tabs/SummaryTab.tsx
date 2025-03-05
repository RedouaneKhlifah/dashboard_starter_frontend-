import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { Select, Option } from "@material-tailwind/react";
import InputField from "@/components/ui/InputField";
import { handleChange } from "@/components/utils/formHandlers";
import { IFactureForm } from "@/dto/facture/factureForm";
import { FactureFormErrors } from "@/validation/factureValidators/factureValidator";
import { DictionaryType } from "@/lib/i18n";

interface SummaryTabProps {
  formData: IFactureForm;
  setFormData: Dispatch<SetStateAction<IFactureForm>>;
  setErrors: Dispatch<SetStateAction<FactureFormErrors>>;
  translation: DictionaryType;
}

const SummaryTab = ({
  formData,
  setFormData,
  setErrors,
  translation,
}: SummaryTabProps) => {
  useEffect(() => {
    if (formData.remise_type === undefined) {
      setFormData((prev) => ({
        ...prev,
        remise_type: "PERCENT",
        remise: prev.remise || 0,
      }));
    }
  }, [formData.remise_type, setFormData]);

  const calculateTotals = useCallback(() => {
    const baseSubtotal =
      formData.products?.reduce(
        (sum, product) =>
          sum + (product.price_unitaire || 0) * (product.quantity || 0),
        0
      ) || 0;

    const tvaAmount = (baseSubtotal * (formData.tva || 0)) / 100;
    const totalTTC = baseSubtotal + tvaAmount;

    const discountAmount =
      formData.remise_type === "PERCENT"
        ? (baseSubtotal * (formData.remise || 0)) / 100 // Apply discount on subtotal (HT)
        : formData.remise || 0;

    const finalTotal = Math.max(totalTTC - discountAmount, 0); // Prevent negative totals

    // Only update total
    setFormData((prev) => ({
      ...prev,
      subtotal: Number(baseSubtotal.toFixed(2)),
      total: Number(finalTotal.toFixed(2)),
    }));
  }, [
    formData.products,
    formData.remise,
    formData.remise_type,
    formData.tva,
    setFormData,
  ]);

  useEffect(() => {
    calculateTotals();
  }, [
    formData.products,
    formData.tva,
    formData.remise,
    formData.remise_type,
    calculateTotals,
  ]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <InputField
          id="tva"
          type="number"
          label={translation.order.form.vat}
          value={formData.tva || 0}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
        />
        <div className="relative">
          <InputField
            id="remise"
            type="number"
            label={translation.order.form.remise.value}
            value={formData.remise?.toString() || "0"}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            className="pr-24"
          />
          <div className="absolute right-1 top-[30px]">
            <div className="absolute left-[8px] top-[11px] h-5 border-l-2"></div>
            <Select
              id="remise_type"
              value={formData.remise_type || "PERCENT"}
              defaultChecked
              onChange={(e) =>
                handleChange(
                  {
                    target: { id: "remise_type", value: e as string },
                  } as React.ChangeEvent<HTMLInputElement>,
                  setFormData,
                  setErrors
                )
              }
              className="min-w-[80px] border-0 shadow-none text-current"
              containerProps={{
                className: "min-w-[80px]",
              }}
              labelProps={{
                className: "hidden",
              }}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              <Option value="PERCENT">%</Option>
              <Option className="text-sm" value="FIXED">
                {translation.order.form.remise.fixed}
              </Option>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField
          id="paid_amount"
          type="number"
          label={translation.order.form.paid_amount}
          value={formData.paid_amount?.toString() || "0"}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
          className="pr-24"
        />
        <InputField
          id="subtotal"
          type="number"
          label={translation.order.form.subtotal}
          value={formData.subtotal?.toString() || ""}
          onChange={() => {}}
          suffix={translation.shared.currency}
          disabled
        />
      </div>
      <div>
        <InputField
          id="total"
          type="number"
          label={translation.order.form.total}
          value={formData.total?.toString() || ""}
          onChange={() => {}}
          suffix={translation.shared.currency}
          disabled
        />
      </div>
    </div>
  );
};

export default SummaryTab;
