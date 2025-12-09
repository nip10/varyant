import { getEventCount, listExperiments } from "@/lib/integrations/posthog";
import { TriangleAlert, CheckCircle2, Activity } from "lucide-react";
import MetricCard, { Metric } from "./metric-card";

export default async function Dashboard({}: {}) {
  async function fetchMetric(event: string, dateRange = "7 DAY") {
    try {
      const res = await getEventCount(event, dateRange);
      const row = Array.isArray(res.results)
        ? (res.results as any[])[0]
        : undefined;
      const count = Array.isArray(row) ? row[0] : 0;
      return count ?? 0;
    } catch (err) {
      console.error(`Failed to fetch metric for ${event}`, err);
      return null;
    }
  }

  async function fetchExperiments() {
    try {
      const data = await listExperiments();
      return data;
    } catch (err) {
      console.error("Failed to fetch experiments", err);
      return [];
    }
  }

  const [pageviews, signups, checkouts, experiments] = await Promise.all([
    fetchMetric("$pageview"),
    fetchMetric("signup"),
    fetchMetric("checkout"),
    fetchExperiments(),
  ]);

  const metrics: Metric[] = [
    {
      label: "Pageviews (7d)",
      value: `${pageviews ?? 0}`,
    },
    { label: "Signups (7d)", value: `${signups ?? 0}` },
    {
      label: "Checkouts (7d)",
      value: `${checkouts ?? 0}`,
    },
    {
      label: "Experiments",
      value: `${experiments?.length ?? 0}`,
      sub: "From PostHog /experiments",
    },
  ];

  const experimentList = experiments.slice(0, 5);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold">Recent Experiments</h2>
        </div>
        {experimentList.length === 0 ? (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <TriangleAlert className="h-4 w-4" />
            No experiments yet.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {experimentList.map((exp: any) => (
              <li
                key={exp.id}
                className="border rounded-md p-3 flex flex-col gap-1 bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">{exp.name}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Status: {exp.status ?? "unknown"} · Variants:{" "}
                  {Array.isArray(exp.variants)
                    ? exp.variants.map((v: any) => v.key).join(", ")
                    : "n/a"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
