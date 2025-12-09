import NumberFlow from "@number-flow/react";

export type Metric = { label: string; value: string; sub?: string };

export default function MetricCard({ metric }: { metric: Metric }) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="text-sm text-muted-foreground">{metric.label}</div>
      <NumberFlow
        className="text-2xl font-semibold mt-1"
        value={Number(metric.value)}
      />
      {metric.sub ? (
        <div className="text-xs text-muted-foreground mt-1">{metric.sub}</div>
      ) : null}
    </div>
  );
}
