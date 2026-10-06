"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { JobStatus } from "@/types/job";

interface StatusDistributionChartProps {
  data: {
    status: JobStatus;
    count: number;
    color: string;
  }[];
}

export function StatusDistributionChart({
  data,
}: StatusDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">
        No application data available yet.
      </div>
    );
  }

  return (
    <div className="h-64 w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="status"
            width={95}
            tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
            axisLine={{ stroke: "hsl(var(--border))" }}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="rounded-xl border border-border bg-popover px-3 py-2 text-xs shadow-xl text-popover-foreground">
                    <span className="font-bold">{item.status}: </span>
                    <span className="font-semibold text-primary">
                      {item.count} {item.count === 1 ? "job" : "jobs"}
                    </span>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
