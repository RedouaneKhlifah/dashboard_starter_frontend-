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
  data: DataPoint[];
  label: string;
  infoTooltipLabel?: string;
  metricTotal?: string;
  loading?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  label,
  infoTooltipLabel,
  metricTotal,
  loading = false,
}) => {
  const interval = useMemo(
    () => Math.max(1, Math.floor(data.length / 5)),
    [data.length]
  );

  return (
    <div className="bg-card rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        {loading ? (
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ) : (
          <h2 className="text-sm font-bold text-foreground">{label}</h2>
        )}
        {infoTooltipLabel && !loading && (
          <div className="relative group">
            <div className="cursor-pointer text-muted-foreground">ⓘ</div>
            <div className="hidden group-hover:block absolute z-10 w-64 p-2 text-sm bg-popover text-popover-foreground rounded shadow-lg -translate-x-1/2 left-1/2 bottom-full mb-2">
              {infoTooltipLabel}
            </div>
          </div>
        )}
      </div>

      {metricTotal && (
        <>
          {loading ? (
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
          ) : (
            <p className="text-lg font-bold mb-4 text-foreground">
              {metricTotal}
            </p>
          )}
          <div className="h-px bg-border my-4" />
        </>
      )}
      <div className="h-[260px] w-full">
        {loading ? (
          <div className="h-full w-full bg-muted/20 rounded-lg relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between py-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>

            <div className="absolute left-12 right-4 top-4 bottom-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={`horizontal-${i}`}
                  className="absolute w-full h-px bg-muted"
                  style={{ top: `${(i * 100) / 4}%` }}
                />
              ))}
              {[...Array(6)].map((_, i) => (
                <div
                  key={`vertical-${i}`}
                  className="absolute h-full w-px bg-muted"
                  style={{ left: `${(i * 100) / 5}%` }}
                />
              ))}

              <svg className="w-full h-full">
                <path
                  d="M 0,180 Q 100,140 200,160 T 400,120 T 600,140"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="3"
                  className="animate-pulse"
                />
              </svg>
            </div>

            <div className="absolute left-12 right-4 bottom-0 h-8 flex justify-between items-center">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
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
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis
                dataKey="date"
                interval={interval}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </RechartLineChar>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No data available yet for this metric. Check again after your
              first order.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LineChart;