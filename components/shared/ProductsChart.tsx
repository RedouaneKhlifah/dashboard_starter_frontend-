"use client";

import React, { useMemo } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ProductDashboardData } from "../dashboard/types";

interface ProductsChartProps {
  data: ProductDashboardData[];
  label: string;
  infoTooltipLabel?: string;
  metricTotal?: string;
}

const ProductsChart: React.FC<ProductsChartProps> = ({
  data,
  label,
  infoTooltipLabel,
  metricTotal,
}) => {
  // Convert and sort product data
  const chartData = useMemo(
    () =>
      data
        .map((item) => ({
          ...item,
          total_quantity: Number(item.total_quantity),
        }))
        .sort((a, b) => b.total_quantity - a.total_quantity),
    [data]
  );

  const maxValue = useMemo(
    () => Math.max(...chartData.map((item) => item.total_quantity), 0),
    [chartData]
  );

  return (
    <div className="bg-card rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-foreground">{label}</h2>
          {infoTooltipLabel && (
            <div className="relative group">
              <div className="cursor-pointer text-muted-foreground">ⓘ</div>
              <div className="hidden group-hover:block absolute z-10 w-64 p-2 text-sm bg-popover text-popover-foreground rounded shadow-lg -translate-x-1/2 left-1/2 bottom-full mb-2">
                {infoTooltipLabel}
              </div>
            </div>
          )}
        </div>
      </div>

      {metricTotal && (
        <>
          <p className="text-lg font-bold mb-4 text-foreground">
            {metricTotal}
          </p>
          <div className="h-px bg-border my-4" />
        </>
      )}

      <div className="h-[260px] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                domain={[0, maxValue]}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--popover))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--popover-foreground))",
                }}
                formatter={(value: number) => [value, "Total Quantity"]}
              />
              <Bar
                dataKey="total_quantity"
                fill="hsl(var(--primary))"
                barSize={40}
                radius={[4, 4, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No data available for products yet.
            </p>
          </div>
        )}
      </div>

      {chartData.length > 0 && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Total quantities shown. Hover over bars for detailed numbers.
        </p>
      )}
    </div>
  );
};

export default ProductsChart;
