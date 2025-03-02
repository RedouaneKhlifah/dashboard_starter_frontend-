"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PartnerData {
  name: string;
  value: number;
}

interface PartnersChartProps {
  data: PartnerData[];
  label: string;
  infoTooltipLabel?: string;
  metricTotal?: string;
}

const PartnersChart: React.FC<PartnersChartProps> = ({
  data,
  label,
  infoTooltipLabel,
  metricTotal,
}) => {
  const [isDrawn, setIsDrawn] = useState(false);
  const maxValue = useMemo(() => Math.max(...data.map(item => item.value), 100), [data]);
  
  




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
          <p className="text-lg font-bold mb-4 text-foreground">{metricTotal}</p>
          <div className="h-px bg-border my-4" />
        </>
      )}

 
      <div className="h-[260px] w-full">
        {isDrawn ? (
     
          <div className="h-full w-full bg-muted/20 rounded-lg relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between py-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-8 bg-muted rounded animate-pulse"
                />
              ))}
            </div>
            <div className="absolute left-12 right-4 top-4 bottom-8 flex justify-between items-end px-2">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 bg-muted rounded-t animate-pulse"
                  style={{ height: `${Math.random() * 40 + 20}%` }}
                />
              ))}
            </div>
            <div className="absolute left-12 right-4 bottom-0 h-8 flex justify-between items-center px-2">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-12 bg-muted rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : data && data.length > 0 ? (
         
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
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
                formatter={(value: number) => [value, "Tickets"]}
              />
              <Bar
                dataKey="value"
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

   
      {data && data.length > 0 && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Ticket counts are based on UTC timezone. Hover over bars for detailed values.
        </p>
      )}
    </div>
  );
};

export default PartnersChart;