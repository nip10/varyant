import type { ToolUIPart } from "ai";
import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";

// Tool names as they appear in the UI parts
export type ToolName =
  | "tool-queryPosthogInsights"
  | "tool-createPostHogFeatureFlag"
  | "tool-createPostHogExperiment"
  | "tool-createLinearIssue"
  | "tool-updateLinearIssue"
  | "tool-triggerFeatureDevelopment"
  | "tool-crawlWebsite";

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
  featureFlagKey: string;
  id?: number;
  key?: string;
  name?: string;
  active?: boolean;
  filters?: {
    multivariate?: {
      variants?: Array<{
        key: string;
        name: string;
        rollout_percentage: number;
      }>;
    };
  };
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
}

// Website Screenshot types
export interface WebsiteScreenshotInput {
  url: string;
  formats?: string[];
}

export interface WebsiteScreenshotOutput {
  screenshotUrl: string;
}
