import { tool, ToolSet } from "ai";
import { z } from "zod";
import { triggerWorkflowDispatch } from "@/lib/integrations/github";

export const githubTools = {
  triggerFeatureDevelopment: tool({
    description: "Trigger a feature development workflow",
    inputSchema: z.object({
      feature: z.string().describe("The feature to develop"),
      ref: z.string().optional().default("main").describe("The git ref (branch/tag) to run the workflow on"),
    }),
    execute: async ({ feature, ref }) => {
      const result = await triggerWorkflowDispatch({ inputs: { feature }, ref });
      return result;
    },
    needsApproval: true,
  }),
} satisfies ToolSet;
