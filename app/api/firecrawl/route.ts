import type { FormatOption } from "@mendable/firecrawl-js";
import { NextRequest, NextResponse } from "next/server";
import { crawlWebsite } from "@/lib/integrations/firecrawl";

export async function POST(req: NextRequest) {
  console.log("Firecrawl request received");
  const { url, formats }: { url: string; formats: FormatOption[] } =
    await req.json();
  console.log("Firecrawl request", { url, formats });
  const response = await crawlWebsite(url, formats);
  console.log("Firecrawl response", response);
  return NextResponse.json({ data: response });
}
