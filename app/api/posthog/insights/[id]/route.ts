import { NextRequest, NextResponse } from "next/server";

import { getInsightById } from "@/lib/integrations/posthog";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Insight ID is required" },
      { status: 400 }
    );
  }
  try {
    const data = await getInsightById(id);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("PostHog experiments list error", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to list experiments" },
      { status: 500 }
    );
  }
}
