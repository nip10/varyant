import { NextRequest, NextResponse } from "next/server";

import {
  createExperiment,
  CreateExperimentInput,
  listExperiments,
} from "@/lib/integrations/posthog";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") || undefined;

  try {
    const data = await listExperiments(status);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("PostHog experiments list error", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to list experiments" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  console.log("PostHog create experiment request received");
  const body = await req.json();
  console.log("Body", body);
  const { name, featureFlagKey } = body as CreateExperimentInput;
  if (!name || !featureFlagKey) {
    return NextResponse.json(
      { error: "Name and feature flag key are required" },
      { status: 400 }
    );
  }
  try {
    const data = await createExperiment(body);
    console.log("Data", data);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("PostHog create experiment error", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create experiment" },
      { status: 500 }
    );
  }
}
