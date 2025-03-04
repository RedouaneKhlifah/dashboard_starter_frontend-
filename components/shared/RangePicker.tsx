"use client";
import { useState } from 'react';
import SingleInputDateRangePicker from './SingleInputDateRangePicker';
import { DictionaryType } from '@/lib/i18n';


interface RangePickerProps {
    translation: DictionaryType;
  }

  const RangePicker: React.FC<RangePickerProps> = ({
    translation
  }) => { 
    const [dateRange, setDateRange] = useState<{
        start: Date | null;
        end: Date | null;
      }>({ start: null, end: null });

    return (
        <div className='w-[24%]'>
            <SingleInputDateRangePicker
                value={dateRange}
                onChange={setDateRange}
                translation={translation}
            />
        </div>
    );
}

export default RangePicker;