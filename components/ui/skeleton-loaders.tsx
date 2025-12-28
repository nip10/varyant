"use client";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton for PostHog insights (list of cards)
 * Matches the structure in posthog-insights.tsx
 */
export function InsightsSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      <div className="grid gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Skeleton className="size-8 rounded-md shrink-0" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12 rounded-full hidden sm:block" />
              <Skeleton className="size-7 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for feature flag (single card with variants)
 * Matches the structure in posthog-feature-flag.tsx
 */
export function FeatureFlagSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Skeleton className="h-7 w-40 rounded" />
            <Skeleton className="size-7 rounded" />
          </div>
          <Skeleton className="size-7 rounded shrink-0" />
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <div className="grid gap-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="size-2 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-12" />
                </div>
                <Skeleton className="h-5 w-10 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for experiment card
 * Matches the structure in posthog-experiment.tsx
 */
export function ExperimentSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div>
          <Skeleton className="h-5 w-48 mb-2" />
          <div className="flex items-center gap-1">
            <Skeleton className="size-3 rounded" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-8 w-32 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for Linear issue
 * Matches the structure in linear-issue.tsx
 */
export function LinearIssueSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>

      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="size-7 rounded shrink-0" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="size-3.5 rounded" />
          <Skeleton className="h-3 w-24" />
        </div>

        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
}

/**
 * Skeleton for GitHub workflow
 * Matches the structure in github-workflow.tsx
 */
export function GithubWorkflowSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-36" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="size-10 rounded-lg shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="size-3.5 rounded" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-12 rounded" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-5 w-24 rounded" />
        </div>

        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
}

/**
 * Skeleton for screenshot (image placeholder)
 * Matches the structure in website-screenshot.tsx
 */
export function ScreenshotSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-5 w-28 rounded-full" />
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Skeleton className="w-full h-64" />
        <div className="p-3 border-t">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-3 w-48" />
            <div className="flex items-center gap-1">
              <Skeleton className="size-7 rounded" />
              <Skeleton className="size-7 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for analytics chart (query results with visualization)
 * Matches the structure in posthog-query-result.tsx
 */
export function AnalyticsChartSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {/* Header with question */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <Skeleton className="size-4 rounded shrink-0 mt-0.5" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full shrink-0" />
      </div>

      {/* Chart area */}
      <div className="rounded-lg border p-4">
        <div className="space-y-3">
          {/* Chart skeleton - bars */}
          <div className="flex items-end justify-between gap-2 h-48">
            {[40, 65, 45, 80, 55, 70, 50].map((height, i) => (
              <Skeleton
                key={i}
                className="flex-1 rounded-t"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          {/* X-axis labels */}
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="h-3 w-8" />
            ))}
          </div>
        </div>
      </div>

      {/* Metadata row */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24 rounded" />
        <Skeleton className="h-3 w-20" />
      </div>

      {/* Follow-up suggestions */}
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-7 w-32 rounded-full" />
        <Skeleton className="h-7 w-28 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
    </div>
  );
}

/**
 * Generic skeleton for unknown tool types
 */
export function GenericToolSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}
