import { env } from "@/lib/config/env";

const githubApiBase = "https://api.github.com";

const repoParts = () => {
  const [owner, repo] = env.GITHUB_REPO.split("/");
  if (!owner || !repo) throw new Error("GITHUB_REPO must be in the form owner/repo");
  return { owner, repo };
};

const defaultHeaders = {
  Authorization: `Bearer ${env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "Content-Type": "application/json",
};

export const readRepoFile = async ({
  path,
  ref = "main",
}: {
  path: string;
  ref?: string;
}) => {
  const { owner, repo } = repoParts();
  const res = await fetch(
    `${githubApiBase}/repos/${owner}/${repo}/contents/${path}?ref=${ref}`,
    {
      headers: defaultHeaders,
    },
  );

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`GitHub read file failed: ${res.status} ${message}`);
  }

  return res.json();
};

type DispatchInput = {
  workflowId?: string;
  ref?: string;
  inputs?: Record<string, unknown>;
};

export const triggerWorkflowDispatch = async ({
  workflowId,
  ref = "main",
  inputs = {},
}: DispatchInput) => {
  const { owner, repo } = repoParts();
  const id = workflowId ?? env.GITHUB_WORKFLOW_ID;

  if (!id) {
    throw new Error("workflowId or GITHUB_WORKFLOW_ID is required");
  }

  const res = await fetch(
    `${githubApiBase}/repos/${owner}/${repo}/actions/workflows/${id}/dispatches`,
    {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({ ref, inputs }),
    },
  );

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`GitHub workflow dispatch failed: ${res.status} ${message}`);
  }

  return { status: "dispatched", workflowId: id };
};

