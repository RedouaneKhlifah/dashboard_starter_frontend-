import { DictionaryType } from "@/lib/i18n";
import useModalStore from "@/store/modalStore";
import React, { useCallback, useState, useEffect } from "react";
import GlobalModal from "../shared/GlobalModal";
import SingleInputDateRangePicker from "../shared/SingleInputDateRangePicker";
import { InputField } from "../ui";
import http from "@/lib/http";
import { IEmployee } from "@/interfaces/IEmployee";
import useToast from "@/hooks/useToast";
import { IEmployeeWithHistory } from "./HistoryModal";
import { formatDate } from "@/utils/Date";

interface CreateBulletinProps {
  translation: DictionaryType;
  isSecondOpen: boolean;
  employee: IEmployee | undefined;
  setEmployeeWithHistory: React.Dispatch<
    React.SetStateAction<IEmployeeWithHistory | null>
  >;
}

const CreateBulletin: React.FC<CreateBulletinProps> = ({
  translation,
  isSecondOpen,
  employee,
  setEmployeeWithHistory,
}) => {
  const { error: toastError, success: toastSuccess } = useToast();

  const today = React.useMemo(() => new Date(), []);
  const lastMonth = React.useMemo(() => {
    const date = new Date();
    date.setMonth(today.getMonth() - 1);
    return date;
  }, [today]);
  const { closeSecondModal } = useModalStore();
  const [dateRange, setDateRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: today,
    end: lastMonth,
  });
  const [totalTon, setTotalTon] = useState<number>(0);
  const [pricePerTonState, setPricePerTonState] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setTotal(totalTon * pricePerTonState);
  }, [totalTon, pricePerTonState]);

  const handleClose = useCallback(() => {
    closeSecondModal();
    setTotalTon(0);
    setDateRange({
      start: today,
      end: lastMonth,
    });
  }, [closeSecondModal, lastMonth, today]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      const res = await http(
        `${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/employees/history-of-pay/${employee?.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            start_date: dateRange.start,
            end_date: dateRange.end,
            total_ton: totalTon,
            price_per_ton: pricePerTonState,
          }),
        }
      );

      if (!res.ok) {
        toastError(translation.employee.message.bultain_error);
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      setEmployeeWithHistory((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          payment_histories: [
            {
              ...data,
              start_date: formatDate(dateRange.start),
              end_date: formatDate(dateRange.end),
            },
            ...prev.payment_histories,
          ],
        };
      });
      toastSuccess(translation.employee.message.bultain_success);
      handleClose();
      setIsLoading(false);
    },
    [
      dateRange.end,
      dateRange.start,
      employee?.id,
      handleClose,
      pricePerTonState,
      setEmployeeWithHistory,
      toastError,
      toastSuccess,
      totalTon,
      translation.employee.message.bultain_error,
      translation.employee.message.bultain_success,
    ]
  );

  return (
    <GlobalModal
      open={isSecondOpen}
      onClose={handleClose}
      title={translation.HistoryModal?.history?.add_Payment}
      submitButtonText={translation.common.save}
      cancelButtonText={translation.common.cancel}
      onSubmit={handleSubmit}
      contentClassName="2xl:min-w-[70%]"
      backdrop={false}
      dismiss={false}
      isLoading={isLoading}
    >
      <div className="space-y-2 p-3 h-[28rem]">
        <div className="bg-gray-50 p-3 rounded-lg grid grid-cols-2 gap-4 justify-center">
          <InputField
            id="full_name"
            label={translation.HistoryModal.fullName}
            value={employee?.full_name || ""}
            onChange={() => {}}
            disabled
          />
          <SingleInputDateRangePicker
            value={dateRange}
            onChange={(newRange) =>
              setDateRange({
                start: newRange.start || today,
                end: newRange.end || lastMonth,
              })
            }
            translation={translation}
            min={true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border">
          <InputField
            id="totalTon"
            label={translation.partenaireModal?.common?.totalWeight}
            type="number"
            value={totalTon}
            onChange={(e) => setTotalTon(Number(e.target.value))}
            min={0}
            suffix={translation.shared.ton_unit}
          />
          <InputField
            id="pricePerTon"
            label={translation.partenaireModal?.common?.pricePerKg}
            type="number"
            value={pricePerTonState}
            onChange={(e) => setPricePerTonState(Number(e.target.value))}
            suffix={translation.shared.currency}
          />
        </div>

        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex justify-between py-3 mt-2 bg-gray-50 rounded-lg p-2">
            <span className="font-semibold text-lg">
              {translation.partenaireModal?.common?.netTotal || "Total"}
            </span>
            <span className="font-bold text-lg text-primary">
              {total.toFixed(2)} {translation.shared.currency || "MAD"}
            </span>
          </div>
        </div>
      </div>
    </GlobalModal>
  );
};

export default CreateBulletin;
