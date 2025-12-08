import { NextRequest, NextResponse } from "next/server";

import {
  readRepoFile,
  triggerWorkflowDispatch,
} from "@/lib/integrations/github";

export async function POST(req: NextRequest) {
  const { action, path, ref, workflowId, inputs } = await req.json();

  try {
    if (action === "readFile") {
      if (!path) {
        return NextResponse.json(
          { error: "path is required" },
          { status: 400 }
        );
      }
      const data = await readRepoFile({ path, ref });
      return NextResponse.json({ data });
    }

    if (action === "dispatchWorkflow") {
      const data = await triggerWorkflowDispatch({ workflowId, ref, inputs });
      return NextResponse.json({ data });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    console.error("GitHub API error", error);
    return NextResponse.json(
      { error: (error as Error).message || "GitHub request failed" },
      { status: 500 }
    );
  }
}
