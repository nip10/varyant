import { NextRequest, NextResponse } from "next/server";

import { getEventCount, runHogQL } from "@/lib/integrations/posthog";

export async function POST(req: NextRequest) {
  const {
    name,
    hogql,
    event,
    dateRange,
  }: { name: string; hogql: string; event: string; dateRange: string } =
    await req.json();

  if (!hogql && !event) {
    return NextResponse.json(
      { error: "Provide either hogql or event" },
      { status: 400 }
    );
  }

  try {
    const data = hogql
      ? await runHogQL(name, hogql)
      : await getEventCount(event, dateRange);
    return NextResponse.json({ data });
  } catch (error) {
    console.error("PostHog query error", error);
    return NextResponse.json(
      { error: (error as Error).message || "PostHog query failed" },
      { status: 500 }
    );
  }
}
