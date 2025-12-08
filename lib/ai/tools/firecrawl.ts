import { tool, ToolSet } from "ai";
import { z } from "zod";
import { crawlWebsite } from "@/lib/integrations/firecrawl";

export const firecrawlTools = {
  crawlWebsite: tool({
    description:
      "Crawl a website and return the results in the specified formats",
    inputSchema: z.object({
      url: z
        .string()
        .default("https://taxpal-zeta.vercel.app")
        .describe("The URL of the website to crawl"),
      formats: z
        .array(
          z.enum([
            "markdown",
            "html",
            "rawHtml",
            "links",
            "images",
            "screenshot",
            "summary",
            "changeTracking",
            "json",
            "attributes",
            "branding",
          ])
        )
        .optional()
        .default(["screenshot"])
        .describe("The formats to return the results in"),
    }),
    outputSchema: z.object({
      screenshotUrl: z.url().describe("The URL of the screenshot"),
    }),
    execute: async ({ url, formats }) => {
      const response = await crawlWebsite(url, formats);
      return { screenshotUrl: response?.screenshot };
    },
    needsApproval: true,
  }),
} satisfies ToolSet;
