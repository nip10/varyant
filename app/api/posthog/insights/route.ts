import { NextRequest, NextResponse } from "next/server";

import { getInsights } from "@/lib/integrations/posthog";

export async function GET(req: NextRequest) {
  try {
    const data = await getInsights();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to list insights" },
      { status: 500 }
    );
  }
}
