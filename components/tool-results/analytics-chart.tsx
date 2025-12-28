"use client";

import { cn } from "@/lib/utils";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import type { ChartType } from "./types";

// Chart color palette
const CHART_COLORS = [
  "hsl(var(--chart-1, 220 70% 50%))",
  "hsl(var(--chart-2, 160 60% 45%))",
  "hsl(var(--chart-3, 30 80% 55%))",
  "hsl(var(--chart-4, 280 65% 60%))",
  "hsl(var(--chart-5, 340 75% 55%))",
];

// Fallback colors if CSS variables aren't available
const FALLBACK_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

interface AnalyticsChartProps {
  data: Record<string, unknown>[];
  columns: string[];
  chartType: ChartType;
  title?: string;
  className?: string;
}

// Format numbers for display
function formatValue(value: unknown): string {
  if (typeof value === "number") {
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`;
    }
    if (Number.isInteger(value)) {
      return value.toLocaleString();
    }
    return value.toFixed(2);
  }
  return String(value ?? "");
}

// Format dates for display
function formatDate(value: unknown): string {
  if (!value) return "";
  const str = String(value);
  // Try to parse as date
  const date = new Date(str);
  if (!isNaN(date.getTime())) {
    // If it looks like a full datetime, show date only
    if (str.includes("T") || str.includes(" ")) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  }
  return str;
}

// Number display component
function NumberDisplay({
  data,
  columns,
  title,
}: {
  data: Record<string, unknown>[];
  columns: string[];
  title?: string;
}) {
  const value = data[0]?.[Object.keys(data[0] || {})[0]];
  const label = columns[0] || "Value";

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {title && (
        <p className="text-sm text-muted-foreground mb-2">{title}</p>
      )}
      <p className="text-5xl font-bold tracking-tight">{formatValue(value)}</p>
      <p className="text-sm text-muted-foreground mt-2">{label}</p>
    </div>
  );
}

// Table display component
function TableDisplay({
  data,
  columns,
}: {
  data: Record<string, unknown>[];
  columns: string[];
}) {
  const keys = Object.keys(data[0] || {});

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {keys.map((key, i) => (
              <th
                key={key}
                className={cn(
                  "py-2 px-3 text-left font-medium text-muted-foreground",
                  i > 0 && "text-right"
                )}
              >
                {columns[i] || key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-muted/50 hover:bg-muted/30 transition-colors"
            >
              {keys.map((key, colIndex) => (
                <td
                  key={key}
                  className={cn(
                    "py-2 px-3",
                    colIndex > 0 && "text-right font-mono"
                  )}
                >
                  {formatValue(row[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Custom tooltip component
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-md">
      <p className="text-xs font-medium text-muted-foreground mb-1">
        {formatDate(label)}
      </p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div
            className="size-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium">{formatValue(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsChart({
  data,
  columns,
  chartType,
  title,
  className,
}: AnalyticsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-8", className)}>
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Get column keys from the first data row
  const keys = Object.keys(data[0] || {});
  const xKey = keys[0];
  const yKeys = keys.slice(1);

  // Number display
  if (chartType === "number") {
    return (
      <div className={className}>
        <NumberDisplay data={data} columns={columns} title={title} />
      </div>
    );
  }

  // Table display
  if (chartType === "table") {
    return (
      <div className={className}>
        {title && (
          <p className="text-sm font-medium mb-3">{title}</p>
        )}
        <TableDisplay data={data} columns={columns} />
      </div>
    );
  }

  // Chart displays
  return (
    <div className={className}>
      {title && (
        <p className="text-sm font-medium mb-4">{title}</p>
      )}
      <ResponsiveContainer width="100%" height={280}>
        {chartType === "line" ? (
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
              vertical={false}
            />
            <XAxis
              dataKey={xKey}
              tickFormatter={formatDate}
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tickFormatter={(v) => formatValue(v)}
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            {yKeys.length > 1 && <Legend />}
            {yKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                name={columns[index + 1] || key}
                stroke={FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        ) : chartType === "bar" ? (
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="stroke-muted"
              vertical={false}
            />
            <XAxis
              dataKey={xKey}
              tickFormatter={formatDate}
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              tickFormatter={(v) => formatValue(v)}
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={{ stroke: "hsl(var(--border))" }}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            {yKeys.length > 1 && <Legend />}
            {yKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                name={columns[index + 1] || key}
                fill={FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        ) : (
          // Pie chart
          <PieChart>
            <Pie
              data={data}
              dataKey={yKeys[0]}
              nameKey={xKey}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              paddingAngle={2}
              label={(entry) =>
                `${entry.name} (${((entry.percent ?? 0) * 100).toFixed(0)}%)`
              }
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatValue(value)}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
