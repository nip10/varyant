"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2Icon,
  ExternalLinkIcon,
  GitBranchIcon,
  PlayIcon,
  RocketIcon,
} from "lucide-react";
import type {
  GithubWorkflowInput,
  GithubWorkflowOutput,
  ToolApprovalProps,
  ToolResultProps,
} from "./types";

export function GithubWorkflowResult({
  input,
  output,
  state,
}: ToolResultProps<GithubWorkflowInput, GithubWorkflowOutput>) {
  if (state !== "output-available" || !output) {
    return null;
  }

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span className="text-sm font-medium">Workflow Dispatched</span>
        </div>
        <Badge className="bg-green-500 hover:bg-green-600 text-xs gap-1">
          <CheckCircle2Icon className="size-3" />
          {output.status}
        </Badge>
      </div>

      <div className="rounded-lg border bg-card p-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
            <RocketIcon className="size-5 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium">Feature Development</h4>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {input.feature}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <GitBranchIcon className="size-3.5" />
          <span>Triggered on</span>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono">{output.ref || "main"}</code>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Workflow ID:</span>
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono">
            {output.workflowId}
          </code>
        </div>

        <Button variant="outline" size="sm" className="w-full" asChild>
          <a
            href={output.workflowUrl || "https://github.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-1.5"
          >
            <span>View on GitHub</span>
            <ExternalLinkIcon className="size-3" />
          </a>
        </Button>
      </div>
    </div>
  );
}

export function GithubWorkflowApproval({
  input,
}: ToolApprovalProps<GithubWorkflowInput>) {
  return (
    <div className="space-y-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800">
          <svg
            className="size-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Trigger GitHub Workflow</p>
          <p className="text-xs text-muted-foreground">
            Feature development automation
          </p>
        </div>
      </div>

      <div className="rounded-md bg-white dark:bg-gray-800 border p-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <PlayIcon className="size-3" />
          <span>Feature to develop:</span>
        </div>
        <p className="text-sm">{input.feature}</p>
      </div>

      <p className="text-xs text-muted-foreground">
        This will trigger a GitHub Actions workflow to start development.
      </p>
    </div>
  );
}
