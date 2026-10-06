"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface TimelineData {
  period: string;
  applications: number;
  interviews: number;
  offers: number;
}

interface ApplicationsTimelineChartProps {
  data: TimelineData[];
}

export function ApplicationsTimelineChart({
  data,
}: ApplicationsTimelineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
        No timeline data available.
      </div>
    );
  }

  return (
    <div className="h-64 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: -15, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="hsl(var(--border) / 0.6)"
          />
          <XAxis
            dataKey="period"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-xl border border-border bg-popover p-3 text-xs shadow-xl text-popover-foreground space-y-1.5 min-w-[130px]">
                    <p className="font-bold text-foreground border-b border-border pb-1">
                      {label}
                    </p>
                    {payload.map((entry) => (
                      <div
                        key={entry.name}
                        className="flex items-center justify-between gap-3 font-medium"
                      >
                        <span
                          className="flex items-center gap-1.5"
                          style={{ color: entry.color }}
                        >
                          <span
                            className="h-2 w-2 rounded-xs shrink-0"
                            style={{ backgroundColor: entry.color }}
                          />
                          {entry.name}:
                        </span>
                        <span className="font-bold text-foreground">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          />
          <Area
            type="monotone"
            dataKey="applications"
            name="Applications"
            stroke="#2563eb"
            strokeWidth={2.5}
            fill="#2563eb"
            fillOpacity={0.12}
            activeDot={{ r: 5, strokeWidth: 2, fill: "#2563eb" }}
          />
          <Area
            type="monotone"
            dataKey="interviews"
            name="Interviews"
            stroke="#9333ea"
            strokeWidth={2.5}
            fill="#9333ea"
            fillOpacity={0.12}
            activeDot={{ r: 5, strokeWidth: 2, fill: "#9333ea" }}
          />
          <Area
            type="monotone"
            dataKey="offers"
            name="Offers"
            stroke="#059669"
            strokeWidth={2.5}
            fill="#059669"
            fillOpacity={0.15}
            activeDot={{ r: 5, strokeWidth: 2, fill: "#059669" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
