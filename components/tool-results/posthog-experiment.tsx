"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useConfetti } from "@/lib/hooks/use-confetti";
import { cn } from "@/lib/utils";
import {
  BeakerIcon,
  CalendarIcon,
  ExternalLinkIcon,
  FlagIcon,
  LinkIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";
import type {
  PosthogExperimentInput,
  PosthogExperimentOutput,
  ToolApprovalProps,
  ToolResultProps,
} from "./types";

const EFFORT_CONFIG = {
  low: { label: "Low Effort", color: "bg-green-500" },
  medium: { label: "Medium Effort", color: "bg-yellow-500" },
  high: { label: "High Effort", color: "bg-red-500" },
};

export function PosthogExperimentResult({
  input,
  output,
  state,
}: ToolResultProps<PosthogExperimentInput, PosthogExperimentOutput>) {
  const { celebrate } = useConfetti();
  const hasCelebratedRef = useRef(false);

  const experimentName = output?.name || input.name;
  const flagKey = output?.feature_flag_key || input.featureFlagKey;
  const createdAt = output?.created_at
    ? new Date(output.created_at).toLocaleDateString()
    : null;
  // Check if experiment has start_date to determine if it's running
  const status = output?.start_date
    ? output.end_date
      ? "Completed"
      : "Running"
    : "Draft";

  // Celebrate when experiment is successfully created
  useEffect(() => {
    if (state === "output-available" && output?.id && !hasCelebratedRef.current) {
      hasCelebratedRef.current = true;
      // Small delay for better UX - let the UI render first
      const timer = setTimeout(() => {
        celebrate();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [state, output?.id, celebrate]);

  if (state !== "output-available" || !output) {
    return null;
  }

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BeakerIcon className="size-4 text-blue-500" />
          <span className="text-sm font-medium">Experiment Created</span>
        </div>
        <Badge className="bg-blue-500 hover:bg-blue-600 text-xs">
          {status}
        </Badge>
      </div>

      <div className="rounded-lg border bg-card p-4 space-y-4">
        <div>
          <h4 className="text-base font-semibold">{experimentName}</h4>
          {createdAt && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <CalendarIcon className="size-3" />
              <span>Created {createdAt}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-1.5">
            <FlagIcon className="size-3.5 text-purple-500" />
            <code className="text-xs font-mono">{flagKey}</code>
          </div>

          <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-1.5">
            <LinkIcon className="size-3.5 text-indigo-500" />
            <a
              href={`https://linear.app/issue/${input.linearTicketId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline"
            >
              {input.linearTicketId}
            </a>
          </div>

          <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-1.5">
            <div
              className={cn(
                "size-2 rounded-full",
                EFFORT_CONFIG[input.implementationEffort].color
              )}
            />
            <span className="text-xs">
              {EFFORT_CONFIG[input.implementationEffort].label}
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <a
              href={`${process.env.NEXT_PUBLIC_POSTHOG_HOST}/experiments/${output.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-1.5"
            >
              <span>View in PostHog</span>
              <ExternalLinkIcon className="size-3" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PosthogExperimentApproval({
  input,
}: ToolApprovalProps<PosthogExperimentInput>) {
  const effortConfig = EFFORT_CONFIG[input.implementationEffort];

  return (
    <div className="space-y-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
          <BeakerIcon className="size-5 text-blue-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Create Experiment</p>
          <p className="text-xs text-muted-foreground">{input.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        <div className="rounded-md bg-white dark:bg-gray-900 border p-2">
          <p className="text-muted-foreground mb-0.5">Feature Flag</p>
          <code className="font-mono text-[11px]">{input.featureFlagKey}</code>
        </div>
        <div className="rounded-md bg-white dark:bg-gray-900 border p-2">
          <p className="text-muted-foreground mb-0.5">Linear Ticket</p>
          <span>{input.linearTicketId}</span>
        </div>
        <div className="rounded-md bg-white dark:bg-gray-900 border p-2">
          <p className="text-muted-foreground mb-0.5">Effort</p>
          <div className="flex items-center gap-1">
            <div className={cn("size-1.5 rounded-full", effortConfig.color)} />
            <span>{effortConfig.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
