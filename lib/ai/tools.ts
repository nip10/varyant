import { InferUITools, tool, ToolSet, UIMessage } from "ai";
import { z } from "zod";
import { env } from "@/lib/config/env";

const baseUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const apiFetch = async (path: string, init: RequestInit) => {
  const url = new URL(path, baseUrl).toString();
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    cache: "no-store",
  });

  console.log("API fetch", url, res.status, res.statusText);

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`Request failed: ${res.status} ${message}`);
  }

  return res.json();
};

export const tools = {
  queryPosthogInsights: tool({
    description: "List all PostHog insights or funnels",
    inputSchema: z.object({}),
    execute: async () => {
      const response = await apiFetch("/api/posthog/insights", {
        method: "GET",
      });
      console.log("Query posthog insights response", response);
      return response;
    },
  }),
  createPostHogFeatureFlag: tool({
    description: "Create a PostHog feature flag (required for experiments)",
    inputSchema: z.object({
      featureFlagKey: z.string().describe("The key of the feature flag"),
      numVariants: z
        .number()
        .describe("The number of variants to create")
        .min(2)
        .max(3),
    }),
    outputSchema: z.object({
      featureFlagKey: z.string().describe("The key of the feature flag"),
    }),
    execute: async (input) => {
      const response = await apiFetch("/api/posthog/feature-flags", {
        method: "POST",
        body: JSON.stringify(input),
      });
      console.log("Create feature flag response", response);
      return response;
    },
    needsApproval: true,
  }),
  createPostHogExperiment: tool({
    description: "Create a PostHog experiment (requires a feature flag)",
    inputSchema: z.object({
      name: z.string().describe("The name of the experiment"),
      featureFlagKey: z.string().describe("The key of the feature flag"),
    }),
    execute: async (input) => {
      const response = await apiFetch("/api/posthog/experiments", {
        method: "POST",
        body: JSON.stringify(input),
      });
      console.log("Create experiment response", response);
      return response;
    },
    needsApproval: true,
  }),
  crawlWebsite: tool({
    description:
      "Crawl a website and return the results in the specified formats",
    inputSchema: z.object({
      url: z
        .string()
        .default("https://taxpal-zeta.vercel.app")
        .describe("The URL of the website to crawl"),
      formats: z
        .array(
          z.enum([
            "markdown",
            "html",
            "rawHtml",
            "links",
            "images",
            "screenshot",
            "summary",
            "changeTracking",
            "json",
            "attributes",
            "branding",
          ])
        )
        .optional()
        .default(["screenshot"])
        .describe("The formats to return the results in"),
    }),
    outputSchema: z.object({
      screenshotUrl: z.url().describe("The URL of the screenshot"),
    }),
    execute: async ({ url, formats }) => {
      console.log("Crawl website request", { url, formats });
      const response = await apiFetch("/api/firecrawl", {
        method: "POST",
        body: JSON.stringify({ url, formats }),
      });
      console.log("Crawl website response", response.data.screenshot);
      return { screenshotUrl: response.data.screenshot };
    },
    needsApproval: true,
  }),
  createLinearIssue: tool({
    description: "Create a Linear issue",
    inputSchema: z.object({
      title: z.string().describe("The title of the issue"),
      description: z.string().describe("The description of the issue"),
      projectId: z
        .string()
        .describe("The ID of the project to create the issue in")
        .optional(),
      teamId: z
        .string()
        .describe("The ID of the team to create the issue in")
        .optional(),
      priority: z
        .number()
        .min(0)
        .max(4)
        .describe("The priority of the issue")
        .optional(),
      labelIds: z
        .array(z.string())
        .describe("The IDs of the labels to add to the issue")
        .optional(),
    }),
    outputSchema: z.object({
      id: z.string().describe("The ID of the issue"),
      identifier: z.string().describe("The identifier of the issue"),
      url: z.url().describe("The URL of the issue"),
      title: z.string().describe("The title of the issue"),
    }),
    execute: async (input) => {
      const response = await apiFetch("/api/linear", {
        method: "POST",
        body: JSON.stringify(input),
      });
      console.log("Create linear issue response", response.data);
      return response.data;
    },
    needsApproval: true,
  }),
} satisfies ToolSet;

// NOTE: We define a type for the UI messages that includes the tools, using the InferUITools utility type.
export type MyUIMessage = UIMessage<never, never, InferUITools<typeof tools>>;
