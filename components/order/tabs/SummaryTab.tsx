import { Dispatch, SetStateAction, useCallback, useEffect } from "react";
import { Select, Option } from "@material-tailwind/react";
import InputField from "@/components/ui/InputField";
import { handleChange } from "@/components/utils/formHandlers";
import { IOrderForm } from "@/dto/order/orderForm";
import { OrderFormErrors } from "@/validation/orderValidators/orderValidator";
import { DictionaryType } from "@/lib/i18n";

interface SummaryTabProps {
  formData: IOrderForm;
  setFormData: Dispatch<SetStateAction<IOrderForm>>;
  setErrors: Dispatch<SetStateAction<OrderFormErrors>>;
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
        (sum, product) => sum + product.price_unitaire * product.quantity,
        0
      ) || 0;

    const discountAmount =
      formData.remise_type === "PERCENT"
        ? baseSubtotal * ((formData.remise || 0) / 100)
        : formData.remise || 0;

    const discountedSubtotal = baseSubtotal - discountAmount;
    const tvaRate = (formData.tva || 0) / 100; 
    const tva = discountedSubtotal * tvaRate;
    const total = discountedSubtotal + tva;

    setFormData((prev) => ({
      ...prev,
      subtotal: Number(baseSubtotal.toFixed(2)),
      vat: Number(tva.toFixed(2)),
      total: Number(total.toFixed(2)),
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
  }, [calculateTotals]); 

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <InputField
          id="tva"
          type="number"
          label={translation.Order.form.tva}
          value={formData.tva || 0}
          onChange={(e) => handleChange(e, setFormData, setErrors)}
        />
        <div className="relative">
          <InputField
            id="remise"
            type="number"
            label={translation.Order.form.remise.value}
            value={formData.remise?.toString() || "0"}
            onChange={(e) => handleChange(e, setFormData, setErrors)}
            className="pr-24"
          />
          <div className="absolute right-1 top-[30px]">
            <div className="absolute left-[8px] top-[11px] h-5 border-l-2"></div>
            <Select
              id="remise_type"
              value={formData.remise_type || "percentage"}
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
              <Option value="percentage">%</Option>
              <Option className="text-sm" value="fixed">
                {translation.Order.form.remise.fixed}
              </Option>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField
          id="subtotal"
          type="number"
          label={translation.Order.form.subtotal}
          value={formData.subtotal?.toString() || ""}
          onChange={() => {}}
          disabled
        />
        <InputField
          id="total"
          type="number"
          label={translation.Order.form.total}
          value={formData.total?.toString() || ""}
          onChange={() => {}}
          disabled
        />
      </div>
    </div>
  );
};

export default SummaryTab;