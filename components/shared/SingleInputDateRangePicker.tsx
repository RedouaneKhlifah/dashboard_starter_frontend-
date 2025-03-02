"use client";
import { useState } from 'react';
import DateRangePicker from './DateRangePicker';
import { addDays } from 'date-fns';
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface SingleInputDateRangePickerProps {
  value: { start: Date | null; end: Date | null };
  onChange: (newRange: { start: Date | null; end: Date | null }) => void;
}

export default function SingleInputDateRangePicker({ 
  value, 
  onChange 
}: SingleInputDateRangePickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateSelect = (start: Date, end: Date) => {
    onChange({ start, end });
    setShowPicker(false);
  };

  const displayText = value.start && value.end 
    ? `${value.start.toLocaleDateString()} - ${value.end.toLocaleDateString()}`
    : 'Select Date Range';


  const togglePicker = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    setShowPicker(!showPicker);
  };

  return (
    <div className="bg-background my-4">
      <div className="mx-auto relative">
        <button
          onClick={togglePicker}
          type='button'
          className="w-full p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between gap-2 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span className="font-medium">
              {displayText}
            </span>
          </div>
          {showPicker ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>

        {showPicker && (
          <div className="mt-2 absolute top-full left-0 w-full z-50 animate-fade-in-up">
            <DateRangePicker
              onSelect={handleDateSelect}
              initialRange={{
                startDate: value.start || new Date(),
                endDate: value.end || addDays(new Date(), 3),
                key: 'selection'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}