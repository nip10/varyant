import { NextRequest, NextResponse } from "next/server";

import {
  CreateIssueInput,
  createLinearIssue,
  updateLinearIssue,
} from "@/lib/integrations/linear";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as CreateIssueInput;

  try {
    const data = await createLinearIssue(body);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Linear create error", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create Linear issue" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { issueId, ...rest } = await req.json();

  if (!issueId) {
    return NextResponse.json({ error: "issueId is required" }, { status: 400 });
  }

  try {
    const data = await updateLinearIssue({ issueId, ...rest });
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Linear update error", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update Linear issue" },
      { status: 500 }
    );
  }
}
