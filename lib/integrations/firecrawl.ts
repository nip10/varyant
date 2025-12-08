import Firecrawl, { type FormatOption } from "@mendable/firecrawl-js";
import { env } from "../config/env";

const firecrawl = new Firecrawl({ apiKey: env.FIRECRAWL_API_KEY });

export const crawlWebsite = async (
  url: string,
  formats: FormatOption[] = ["screenshot"]
) => {
  const crawlResponse = await firecrawl.scrape(url, {
    formats,
  });

  return crawlResponse;
};
