import { ChangeEvent, Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { Select, Option, Checkbox } from "@material-tailwind/react";
import InputField from "@/components/ui/InputField";
import { handleChange } from "@/components/utils/formHandlers";
import { IOrderForm } from "@/dto/order/orderForm";
import { orderFormErrors } from "@/validation/orderValidators/orderValidator";
import { DictionaryType } from "@/lib/i18n";

interface SummaryTabProps {
  formData: IOrderForm;
  setFormData: Dispatch<SetStateAction<IOrderForm>>;
  setErrors: Dispatch<SetStateAction<orderFormErrors>>;
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
      total: Number(finalTotal.toFixed(2)), // Final total (TTC)
    }));
  }, [
    formData.products,
    formData.remise,
    formData.remise_type,
    formData.tva,
    setFormData,
  ]);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(
      {
        target: {
          id: "is_in_tone",
          value: e.target.checked
        },
      } as unknown as ChangeEvent<HTMLInputElement>,
      setFormData,
      setErrors
    );
  };

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
          suffix="%"
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
          id="subtotal"
          type="number"
          label={translation.order.form.subtotal}
          value={formData.subtotal?.toString() || ""}
          onChange={() => { }}
          suffix={translation.shared.currency}
          disabled
        />
        <InputField
          id="total"
          type="number"
          label={translation.order.form.total}
          value={formData.total?.toString() || ""}
          onChange={() => { }}
          suffix={translation.shared.currency}
          disabled
        />
      </div>
       <Checkbox
              id="is_in_tone"
              label={translation.order.form.is_in_tone || "Calculer en tonnes"}
              checked={formData.is_in_tone}
              onChange={handleCheckboxChange}
              ripple={true}
              className="h-5 w-5"
              // containerProps={{
              //   className: "mr-2"
              // }}
              labelProps={{
                className: "text-sm font-medium text-gray-700"
              }}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined} crossOrigin={undefined}        />
    </div>
  );
};

export default SummaryTab;
