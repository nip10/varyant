"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useLiveExperiment,
  type ExperimentVariant,
  type LiveExperimentResults,
} from "@/lib/hooks/use-live-experiment";
import {
  ActivityIcon,
  RefreshCwIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  PauseIcon,
  PlayIcon,
  SparklesIcon,
  ExpandIcon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ToolResultProps } from "./types";

interface LiveDashboardInput {
  experimentId: number;
}

interface LiveDashboardOutput {
  experimentId: number;
  name: string;
}

// Skeleton loader for the dashboard
function LiveDashboardSkeleton() {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-48 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted rounded" />
        </div>
        <div className="h-6 w-20 bg-muted rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 bg-muted rounded-lg" />
        <div className="h-32 bg-muted rounded-lg" />
      </div>
      <div className="h-20 bg-muted rounded-lg" />
      <div className="grid grid-cols-3 gap-2">
        <div className="h-16 bg-muted rounded-lg" />
        <div className="h-16 bg-muted rounded-lg" />
        <div className="h-16 bg-muted rounded-lg" />
      </div>
    </div>
  );
}

// Variant comparison card
function VariantCard({
  variant,
  isControl,
  isWinning,
}: {
  variant: ExperimentVariant;
  isControl: boolean;
  isWinning: boolean;
}) {
  return (
    <Card
      className={cn(
        "p-3 transition-colors",
        isWinning &&
          !isControl &&
          "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20",
        isControl && "border-muted"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">{variant.name}</span>
        <div className="flex gap-1">
          {isControl && (
            <Badge variant="outline" className="text-xs">
              Control
            </Badge>
          )}
          {isWinning && !isControl && (
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
              Leading
            </Badge>
          )}
        </div>
      </div>
      <div className="text-2xl font-bold">{variant.conversionRate.toFixed(2)}%</div>
      <div className="text-xs text-muted-foreground">
        {variant.conversions.toLocaleString()} / {variant.participants.toLocaleString()} users
      </div>
      {!isControl && variant.improvement !== 0 && (
        <div
          className={cn(
            "text-sm font-medium mt-1 flex items-center gap-1",
            variant.improvement > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}
        >
          {variant.improvement > 0 ? (
            <TrendingUpIcon className="size-3" />
          ) : (
            <TrendingDownIcon className="size-3" />
          )}
          {variant.improvement > 0 ? "+" : ""}
          {variant.improvement.toFixed(1)}%
        </div>
      )}
    </Card>
  );
}

// Metric card
function MetricCard({
  label,
  value,
  format,
  trend,
}: {
  label: string;
  value: number;
  format: "number" | "percent";
  trend?: "up" | "down";
}) {
  const formatted =
    format === "percent"
      ? `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
      : value.toLocaleString();

  return (
    <Card className="p-2.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center gap-1">
        <span className="font-semibold">{formatted}</span>
        {trend &&
          (trend === "up" ? (
            <TrendingUpIcon className="size-3 text-green-500" />
          ) : (
            <TrendingDownIcon className="size-3 text-red-500" />
          ))}
      </div>
    </Card>
  );
}

// Significance bar
function SignificanceBar({ value }: { value: number }) {
  const getColor = () => {
    if (value >= 95) return "bg-green-500";
    if (value >= 80) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Statistical Significance</span>
        <span className="text-sm font-mono">{value.toFixed(1)}%</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full transition-all duration-500", getColor())}
          style={{ width: `${Math.min(100, value)}%` }}
        />
        {/* 95% marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-foreground/30"
          style={{ left: "95%" }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1.5">
        {value >= 95
          ? "Statistically significant! Ready to call."
          : `Need ${Math.max(0, 95 - value).toFixed(0)}% more for significance.`}
      </p>
    </Card>
  );
}

// AI Commentary
function AICommentary({ experiment }: { experiment: LiveExperimentResults }) {
  const leadingVariant = [...experiment.variants].sort(
    (a, b) => b.conversionRate - a.conversionRate
  )[0];
  const controlVariant = experiment.variants.find((v) => v.key === "control");
  const testVariant = experiment.variants.find((v) => v.key !== "control");

  let commentary = "";

  if (experiment.totalParticipants < 100) {
    commentary = `Early stage - only ${experiment.totalParticipants} participants so far. Let's gather more data before drawing conclusions.`;
  } else if (testVariant && testVariant.significance >= 95) {
    if (testVariant.improvement > 0) {
      commentary = `Great news! The test variant is winning with ${testVariant.improvement.toFixed(1)}% improvement and has reached statistical significance. Consider shipping this change.`;
    } else {
      commentary = `The control is performing better with statistical significance. The test variant showed a ${Math.abs(testVariant.improvement).toFixed(1)}% decrease. Consider ending the experiment.`;
    }
  } else if (testVariant && testVariant.improvement > 5) {
    commentary = `Looking promising! ${leadingVariant.name} is ahead by ${testVariant.improvement.toFixed(1)}%, but we need more data for significance (currently ${testVariant.significance.toFixed(0)}%).`;
  } else if (testVariant && testVariant.improvement < -5) {
    commentary = `The control is currently winning by ${Math.abs(testVariant.improvement).toFixed(1)}%. Keep monitoring - results may change as we gather more data.`;
  } else {
    commentary = `Results are close between variants. The experiment has been running for ${experiment.daysRunning} days with ${experiment.totalParticipants.toLocaleString()} participants.`;
  }

  return (
    <div className="flex items-start gap-2.5 p-3 bg-muted/50 rounded-lg">
      <SparklesIcon className="size-4 text-primary mt-0.5 shrink-0" />
      <p className="text-sm">{commentary}</p>
    </div>
  );
}

// Main dashboard component
interface LiveExperimentDashboardProps {
  experimentId: number;
  showAICommentary?: boolean;
  className?: string;
}

export function LiveExperimentDashboard({
  experimentId,
  showAICommentary = true,
  className,
}: LiveExperimentDashboardProps) {
  const [isPaused, setIsPaused] = useState(false);
  const { data: experiment, isLoading, error, dataUpdatedAt, refetch } = useLiveExperiment(
    experimentId,
    { enabled: !isPaused }
  );

  if (isLoading || !experiment) {
    return <LiveDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Failed to load experiment results.</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  const controlVariant = experiment.variants.find((v) => v.key === "control");
  const testVariant = experiment.variants.find((v) => v.key !== "control");
  const leadingVariant = [...experiment.variants].sort(
    (a, b) => b.conversionRate - a.conversionRate
  )[0];

  return (
    <div className={cn("space-y-4 p-4", className)}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{experiment.name}</h3>
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={experiment.status === "running" ? "default" : "secondary"}
            className="gap-1"
          >
            {experiment.status === "running" && (
              <ActivityIcon className="size-3 animate-pulse" />
            )}
            {experiment.status}
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? (
              <PlayIcon className="size-4" />
            ) : (
              <RefreshCwIcon className="size-4 animate-spin [animation-duration:2s]" />
            )}
          </Button>
        </div>
      </div>

      {/* Variant Comparison */}
      <div className="grid grid-cols-2 gap-4">
        {experiment.variants.map((variant) => (
          <VariantCard
            key={variant.key}
            variant={variant}
            isControl={variant.key === "control"}
            isWinning={leadingVariant.key === variant.key}
          />
        ))}
      </div>

      {/* Significance Meter */}
      {testVariant && <SignificanceBar value={testVariant.significance} />}

      {/* Live Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <MetricCard
          label="Total Participants"
          value={experiment.totalParticipants}
          format="number"
        />
        <MetricCard
          label="Improvement"
          value={testVariant?.improvement || 0}
          format="percent"
          trend={
            testVariant?.improvement
              ? testVariant.improvement > 0
                ? "up"
                : "down"
              : undefined
          }
        />
        <MetricCard label="Days Running" value={experiment.daysRunning} format="number" />
      </div>

      {/* AI Commentary */}
      {showAICommentary && <AICommentary experiment={experiment} />}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t">
        <Button variant="outline" size="sm" className="text-xs" onClick={() => refetch()}>
          <RefreshCwIcon className="size-3 mr-1.5" />
          Refresh Now
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? (
            <>
              <PlayIcon className="size-3 mr-1.5" />
              Resume Auto-refresh
            </>
          ) : (
            <>
              <PauseIcon className="size-3 mr-1.5" />
              Pause Updates
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// Tool Result wrapper
export function LiveDashboardResult({
  input,
  output,
  state,
}: ToolResultProps<LiveDashboardInput, LiveDashboardOutput>) {
  if (state !== "output-available" || !output) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-card">
      <LiveExperimentDashboard experimentId={output.experimentId} />
    </div>
  );
}

// Approval component (no confirmation needed - read-only)
export function LiveDashboardApproval() {
  return null;
}
