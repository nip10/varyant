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
  console.log("Create linear issue input", input);
  const payload = {
    ...input,
    teamId: input.teamId ?? env.LINEAR_TEAM_ID,
  };
  console.log("Create linear issue payload", payload);
  const response = await client.createIssue(payload);
  console.log("Create linear issue response", response);
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
  title?: string;
  description?: string;
  stateId?: string;
  priority?: number;
  labelIds?: string[];
};

export const updateLinearIssue = async ({
  issueId,
  ...input
}: UpdateIssueInput) => {
  const response = await client.updateIssue(issueId, input);

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
