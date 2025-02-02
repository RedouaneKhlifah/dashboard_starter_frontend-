"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart as RechartLineChar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  date: string;
  value: number;
}

interface LineChartProps {
  /** Array of data points for the chart */
  data: DataPoint[];
  /** Chart title/label */
  label: string;
  /** Optional tooltip text shown when hovering over info icon */
  infoTooltipLabel?: string;
  /** Optional total metric to display above the chart */
  metricTotal?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  label,
  infoTooltipLabel,
  metricTotal,
}) => {
  const [isDrawn, setIsDrawn] = useState(true);
  const interval = useMemo(
    () => Math.max(1, Math.floor(data.length / 5)),
    [data.length]
  );

  useEffect(() => {
    if (data && data.length > 0) {
      const timer = setTimeout(() => {
        setIsDrawn(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [data]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-sm font-bold">{label}</h2>
        {infoTooltipLabel && (
          <div className="relative group">
            <div className="cursor-pointer">ⓘ</div>
            <div className="hidden group-hover:block absolute z-10 w-64 p-2 text-sm bg-gray-900 text-white rounded shadow-lg -translate-x-1/2 left-1/2 bottom-full mb-2">
              {infoTooltipLabel}
            </div>
          </div>
        )}
      </div>

      {metricTotal && (
        <>
          <p className="text-lg font-bold mb-4">{metricTotal}</p>
          <div className="h-px bg-gray-200 my-4" />
        </>
      )}

      <div className="h-[260px] w-full">
        {isDrawn ? (
          <div className="h-full w-full bg-gray-50 rounded-lg relative">
            {/* Y-axis skeleton */}
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between py-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-8 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>

            {/* Chart area skeleton */}
            <div className="absolute left-12 right-4 top-4 bottom-8">
              {/* Grid lines (horizontal and vertical) */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={`horizontal-${i}`}
                  className="absolute w-full h-px bg-gray-200"
                  style={{ top: `${(i * 100) / 4}%` }}
                />
              ))}
              {[...Array(6)].map((_, i) => (
                <div
                  key={`vertical-${i}`}
                  className="absolute h-full w-px bg-gray-200"
                  style={{ left: `${(i * 100) / 5}%` }}
                />
              ))}

              {/* Line chart skeleton */}
              <svg className="w-full h-full">
                <path
                  d="M 0,180 Q 100,140 200,160 T 400,120 T 600,140"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                  className="animate-pulse"
                />
              </svg>
            </div>

            {/* X-axis skeleton */}
            <div className="absolute left-12 right-4 bottom-0 h-8 flex justify-between items-center">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-12 bg-gray-200 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : data && data.length > 0 ? (
          <ResponsiveContainer>
            <RechartLineChar
              data={data}
              margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" interval={interval} stroke="#8a8a8a" />
              <YAxis stroke="#8a8a8a" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2458d4"
                strokeWidth={2}
              />
            </RechartLineChar>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-500">
              No data available yet for this metric. Check again after your
              first order.
            </p>
          </div>
        )}
      </div>

      {data && data.length > 0 && (
        <p className="mt-4 text-center text-xs text-gray-500">
          The dates on this chart use the UTC timezone. Use this data to
          understand the performance over time.
        </p>
      )}
    </div>
  );
};

export default LineChart;
