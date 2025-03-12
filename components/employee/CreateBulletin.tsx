import { DictionaryType } from '@/lib/i18n';
import useModalStore from '@/store/modalStore';
import React, { useCallback, useState, useEffect } from 'react';
import GlobalModal from '../shared/GlobalModal';
import SingleInputDateRangePicker from '../shared/SingleInputDateRangePicker';
import { InputField } from '../ui';

interface CreateBulletinProps {
  translation: DictionaryType;
  isSecondOpen: boolean;
  pricePerTon: number;
}

const CreateBulletin: React.FC<CreateBulletinProps> = ({ 
  translation, 
  isSecondOpen,
  pricePerTon 
}) => {
  const { closeSecondModal } = useModalStore();
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({ 
    start: null, 
    end: null 
  });
  const [totalTon, setTotalTon] = useState<number>(0);
  const [pricePerTonState, setPricePerTonState] = useState<number>(pricePerTon);
  const [total, setTotal] = useState<number>(0);



  useEffect(() => {
    setTotal(totalTon * pricePerTonState);
  }, [totalTon, pricePerTonState]);

  const handleClose = useCallback(() => {
    closeSecondModal();
  }, [closeSecondModal]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
   
    closeSecondModal();
  }, [closeSecondModal]);

  return (
    <GlobalModal
      open={isSecondOpen}
      onClose={handleClose}
      title={translation.HistoryModal?.history?.add_Payment || "Create Bulletin"}
      submitButtonText={translation.common.save}
      cancelButtonText={translation.common.cancel}
      onSubmit={handleSubmit}
      contentClassName="2xl:min-w-[70%]"
      backdrop={false}
      dismiss={false}
    >
      <div className="space-y-2 p-3 h-[28rem]">
        <div className="bg-gray-50 rounded-lg">
          <SingleInputDateRangePicker
            value={dateRange}
            onChange={setDateRange}
            translation={translation}
            min = {true}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-lg border">
          <InputField
            id="totalTon"
            label={translation.partenaireModal?.common?.totalWeight || "Total Ton"}
            type="number"
            value={totalTon}
            onChange={(e) => setTotalTon(Number(e.target.value))}
          />
          <InputField
            id="pricePerTon"
            label={translation.partenaireModal?.common?.pricePerKg || "Prix/Ton"}
            type="number"
            value={pricePerTonState}
            onChange={(e) => setPricePerTonState(Number(e.target.value))}
            disabled
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