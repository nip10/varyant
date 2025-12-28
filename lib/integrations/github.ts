import { env } from "@/lib/config/env";

const githubApiBase = "https://api.github.com";

const repoParts = () => {
  const [owner, repo] = env.GITHUB_REPO.split("/");
  if (!owner || !repo)
    throw new Error("GITHUB_REPO must be in the form owner/repo");
  return { owner, repo };
};

const defaultHeaders = {
  Authorization: `Bearer ${env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "Content-Type": "application/json",
};

type DispatchInput = {
  workflowId?: string;
  inputs: {
    feature: string;
  };
  ref?: string;
};

export const triggerWorkflowDispatch = async ({
  workflowId,
  ref = "main",
  inputs = {
    feature: "add a CSV export endpoint",
  },
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
    }
  );

  if (!res.ok) {
    const message = await res.text();
    throw new Error(
      `GitHub workflow dispatch failed: ${res.status} ${message}`
    );
  }

  return {
    status: "dispatched",
    workflowId: id,
    repo: `${owner}/${repo}`,
    ref,
    workflowUrl: `https://github.com/${owner}/${repo}/actions/workflows/${id}`,
  };
};
