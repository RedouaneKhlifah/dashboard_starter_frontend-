"use client";
import { PartenaireDashboardData } from "@/components/dashboard/types";
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

interface PartnersChartProps {
  data: PartenaireDashboardData[];
  label: string;
  infoTooltipLabel?: string;
  metricTotal?: string;
  loading?: boolean;
}

const PartnersChart: React.FC<PartnersChartProps> = ({
  data,
  label,
  infoTooltipLabel,
  metricTotal,
  loading = false,
}) => {
  // Convert string numbers to actual numbers and sort data
  const chartData = useMemo(
    () =>
      data
        .map((item) => ({
          ...item,
          total_net: Number(item.total_net),
        }))
        .sort((a, b) => b.total_net - a.total_net),
    [data]
  );

  const maxValue = useMemo(
    () => Math.max(...chartData.map((item) => item.total_net)),
    [chartData]
  );

  // Generate skeleton data for the chart
  const skeletonData = useMemo(() => {
    return Array(5).fill(0).map((_, i) => ({
      name: `Partner ${i + 1}`,
      total_net: Math.random() * 100,
    }));
  }, []);

  return (
    <div className="bg-card rounded-lg shadow-md p-6">
      {/* Header section */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
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
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={skeletonData}
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
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Bar
                dataKey="total_net"
                fill="hsl(var(--muted))"
                barSize={40}
                radius={[4, 4, 0, 0]}
                className="animate-pulse"
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : chartData.length > 0 ? (
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
                formatter={(value: number) => [
                  value.toFixed(2) + " KG",
                  "Total Net",
                ]}
              />
              <Bar
                dataKey="total_net"
                fill="hsl(var(--primary))"
                barSize={40}
                radius={[4, 4, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No data available for partners yet.
            </p>
          </div>
        )}
      </div>

      {!loading && chartData.length > 0 && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Values shown in local currency. Hover over bars for detailed amounts.
        </p>
      )}
    </div>
  );
};

export default PartnersChart;