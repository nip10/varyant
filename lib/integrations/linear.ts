import { LinearClient } from "@linear/sdk";
import { env } from "../config/env";

const client = new LinearClient({ apiKey: env.LINEAR_API_KEY });

export type CreateIssueInput = {
  title: string;
  description: string;
  teamId?: string;
  projectId?: string;
  priority?: number;
  labelIds?: string[];
};

export const createLinearIssue = async (input: CreateIssueInput) => {
  const payload = {
    ...input,
    teamId: input.teamId ?? env.LINEAR_TEAM_ID,
  };
  const response = await client.createIssue(payload);
  if (!response.success || !response.issue) {
    throw new Error("Failed to create Linear issue");
  }

  const issue = await response.issue;

  return {
    id: issue.id,
    identifier: issue.identifier,
    url: issue.url,
    title: issue.title,
  };
};

type UpdateIssueInput = {
  issueId: string;
  status: "backlog" | "todo" | "in_progress" | "in_review" | "done";
};

const LINEAR_STATUS_MAP = {
  backlog: "baf202fd-ef5f-48e0-9432-598c2b2e68df",
  todo: "d8004c6e-00be-43fe-8a3a-6834d517afbe",
  in_progress: "f35f9472-8ea1-4acc-9a7b-06a0a87e1d12",
  in_review: "a03ad812-05a8-4436-9413-d449acb99719",
  done: "7f5234f2-dcbd-4c8b-9a86-57c60cef48a0",
} as const;

export const updateLinearIssue = async ({
  issueId,
  status,
}: UpdateIssueInput) => {
  if (!LINEAR_STATUS_MAP[status]) {
    throw new Error("Invalid status");
  }

  const response = await client.updateIssue(issueId, {
    stateId: LINEAR_STATUS_MAP[status],
  });

  if (!response.success) {
    throw new Error("Failed to update Linear issue");
  }

  const issue = await client.issue(issueId);
  const state = issue.state ? await issue.state : null;

  return {
    id: issue.id,
    identifier: issue.identifier,
    url: issue.url,
    title: issue.title,
    state: state?.name,
  };
};
