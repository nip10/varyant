import { tool, ToolSet } from "ai";
import { z } from "zod";
import { triggerWorkflowDispatch } from "@/lib/integrations/github";

export const githubTools = {
  triggerFeatureDevelopment: tool({
    description: "Trigger a feature development workflow",
    inputSchema: z.object({
      feature: z.string().describe("The feature to develop"),
    }),
    execute: async ({ feature }) => {
      const data = await triggerWorkflowDispatch({ inputs: { feature } });
      return data;
    },
    needsApproval: true,
  }),
} satisfies ToolSet;
