"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3Icon,
  ExternalLinkIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react";
import type {
  PosthogInsightsOutput,
  ToolApprovalProps,
  ToolResultProps,
} from "./types";

export function PosthogInsightsResult({
  output,
  state,
}: ToolResultProps<Record<string, never>, PosthogInsightsOutput>) {
  if (state !== "output-available" || !output) {
    return null;
  }

  const insights = output.results || [];
  const count = output.count || insights.length;

  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
        <BarChart3Icon className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">No insights found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3Icon className="size-4 text-orange-500" />
          <span className="text-sm font-medium">PostHog Insights</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {count} insights
        </Badge>
      </div>

      <div className="grid gap-2">
        {insights.slice(0, 6).map((insight) => (
          <div
            key={insight.id}
            className={cn(
              "group flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:bg-accent/50"
            )}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-orange-500/10">
                <TrendingUpIcon className="size-4 text-orange-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium">
                    {insight.name || insight.derived_name || "Untitled Insight"}
                  </p>
                  {insight.favorited && (
                    <StarIcon className="size-3 fill-yellow-400 text-yellow-400" />
                  )}
                </div>
                {insight.description && (
                  <p className="truncate text-xs text-muted-foreground">
                    {insight.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {insight.tags?.length > 0 && (
                <div className="hidden items-center gap-1 sm:flex">
                  {insight.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="size-7 opacity-0 group-hover:opacity-100 transition-opacity"
                asChild
              >
                <a
                  href={`https://app.posthog.com/insights/${insight.short_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLinkIcon className="size-3.5" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {insights.length > 6 && (
        <p className="text-center text-xs text-muted-foreground">
          +{insights.length - 6} more insights
        </p>
      )}
    </div>
  );
}

export function PosthogInsightsApproval({}: ToolApprovalProps<Record<
  string,
  never
>>) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
        <BarChart3Icon className="size-5 text-orange-500" />
      </div>
      <div>
        <p className="text-sm font-medium">Query PostHog Insights</p>
        <p className="text-xs text-muted-foreground">
          Fetch all insights and funnels from your PostHog project
        </p>
      </div>
    </div>
  );
}
