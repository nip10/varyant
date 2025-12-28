"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import {
  AlertTriangleIcon,
  BeakerIcon,
  CheckCircleIcon,
  ClockIcon,
  SearchIcon,
  TrendingUpIcon,
  XCircleIcon,
  RefreshCwIcon,
  UsersIcon,
  TargetIcon,
} from "lucide-react";
import type { ToolResultProps } from "./types";

type Recommendation = "SHIP" | "ITERATE" | "END" | "WAIT" | "INVESTIGATE";

interface AnalyzeExperimentInput {
  experimentId: number;
}

interface AnalyzeExperimentOutput {
  experiment: {
    id: number;
    name: string;
    description: string | null;
    featureFlagKey: string;
    startDate: string | null;
    endDate: string | null;
    daysRunning: number | null;
    variants: { key: string; name: string | null }[];
    metrics: { type: string; event: string | null }[];
  };
  results: {
    significant: boolean;
    significanceCode: string;
    variants: { key: string; participants: number; conversions: number }[];
    probability: Record<string, number> | null;
  };
  stats: {
    totalParticipants: number;
    controlRate: string;
    testRate: string;
    uplift: string;
    trafficSplit: { control: string; test: string };
    probability: { control: string; test: string };
  } | null;
  recommendation: Recommendation;
  recommendationReason: string;
}

const recommendationConfig: Record<
  Recommendation,
  { icon: typeof CheckCircleIcon; color: string; bgColor: string; label: string }
> = {
  SHIP: {
    icon: CheckCircleIcon,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    label: "Ship It!",
  },
  ITERATE: {
    icon: RefreshCwIcon,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    label: "Iterate",
  },
  END: {
    icon: XCircleIcon,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    label: "End Test",
  },
  WAIT: {
    icon: ClockIcon,
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/30",
    label: "Keep Running",
  },
  INVESTIGATE: {
    icon: SearchIcon,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    label: "Investigate",
  },
};

function StatCard({
  label,
  value,
  subValue,
  status,
}: {
  label: string;
  value: string;
  subValue?: string;
  status?: "good" | "warning" | "bad" | "neutral";
}) {
  const statusColors = {
    good: "border-green-200 dark:border-green-800",
    warning: "border-yellow-200 dark:border-yellow-800",
    bad: "border-red-200 dark:border-red-800",
    neutral: "border-border",
  };

  return (
    <Card className={`p-3 ${statusColors[status || "neutral"]}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-bold">{value}</p>
      {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
    </Card>
  );
}

function VariantRow({
  name,
  rate,
  participants,
  conversions,
  highlight = false,
}: {
  name: string;
  rate: string;
  participants: number;
  conversions: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center p-3 rounded-lg ${
        highlight ? "bg-green-50 dark:bg-green-950/20" : "bg-muted/30"
      }`}
    >
      <div>
        <span className="font-medium">{name}</span>
        <p className="text-xs text-muted-foreground">
          {conversions.toLocaleString()} / {participants.toLocaleString()} users
        </p>
      </div>
      <div className="text-right">
        <span className="font-bold text-lg">{rate}%</span>
      </div>
    </div>
  );
}

export function ExperimentAnalysisResult({
  output,
  state,
}: ToolResultProps<AnalyzeExperimentInput, AnalyzeExperimentOutput>) {
  if (state !== "output-available" || !output) {
    return null;
  }

  const { experiment, results, stats, recommendation, recommendationReason } = output;
  const config = recommendationConfig[recommendation];
  const Icon = config.icon;

  // Determine statuses
  const sampleStatus =
    stats && stats.totalParticipants >= 1000
      ? "good"
      : stats && stats.totalParticipants >= 100
        ? "warning"
        : "bad";

  const uplift = stats ? parseFloat(stats.uplift) : 0;
  const upliftStatus = uplift > 5 ? "good" : uplift < -5 ? "bad" : "neutral";

  // Check for traffic imbalance
  const trafficImbalance =
    stats && Math.abs(parseFloat(stats.trafficSplit.control) - 50) > 5;

  // Follow-up suggestions
  const suggestions: string[] = [];
  if (recommendation === "SHIP") {
    suggestions.push("Create rollout plan");
    suggestions.push("Generate stakeholder summary");
  } else if (recommendation === "ITERATE") {
    suggestions.push("Suggest refined hypothesis");
    suggestions.push("Create follow-up experiment");
  } else if (recommendation === "WAIT") {
    suggestions.push("Estimate time to significance");
    suggestions.push("Check experiment implementation");
  } else if (recommendation === "INVESTIGATE") {
    suggestions.push("Check feature flag implementation");
    suggestions.push("Review traffic allocation");
  }
  suggestions.push("Show segment breakdown");

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <BeakerIcon className="size-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold">{experiment.name}</h3>
            <p className="text-xs text-muted-foreground">
              {experiment.daysRunning !== null
                ? `Running for ${experiment.daysRunning} days`
                : "Not started"}
              {experiment.featureFlagKey && ` | ${experiment.featureFlagKey}`}
            </p>
          </div>
        </div>
        <Badge className={`${config.bgColor} ${config.color} border-0`}>
          <Icon className="size-3 mr-1" />
          {config.label}
        </Badge>
      </div>

      {/* Key Metrics */}
      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="Sample Size"
            value={stats.totalParticipants.toLocaleString()}
            subValue={sampleStatus === "warning" ? "Needs more data" : undefined}
            status={sampleStatus}
          />
          <StatCard
            label="Significance"
            value={results.significant ? "Yes" : "No"}
            subValue={
              stats.probability.test ? `${stats.probability.test}% probability` : undefined
            }
            status={results.significant ? "good" : "neutral"}
          />
          <StatCard
            label="Uplift"
            value={`${uplift > 0 ? "+" : ""}${stats.uplift}%`}
            subValue="Test vs Control"
            status={upliftStatus}
          />
        </div>
      )}

      {/* Variant Comparison */}
      {stats && results.variants.length > 0 && (
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <TargetIcon className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium">Conversion Rates</span>
          </div>
          <div className="space-y-2">
            <VariantRow
              name="Control"
              rate={stats.controlRate}
              participants={results.variants.find((v) => v.key === "control")?.participants || 0}
              conversions={results.variants.find((v) => v.key === "control")?.conversions || 0}
            />
            {results.variants
              .filter((v) => v.key !== "control")
              .map((variant) => (
                <VariantRow
                  key={variant.key}
                  name={variant.key === "test" ? "Test" : variant.key}
                  rate={stats.testRate}
                  participants={variant.participants}
                  conversions={variant.conversions}
                  highlight={parseFloat(stats.testRate) > parseFloat(stats.controlRate)}
                />
              ))}
          </div>
        </Card>
      )}

      {/* Traffic Split */}
      {stats && (
        <div className="flex items-center gap-3 text-sm">
          <UsersIcon className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground">Traffic split:</span>
          <span>Control {stats.trafficSplit.control}%</span>
          <span className="text-muted-foreground">/</span>
          <span>Test {stats.trafficSplit.test}%</span>
          {trafficImbalance && (
            <Badge variant="outline" className="text-orange-500 border-orange-300">
              Imbalanced
            </Badge>
          )}
        </div>
      )}

      {/* Warnings */}
      {trafficImbalance && (
        <Alert variant="destructive">
          <AlertTriangleIcon className="size-4" />
          <AlertTitle>Traffic Split Imbalance</AlertTitle>
          <AlertDescription>
            Traffic is not evenly distributed ({stats?.trafficSplit.control}% /{" "}
            {stats?.trafficSplit.test}%). This may indicate an implementation issue.
          </AlertDescription>
        </Alert>
      )}

      {/* Recommendation */}
      <div className={`rounded-lg p-3 ${config.bgColor}`}>
        <div className="flex items-center gap-2 mb-1">
          <Icon className={`size-4 ${config.color}`} />
          <span className={`font-medium ${config.color}`}>Recommendation: {config.label}</span>
        </div>
        <p className="text-sm text-muted-foreground">{recommendationReason}</p>
      </div>

      {/* Follow-up Suggestions */}
      <Suggestions className="pt-2">
        {suggestions.slice(0, 3).map((suggestion) => (
          <Suggestion key={suggestion} suggestion={suggestion} className="text-xs" />
        ))}
      </Suggestions>
    </div>
  );
}
