"use client";

import { useState } from "react";
import { DateRange, Range } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DictionaryType } from "@/lib/i18n";

interface DateRangePickerProps {
  onSelect: (startDate: Date, endDate: Date) => void;
  initialRange?: Range;
  translation: DictionaryType;
  min?: boolean;
}

const DateRangePicker = ({
  onSelect,
  initialRange,
  translation,
  min,
}: DateRangePickerProps) => {
  const [dateRange, setDateRange] = useState<Range[]>([
    initialRange || {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges: { [key: string]: Range }) => {
    const { startDate, endDate } = ranges.selection;
    if (startDate && endDate) {
      setDateRange([ranges.selection]);
    }
  };

  return (
    <div
      className={`bg-background p-4 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 ${
        min ? "w-[26rem]" : "w-full"
      }`}
    >
      <DateRange
        editableDateInputs={true}
        moveRangeOnFirstSelection={false}
        ranges={dateRange}
        onChange={handleSelect}
        rangeColors={["#52ad55"]}
        className={`date-range w-full bg-background ${min ? "h-[21rem]" : ""}`}
      />

      <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          onClick={() =>
            onSelect(
              new Date(new Date().setMonth(new Date().getMonth() - 1)),
              new Date()
            )
          }
        >
          {translation.shared.Reset}
        </button>
        <div className="space-x-2">
          <button
            type="button"
            onClick={() => {
              if (dateRange[0].startDate && dateRange[0].endDate) {
                onSelect(dateRange[0].startDate, dateRange[0].endDate);
              }
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors"
          >
            {translation.shared.Apply}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
