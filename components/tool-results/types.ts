import type { ToolUIPart } from "ai";
import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

// Tool names as they appear in the UI parts
export type ToolName =
  | "tool-queryPosthogInsights"
  | "tool-queryPosthogAnalytics"
  | "tool-createPostHogFeatureFlag"
  | "tool-createPostHogExperiment"
  | "tool-createLinearIssue"
  | "tool-updateLinearIssue"
  | "tool-triggerFeatureDevelopment"
  | "tool-crawlWebsite"
  | "tool-analyzeExperiment"
  | "tool-analyzeCompetitor"
  | "tool-showLiveExperiment";

// Base props for all tool result components
export interface ToolResultProps<TInput = unknown, TOutput = unknown> {
  input: TInput;
  output: TOutput;
  state: ToolUIPart["state"];
  errorText?: string;
}

// Base props for all tool approval components
export interface ToolApprovalProps<TInput = unknown> {
  input: TInput;
  toolName: string;
}

// Registry entry for a tool
export interface ToolRegistryEntry<TInput = unknown, TOutput = unknown> {
  ResultComponent: ComponentType<ToolResultProps<TInput, TOutput>>;
  ApprovalComponent?: ComponentType<ToolApprovalProps<TInput>>;
  loadingText: string;
  icon: LucideIcon;
  title: string;
}

// PostHog Insights types
export interface PosthogInsight {
  id: string;
  short_id: string;
  name: string;
  derived_name: string;
  description: string;
  favorited: boolean;
  created_at: string;
  updated_at: string;
  tags: string[];
}

export interface PosthogInsightsOutput {
  count: number;
  results: PosthogInsight[];
}

// PostHog Feature Flag types
export interface PosthogFeatureFlagInput {
  featureFlagKey: string;
  numVariants: number;
}

export interface PosthogFeatureFlagOutput {
  id: number;
  key: string;
  name: string;
  active: boolean;
  filters?: {
    multivariate?: {
      variants?: Array<{
        key: string;
        name: string;
        rollout_percentage: number;
      }>;
    };
  };
  // Keep these for backward compat
  featureFlagKey?: string;
}

// PostHog Experiment types
export interface PosthogExperimentInput {
  name: string;
  featureFlagKey: string;
  linearTicketId: string;
  implementationEffort: "low" | "medium" | "high";
}

export interface PosthogExperimentOutput {
  id: number;
  name: string;
  feature_flag_key: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  description?: string;
}

// Linear Issue types
export interface LinearIssueInput {
  title: string;
  description: string;
  projectId?: string;
  teamId?: string;
  priority?: number;
  labelIds?: string[];
}

export interface LinearIssueOutput {
  id: string;
  identifier: string;
  url: string;
  title: string;
  state?: string;
}

export interface LinearIssueUpdateInput {
  issueId: string;
  status: "backlog" | "todo" | "in_progress" | "in_review" | "done";
}

// GitHub Workflow types
export interface GithubWorkflowInput {
  feature: string;
}

export interface GithubWorkflowOutput {
  status: string;
  workflowId: string;
  repo?: string;
  ref?: string;
  workflowUrl?: string;
}

// Website Screenshot types
export interface WebsiteScreenshotInput {
  url: string;
  formats?: string[];
}

export interface WebsiteScreenshotOutput {
  screenshotUrl?: string;
  markdown?: string;
  html?: string;
  links?: string[];
  metadata?: {
    title?: string;
    description?: string;
  };
}

// PostHog Analytics Query types
export type ChartType = "line" | "bar" | "pie" | "number" | "table";

export interface PosthogQueryInput {
  question: string;
  hogqlQuery: string;
  visualization?: ChartType;
}

export interface PosthogQueryOutput {
  question: string;
  hogql: string;
  results: Record<string, unknown>[];
  columns: string[];
  chartType: ChartType;
  metadata: {
    rowCount: number;
    columnCount: number;
  };
}
