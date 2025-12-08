import { tool, ToolSet } from "ai";
import { z } from "zod";
import {
  createLinearIssue as createLinearIssueIntegration,
  updateLinearIssue as updateLinearIssueIntegration,
} from "@/lib/integrations/linear";

export const linearTools = {
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
      const data = await createLinearIssueIntegration(input);
      return data;
    },
    needsApproval: true,
  }),
  updateLinearIssue: tool({
    description: "Update a Linear issue",
    inputSchema: z.object({
      issueId: z.string().describe("The ID of the issue to update"),
      status: z
        .enum(["backlog", "todo", "in_progress", "in_review", "done"])
        .describe("The status of the issue"),
    }),
    outputSchema: z.object({
      id: z.string().describe("The ID of the issue"),
      identifier: z.string().describe("The identifier of the issue"),
      url: z.url().describe("The URL of the issue"),
      title: z.string().describe("The title of the issue"),
      state: z.string().describe("The state of the issue"),
    }),
    execute: async (input) => {
      const data = await updateLinearIssueIntegration(input);
      return data;
    },
    needsApproval: true,
  }),
} satisfies ToolSet;
