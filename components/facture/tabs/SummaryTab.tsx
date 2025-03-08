import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
} from "react";
import { Select, Option, Button } from "@material-tailwind/react";
import InputField from "@/components/ui/InputField";
import { handleChange } from "@/components/utils/formHandlers";
import { IFactureForm } from "@/dto/facture/factureForm";
import { FactureFormErrors } from "@/validation/factureValidators/factureValidator";
import { DictionaryType } from "@/lib/i18n";
// Import Lucide icons
import { Check, CreditCard } from "lucide-react";
import { Locale } from "@/i18n-config";

interface SummaryTabProps {
  formData: IFactureForm;
  setFormData: Dispatch<SetStateAction<IFactureForm>>;
  setErrors: Dispatch<SetStateAction<FactureFormErrors>>;
  translation: DictionaryType;
  lang?: Locale;
}

const SummaryTab = ({
  formData,
  setFormData,
  setErrors,
  translation,
  lang,
}: SummaryTabProps) => {
  const isRTL = lang === "ar";

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

  const handlePaidAmountChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = parseFloat(e.target.value);
    const total = formData.total || 0;
    if (value > total) {
      setFormData((prev) => ({
        ...prev,
        paid_amount: total,
      }));
      setErrors((prev) => ({
        ...prev,
        paid_amount: "Paid amount cannot exceed total",
      }));
    } else {
      handleChange(e, setFormData, setErrors);
    }
  };

  const handleFullyPaidClick = () => {
    setFormData((prev) => ({
      ...prev,
      paid_amount: prev.total || 0,
    }));
  };

  const isFullyPaid = formData.paid_amount === formData.total;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <InputField
          id="tva"
          type="number"
          label={translation.order.form.vat}
          value={formData.tva || 0}
          suffix="%"
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
        <div className="relative">
          <InputField
            id="paid_amount"
            type="number"
            label={translation.order.form.paid_amount}
            value={formData.paid_amount?.toString() || "0"}
            onChange={handlePaidAmountChange}
            className="pr-24"
          />
          <div
            className={`${
              isRTL
                ? "absolute left-[5px] top-[35px]"
                : "absolute right-[5px] top-[35px]"
            }`}
          >
            <span className="text-sm text-muted-foreground">
              {translation.shared.currency}
            </span>
            <span className="border-r-2 mx-1"></span>
            <Button
              size="sm"
              color={isFullyPaid ? "green" : "blue"}
              variant={isFullyPaid ? "filled" : "gradient"}
              className={`py-2 px-3 text-xs font-medium transition-all duration-300 rounded-sm ml-1 ${
                isFullyPaid ? "opacity-70 cursor-default" : "hover:shadow-lg"
              }`}
              onClick={handleFullyPaidClick}
              disabled={isFullyPaid}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {isFullyPaid ? (
                <div className="flex items-center">
                  <Check className="h-3.5 w-3.5 mr-1" />
                  {translation.shared.FullyPaid}
                </div>
              ) : (
                <div className="flex items-center">
                  <CreditCard className="h-3.5 w-3.5 mr-1" />
                  {translation.shared.FullyPaid}
                </div>
              )}
            </Button>
          </div>
        </div>
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
