import { tool, ToolSet } from "ai";
import { z } from "zod";
import {
  createExperiment,
  createFeatureFlag,
  getInsights,
} from "@/lib/integrations/posthog";

export const posthogTools = {
  queryPosthogInsights: tool({
    description: "List all PostHog insights or funnels",
    inputSchema: z.object({}),
    execute: async () => {
      const data = await getInsights();
      return data;
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
      const data = await createFeatureFlag(input);
      return data;
    },
    needsApproval: true,
  }),
  createPostHogExperiment: tool({
    description: "Create a PostHog experiment (requires a feature flag and a ticket in Linear)",
    inputSchema: z.object({
      name: z.string().describe("The name of the experiment"),
      featureFlagKey: z.string().describe("The key of the feature flag"),
      linearTicketId: z.string().describe("The ID of the ticket in Linear"),
      implementationEffort: z
        .enum(["low", "medium", "high"])
        .describe("The implementation effort of the experiment"),
    }),
    execute: async (input) => {
      const data = await createExperiment(input);
      return data;
    },
    needsApproval: (input) => input.implementationEffort === "high",
  }),
} satisfies ToolSet;
