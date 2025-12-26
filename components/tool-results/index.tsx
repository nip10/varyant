"use client";

import {
  BarChart3Icon,
  BeakerIcon,
  CameraIcon,
  FlagIcon,
  GitBranchIcon,
  ListTodoIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import type { ToolApprovalProps, ToolName, ToolResultProps } from "./types";

// Import all result components
import {
  PosthogInsightsResult,
  PosthogInsightsApproval,
} from "./posthog-insights";
import {
  PosthogFeatureFlagResult,
  PosthogFeatureFlagApproval,
} from "./posthog-feature-flag";
import {
  PosthogExperimentResult,
  PosthogExperimentApproval,
} from "./posthog-experiment";
import {
  LinearIssueResult,
  LinearIssueApproval,
  LinearIssueUpdateResult,
  LinearIssueUpdateApproval,
} from "./linear-issue";
import {
  GithubWorkflowResult,
  GithubWorkflowApproval,
} from "./github-workflow";
import {
  WebsiteScreenshotResult,
  WebsiteScreenshotApproval,
} from "./website-screenshot";

// Re-export types
export * from "./types";

// Registry entry type
interface RegistryEntry {
  ResultComponent: ComponentType<ToolResultProps<any, any>>;
  ApprovalComponent: ComponentType<ToolApprovalProps<any>>;
  loadingText: string;
  icon: typeof BarChart3Icon;
  title: string;
  color: string;
}

// Tool registry mapping tool names to their components and metadata
export const toolRegistry: Record<ToolName, RegistryEntry> = {
  "tool-queryPosthogInsights": {
    ResultComponent: PosthogInsightsResult,
    ApprovalComponent: PosthogInsightsApproval,
    loadingText: "Querying PostHog insights...",
    icon: BarChart3Icon,
    title: "Query Insights",
    color: "text-orange-500",
  },
  "tool-createPostHogFeatureFlag": {
    ResultComponent: PosthogFeatureFlagResult,
    ApprovalComponent: PosthogFeatureFlagApproval,
    loadingText: "Creating feature flag...",
    icon: FlagIcon,
    title: "Create Feature Flag",
    color: "text-purple-500",
  },
  "tool-createPostHogExperiment": {
    ResultComponent: PosthogExperimentResult,
    ApprovalComponent: PosthogExperimentApproval,
    loadingText: "Creating experiment...",
    icon: BeakerIcon,
    title: "Create Experiment",
    color: "text-blue-500",
  },
  "tool-createLinearIssue": {
    ResultComponent: LinearIssueResult,
    ApprovalComponent: LinearIssueApproval,
    loadingText: "Creating Linear issue...",
    icon: ListTodoIcon,
    title: "Create Issue",
    color: "text-indigo-500",
  },
  "tool-updateLinearIssue": {
    ResultComponent: LinearIssueUpdateResult,
    ApprovalComponent: LinearIssueUpdateApproval,
    loadingText: "Updating Linear issue...",
    icon: ListTodoIcon,
    title: "Update Issue",
    color: "text-indigo-500",
  },
  "tool-triggerFeatureDevelopment": {
    ResultComponent: GithubWorkflowResult,
    ApprovalComponent: GithubWorkflowApproval,
    loadingText: "Triggering GitHub workflow...",
    icon: GitBranchIcon,
    title: "Trigger Workflow",
    color: "text-gray-700 dark:text-gray-300",
  },
  "tool-crawlWebsite": {
    ResultComponent: WebsiteScreenshotResult,
    ApprovalComponent: WebsiteScreenshotApproval,
    loadingText: "Capturing screenshot...",
    icon: CameraIcon,
    title: "Capture Screenshot",
    color: "text-cyan-500",
  },
};

// Helper to check if a tool type is in the registry
export function isRegisteredTool(toolType: string): toolType is ToolName {
  return toolType in toolRegistry;
}

// Helper to get registry entry
export function getToolEntry(toolType: string): RegistryEntry | null {
  if (isRegisteredTool(toolType)) {
    return toolRegistry[toolType];
  }
  return null;
}
