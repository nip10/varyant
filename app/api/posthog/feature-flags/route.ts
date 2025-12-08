import { NextRequest, NextResponse } from "next/server";

import {
  createFeatureFlag,
  CreateFeatureFlagInput,
} from "@/lib/integrations/posthog";

export async function POST(req: NextRequest) {
  console.log("PostHog create feature flag request received");
  const body = await req.json();
  console.log("Body", body);
  const { featureFlagKey, numVariants } = body as CreateFeatureFlagInput;
  if (!featureFlagKey || !numVariants) {
    return NextResponse.json(
      { error: "Feature flag key and number of variants are required" },
      { status: 400 }
    );
  }
  try {
    const data = await createFeatureFlag(body);
    console.log("Data", data);
    return NextResponse.json({ featureFlagKey: data.featureFlagKey });
  } catch (error) {
    console.error("PostHog create feature flag error", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create feature flag" },
      { status: 500 }
    );
  }
}
