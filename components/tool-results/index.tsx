"use client";

import {
  ActivityIcon,
  BarChart3Icon,
  BeakerIcon,
  CameraIcon,
  FlagIcon,
  GitBranchIcon,
  ListTodoIcon,
  SearchIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import type { ToolApprovalProps, ToolName, ToolResultProps } from "./types";

// Import all result components
import {
  PosthogInsightsResult,
  PosthogInsightsApproval,
} from "./posthog-insights";
import {
  PosthogQueryResult,
  PosthogQueryApproval,
} from "./posthog-query-result";
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
import { ExperimentAnalysisResult } from "./experiment-analysis";
import {
  CompetitorAnalysisResult,
  CompetitorAnalysisApproval,
} from "./competitor-analysis";
import {
  LiveDashboardResult,
  LiveDashboardApproval,
} from "./live-experiment-dashboard";

// Import skeleton loaders
import {
  InsightsSkeleton,
  FeatureFlagSkeleton,
  ExperimentSkeleton,
  LinearIssueSkeleton,
  GithubWorkflowSkeleton,
  ScreenshotSkeleton,
  AnalyticsChartSkeleton,
} from "@/components/ui/skeleton-loaders";

// Re-export types
export * from "./types";

// Registry entry type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface RegistryEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ResultComponent: ComponentType<ToolResultProps<any, any>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ApprovalComponent: ComponentType<ToolApprovalProps<any>>;
  SkeletonComponent: ComponentType;
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
    SkeletonComponent: InsightsSkeleton,
    loadingText: "Querying PostHog insights...",
    icon: BarChart3Icon,
    title: "Query Insights",
    color: "text-orange-500",
  },
  "tool-queryPosthogAnalytics": {
    ResultComponent: PosthogQueryResult,
    ApprovalComponent: PosthogQueryApproval,
    SkeletonComponent: AnalyticsChartSkeleton,
    loadingText: "Analyzing your data...",
    icon: SearchIcon,
    title: "Analytics Query",
    color: "text-orange-500",
  },
  "tool-createPostHogFeatureFlag": {
    ResultComponent: PosthogFeatureFlagResult,
    ApprovalComponent: PosthogFeatureFlagApproval,
    SkeletonComponent: FeatureFlagSkeleton,
    loadingText: "Creating feature flag...",
    icon: FlagIcon,
    title: "Create Feature Flag",
    color: "text-purple-500",
  },
  "tool-createPostHogExperiment": {
    ResultComponent: PosthogExperimentResult,
    ApprovalComponent: PosthogExperimentApproval,
    SkeletonComponent: ExperimentSkeleton,
    loadingText: "Creating experiment...",
    icon: BeakerIcon,
    title: "Create Experiment",
    color: "text-blue-500",
  },
  "tool-createLinearIssue": {
    ResultComponent: LinearIssueResult,
    ApprovalComponent: LinearIssueApproval,
    SkeletonComponent: LinearIssueSkeleton,
    loadingText: "Creating Linear issue...",
    icon: ListTodoIcon,
    title: "Create Issue",
    color: "text-indigo-500",
  },
  "tool-updateLinearIssue": {
    ResultComponent: LinearIssueUpdateResult,
    ApprovalComponent: LinearIssueUpdateApproval,
    SkeletonComponent: LinearIssueSkeleton,
    loadingText: "Updating Linear issue...",
    icon: ListTodoIcon,
    title: "Update Issue",
    color: "text-indigo-500",
  },
  "tool-triggerFeatureDevelopment": {
    ResultComponent: GithubWorkflowResult,
    ApprovalComponent: GithubWorkflowApproval,
    SkeletonComponent: GithubWorkflowSkeleton,
    loadingText: "Triggering GitHub workflow...",
    icon: GitBranchIcon,
    title: "Trigger Workflow",
    color: "text-gray-700 dark:text-gray-300",
  },
  "tool-crawlWebsite": {
    ResultComponent: WebsiteScreenshotResult,
    ApprovalComponent: WebsiteScreenshotApproval,
    SkeletonComponent: ScreenshotSkeleton,
    loadingText: "Capturing screenshot...",
    icon: CameraIcon,
    title: "Capture Screenshot",
    color: "text-cyan-500",
  },
  "tool-analyzeExperiment": {
    ResultComponent: ExperimentAnalysisResult,
    ApprovalComponent: () => null,
    SkeletonComponent: ExperimentSkeleton,
    loadingText: "Analyzing experiment...",
    icon: BarChart3Icon,
    title: "Analyze Experiment",
    color: "text-blue-500",
  },
  "tool-analyzeCompetitor": {
    ResultComponent: CompetitorAnalysisResult,
    ApprovalComponent: CompetitorAnalysisApproval,
    SkeletonComponent: ScreenshotSkeleton,
    loadingText: "Analyzing competitor...",
    icon: SearchIcon,
    title: "Analyze Competitor",
    color: "text-cyan-500",
  },
  "tool-showLiveExperiment": {
    ResultComponent: LiveDashboardResult,
    ApprovalComponent: LiveDashboardApproval,
    SkeletonComponent: ExperimentSkeleton,
    loadingText: "Loading live dashboard...",
    icon: ActivityIcon,
    title: "Live Dashboard",
    color: "text-green-500",
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
