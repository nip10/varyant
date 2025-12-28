import { getEventCount, listExperiments, type Result } from "@/lib/integrations/posthog";
import { env } from "@/lib/config/env";
import {
  TriangleAlert,
  CheckCircle2,
  Activity,
  PlayCircle,
  PauseCircle,
  FlaskConical,
  Flag,
  LineChart,
  ExternalLink,
  Zap,
  Clock,
} from "lucide-react";
import MetricCard, { Metric } from "./metric-card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";

// Get experiment status based on start_date and end_date
function getExperimentStatus(exp: Result): "running" | "draft" | "completed" {
  if (exp.end_date) return "completed";
  if (exp.start_date) return "running";
  return "draft";
}

// Get status badge styling
function getStatusBadge(status: "running" | "draft" | "completed") {
  switch (status) {
    case "running":
      return {
        variant: "default" as const,
        className: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
        icon: PlayCircle,
        label: "Running",
      };
    case "draft":
      return {
        variant: "outline" as const,
        className: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
        icon: PauseCircle,
        label: "Draft",
      };
    case "completed":
      return {
        variant: "secondary" as const,
        className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
        icon: CheckCircle2,
        label: "Completed",
      };
  }
}

// Quick action definition
type QuickAction = {
  title: string;
  description: string;
  href: string;
  icon: typeof FlaskConical;
  color: string;
};

const quickActions: QuickAction[] = [
  {
    title: "New Experiment",
    description: "Create a new A/B test",
    href: "/copilot?prompt=Create a new experiment for",
    icon: FlaskConical,
    color: "text-purple-500",
  },
  {
    title: "New Feature Flag",
    description: "Create a feature flag",
    href: "/copilot?prompt=Create a feature flag for",
    icon: Flag,
    color: "text-blue-500",
  },
  {
    title: "View Insights",
    description: "Explore PostHog insights",
    href: "/copilot?prompt=Show me all PostHog insights",
    icon: LineChart,
    color: "text-emerald-500",
  },
];

export default async function Dashboard() {
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

  async function fetchExperiments(): Promise<Result[]> {
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

  // Separate active (running) experiments from others
  const activeExperiments = experiments.filter(
    (exp) => getExperimentStatus(exp) === "running"
  );
  const recentExperiments = experiments
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

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
      label: "Active Experiments",
      value: `${activeExperiments.length}`,
      sub: `${experiments.length} total`,
    },
  ];

  const posthogHost = env.NEXT_PUBLIC_POSTHOG_HOST;
  const projectId = env.POSTHOG_PROJECT_ID;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Metrics Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle>Quick Actions</CardTitle>
          </div>
          <CardDescription>
            Jump into common tasks with AI-assisted workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-auto py-4 flex flex-col items-start gap-1 hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <action.icon className={`h-4 w-4 ${action.color}`} />
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-normal">
                    {action.description}
                  </span>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Active Experiments */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-green-500" />
                <CardTitle>Active Experiments</CardTitle>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                {activeExperiments.length} running
              </Badge>
            </div>
            <CardDescription>
              Currently running A/B tests and experiments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeExperiments.length === 0 ? (
              <div className="text-sm text-muted-foreground flex items-center gap-2 py-4">
                <TriangleAlert className="h-4 w-4" />
                No active experiments. Create one to get started!
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {activeExperiments.slice(0, 5).map((exp) => {
                  const status = getExperimentStatus(exp);
                  const statusConfig = getStatusBadge(status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <li
                      key={exp.id}
                      className="border rounded-md p-3 flex flex-col gap-2 bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-4 w-4 text-green-500" />
                          <span className="font-medium text-sm">{exp.name}</span>
                        </div>
                        <a
                          href={`${posthogHost}/project/${projectId}/experiments/${exp.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                          {exp.feature_flag_key}
                        </code>
                        {exp.start_date && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Started {new Date(exp.start_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle>Recent Experiments</CardTitle>
            </div>
            <CardDescription>
              Latest experiments created in PostHog
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentExperiments.length === 0 ? (
              <div className="text-sm text-muted-foreground flex items-center gap-2 py-4">
                <TriangleAlert className="h-4 w-4" />
                No experiments yet.
              </div>
            ) : (
              <ul className="flex flex-col gap-2">
                {recentExperiments.map((exp) => {
                  const status = getExperimentStatus(exp);
                  const statusConfig = getStatusBadge(status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <li
                      key={exp.id}
                      className="border rounded-md p-3 flex flex-col gap-2 bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <StatusIcon
                            className={`h-4 w-4 ${
                              status === "running"
                                ? "text-green-500"
                                : status === "draft"
                                ? "text-yellow-500"
                                : "text-gray-500"
                            }`}
                          />
                          <span className="font-medium text-sm">{exp.name}</span>
                        </div>
                        <Badge
                          variant={statusConfig.variant}
                          className={statusConfig.className}
                        >
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                          {exp.feature_flag_key}
                        </code>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(exp.created_at).toLocaleDateString()}
                        </span>
                        <a
                          href={`${posthogHost}/project/${projectId}/experiments/${exp.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>View</span>
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
