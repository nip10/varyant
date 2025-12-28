"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  ClockIcon,
  ExternalLinkIcon,
  ListTodoIcon,
  Loader2Icon,
  SquareIcon,
} from "lucide-react";
import type {
  LinearIssueInput,
  LinearIssueOutput,
  LinearIssueUpdateInput,
  ToolApprovalProps,
  ToolResultProps,
} from "./types";

const PRIORITY_CONFIG: Record<number, { label: string; color: string }> = {
  0: { label: "No priority", color: "text-gray-400" },
  1: { label: "Urgent", color: "text-red-500" },
  2: { label: "High", color: "text-orange-500" },
  3: { label: "Medium", color: "text-yellow-500" },
  4: { label: "Low", color: "text-blue-500" },
};

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: typeof CheckCircle2Icon; color: string }
> = {
  backlog: { label: "Backlog", icon: SquareIcon, color: "text-gray-400" },
  todo: { label: "Todo", icon: CircleDotIcon, color: "text-gray-500" },
  in_progress: {
    label: "In Progress",
    icon: Loader2Icon,
    color: "text-yellow-500",
  },
  in_review: { label: "In Review", icon: ClockIcon, color: "text-blue-500" },
  done: { label: "Done", icon: CheckCircle2Icon, color: "text-green-500" },
};

export function LinearIssueResult({
  output,
  state,
}: ToolResultProps<LinearIssueInput, LinearIssueOutput>) {
  if (state !== "output-available" || !output) {
    return null;
  }

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="size-4"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z" />
            <circle cx="50" cy="50" r="20" />
          </svg>
          <span className="text-sm font-medium">Linear Issue Created</span>
        </div>
        <Badge variant="secondary" className="text-xs font-mono">
          {output.identifier}
        </Badge>
      </div>

      <div className="rounded-lg border bg-card p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h4 className="text-sm font-medium leading-snug">{output.title}</h4>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            asChild
          >
            <a href={output.url} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon className="size-3.5" />
            </a>
          </Button>
        </div>

        {output.state && (
          <div className="flex items-center gap-2">
            <CheckCircle2Icon className="size-3.5 text-green-500" />
            <span className="text-xs text-muted-foreground">
              Status: {output.state}
            </span>
          </div>
        )}

        <Button variant="outline" size="sm" className="w-full" asChild>
          <a
            href={output.url}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-1.5"
          >
            <span>Open in Linear</span>
            <ExternalLinkIcon className="size-3" />
          </a>
        </Button>
      </div>
    </div>
  );
}

export function LinearIssueApproval({
  input,
}: ToolApprovalProps<LinearIssueInput>) {
  const priority = PRIORITY_CONFIG[input.priority ?? 0];

  return (
    <div className="space-y-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
          <ListTodoIcon className="size-5 text-indigo-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{input.title}</p>
          <p className="text-xs text-muted-foreground">Create Linear Issue</p>
        </div>
      </div>

      {input.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 bg-white dark:bg-gray-900 rounded-md border p-2">
          {input.description}
        </p>
      )}

      {input.priority !== undefined && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Priority:</span>
          <span className={cn("font-medium", priority.color)}>
            {priority.label}
          </span>
        </div>
      )}
    </div>
  );
}

export function LinearIssueUpdateResult({
  input,
  output,
  state,
}: ToolResultProps<LinearIssueUpdateInput, LinearIssueOutput>) {
  if (state !== "output-available" || !output) {
    return null;
  }

  const statusConfig = STATUS_CONFIG[input.status];
  const StatusIcon = statusConfig?.icon || CircleDotIcon;

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="size-4"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90c-22.1 0-40-17.9-40-40s17.9-40 40-40 40 17.9 40 40-17.9 40-40 40z" />
            <circle cx="50" cy="50" r="20" />
          </svg>
          <span className="text-sm font-medium">Issue Updated</span>
        </div>
        <Badge variant="secondary" className="text-xs font-mono">
          {output.identifier}
        </Badge>
      </div>

      <div className="rounded-lg border bg-card p-4 space-y-3">
        <h4 className="text-sm font-medium">{output.title}</h4>

        <div className="flex items-center gap-2 text-xs">
          <StatusIcon className={cn("size-4", statusConfig?.color)} />
          <span>Status changed to</span>
          <Badge variant="outline" className="text-xs">
            {output.state || statusConfig?.label}
          </Badge>
        </div>

        <Button variant="outline" size="sm" className="w-full" asChild>
          <a
            href={output.url}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-1.5"
          >
            <span>Open in Linear</span>
            <ExternalLinkIcon className="size-3" />
          </a>
        </Button>
      </div>
    </div>
  );
}

export function LinearIssueUpdateApproval({
  input,
}: ToolApprovalProps<LinearIssueUpdateInput>) {
  const statusConfig = STATUS_CONFIG[input.status];
  const StatusIcon = statusConfig?.icon || CircleDotIcon;

  return (
    <div className="space-y-3 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
          <ListTodoIcon className="size-5 text-indigo-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Update Issue Status</p>
          <code className="text-xs text-muted-foreground font-mono">
            {input.issueId}
          </code>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Change status to:</span>
        <div className="flex items-center gap-1.5">
          <StatusIcon className={cn("size-4", statusConfig?.color)} />
          <span className="font-medium">{statusConfig?.label}</span>
        </div>
      </div>
    </div>
  );
}
