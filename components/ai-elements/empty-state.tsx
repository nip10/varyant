"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3Icon,
  BeakerIcon,
  CameraIcon,
  FlagIcon,
  GitBranchIcon,
  ListTodoIcon,
  SparklesIcon,
} from "lucide-react";
import type { ComponentProps } from "react";

// Capability definitions with colors matching the tool registry
const capabilities = [
  {
    icon: BarChart3Icon,
    label: "Query insights",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    icon: FlagIcon,
    label: "Feature flags",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    icon: BeakerIcon,
    label: "Experiments",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: ListTodoIcon,
    label: "Linear issues",
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
  },
  {
    icon: GitBranchIcon,
    label: "GitHub workflows",
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-100 dark:bg-gray-800",
  },
  {
    icon: CameraIcon,
    label: "Screenshots",
    color: "text-cyan-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30",
  },
];

// Suggested prompts with category colors
const suggestedPrompts = [
  {
    text: "Show me all my PostHog insights",
    color: "border-orange-200 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-800 dark:hover:border-orange-700 dark:hover:bg-orange-950/50",
  },
  {
    text: "Create a feature flag for A/B testing the homepage",
    color: "border-purple-200 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-800 dark:hover:border-purple-700 dark:hover:bg-purple-950/50",
  },
  {
    text: "What experiments are running?",
    color: "border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-800 dark:hover:border-blue-700 dark:hover:bg-blue-950/50",
  },
  {
    text: "Create a Linear ticket for the checkout bug",
    color: "border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/50",
  },
  {
    text: "Take a screenshot of our landing page",
    color: "border-cyan-200 hover:border-cyan-300 hover:bg-cyan-50 dark:border-cyan-800 dark:hover:border-cyan-700 dark:hover:bg-cyan-950/50",
  },
];

export type CopilotEmptyStateProps = ComponentProps<"div"> & {
  onPromptSelect?: (prompt: string) => void;
};

export function CopilotEmptyState({
  className,
  onPromptSelect,
  ...props
}: CopilotEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex size-full flex-col items-center justify-center gap-6 p-8",
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-purple-100">
          <SparklesIcon className="size-6 text-orange-500" />
        </div>
        <h3 className="font-semibold text-base">How can I help?</h3>
        <p className="max-w-sm text-muted-foreground text-sm">
          I can help you query analytics, manage experiments, create issues, and
          more.
        </p>
      </div>

      {/* Capabilities Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-w-md w-full">
        {capabilities.map((capability) => (
          <div
            key={capability.label}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-lg p-3",
              capability.bgColor
            )}
          >
            <capability.icon className={cn("size-4", capability.color)} />
            <span className="text-xs text-muted-foreground text-center">
              {capability.label}
            </span>
          </div>
        ))}
      </div>

      {/* Suggested Prompts */}
      <div className="flex flex-col gap-3 w-full max-w-md">
        <span className="text-xs font-medium text-muted-foreground text-center">
          Try asking
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt.text}
              type="button"
              onClick={() => onPromptSelect?.(prompt.text)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors cursor-pointer",
                "bg-background text-foreground",
                prompt.color
              )}
            >
              {prompt.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
