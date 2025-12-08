import { NextRequest, NextResponse } from "next/server";

import { getExperiment } from "@/lib/integrations/posthog";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json(
      { error: "Experiment ID is required" },
      { status: 400 }
    );
  }
  try {
    const data = await getExperiment(id);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("PostHog experiment fetch error", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to fetch experiment" },
      { status: 500 }
    );
  }
}
