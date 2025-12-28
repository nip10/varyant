import { tool, ToolSet } from "ai";
import { z } from "zod";
import { crawlWebsite } from "@/lib/integrations/firecrawl";

const FOCUS_AREAS = [
  "pricing",
  "cta",
  "hero",
  "social-proof",
  "navigation",
  "forms",
  "messaging",
] as const;

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
      screenshotUrl: z.string().url().optional(),
      markdown: z.string().optional(),
      html: z.string().optional(),
      rawHtml: z.string().optional(),
      links: z.array(z.string()).optional(),
      images: z.array(z.string()).optional(),
      summary: z.string().optional(),
      metadata: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          url: z.string().optional(),
          language: z.string().optional(),
          keywords: z.union([z.string(), z.array(z.string())]).optional(),
          ogTitle: z.string().optional(),
          ogDescription: z.string().optional(),
          ogImage: z.string().optional(),
          sourceURL: z.string().optional(),
          statusCode: z.number().optional(),
        })
        .optional(),
    }),
    execute: async ({ url, formats }) => {
      const response = await crawlWebsite(url, formats);
      return {
        screenshotUrl: response?.screenshot,
        markdown: response?.markdown,
        html: response?.html,
        rawHtml: response?.rawHtml,
        links: response?.links,
        images: response?.images,
        summary: response?.summary,
        metadata: response?.metadata
          ? {
              title: response.metadata.title,
              description: response.metadata.description,
              url: response.metadata.url,
              language: response.metadata.language,
              keywords: response.metadata.keywords,
              ogTitle: response.metadata.ogTitle,
              ogDescription: response.metadata.ogDescription,
              ogImage: response.metadata.ogImage,
              sourceURL: response.metadata.sourceURL,
              statusCode: response.metadata.statusCode,
            }
          : undefined,
      };
    },
    needsApproval: true,
  }),

  analyzeCompetitor: tool({
    description: `Analyze a competitor's website and suggest A/B test ideas based on their strategies.

This tool crawls the competitor page (and optionally your page for comparison) and extracts:
- Screenshots for visual comparison
- Page content and structure
- Metadata (title, description, etc.)

The AI will then analyze patterns in:
- Value proposition and messaging
- Call-to-action design and placement
- Social proof elements
- Pricing presentation
- User experience patterns

And suggest specific experiments you can run on your own site.`,
    inputSchema: z.object({
      competitorUrl: z.string().url().describe("The competitor website URL to analyze"),
      yourPageUrl: z
        .string()
        .url()
        .optional()
        .describe("Your equivalent page URL for side-by-side comparison"),
      focusAreas: z
        .array(z.enum(FOCUS_AREAS))
        .optional()
        .describe("Specific areas to focus the analysis on"),
    }),
    outputSchema: z.object({
      competitor: z.object({
        url: z.string(),
        screenshotUrl: z.string().optional(),
        title: z.string().optional(),
        description: z.string().optional(),
        content: z.string().optional(),
      }),
      yours: z
        .object({
          url: z.string(),
          screenshotUrl: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          content: z.string().optional(),
        })
        .nullable(),
      focusAreas: z.array(z.string()),
      analysisContext: z.string(),
    }),
    execute: async ({ competitorUrl, yourPageUrl, focusAreas }) => {
      // Crawl competitor page
      const competitorData = await crawlWebsite(competitorUrl, [
        "screenshot",
        "markdown",
        "summary",
      ]);

      // Optionally crawl your page for comparison
      let yourData = null;
      if (yourPageUrl) {
        yourData = await crawlWebsite(yourPageUrl, ["screenshot", "markdown", "summary"]);
      }

      // Build analysis context for the AI
      const areas = focusAreas || ["all"];
      const analysisContext = `
Analyze the competitor's website with focus on: ${areas.join(", ")}.

Competitor: ${competitorUrl}
${competitorData?.metadata?.title ? `Title: ${competitorData.metadata.title}` : ""}
${competitorData?.metadata?.description ? `Description: ${competitorData.metadata.description}` : ""}

${yourPageUrl ? `Compare against: ${yourPageUrl}` : ""}

Provide:
1. Key observations about their approach
2. What they do well that could be tested
3. Potential weaknesses to differentiate on
4. 3-5 specific experiment ideas with hypotheses
      `.trim();

      return {
        competitor: {
          url: competitorUrl,
          screenshotUrl: competitorData?.screenshot,
          title: competitorData?.metadata?.title,
          description: competitorData?.metadata?.description,
          content: competitorData?.summary || competitorData?.markdown?.substring(0, 2000),
        },
        yours: yourData
          ? {
              url: yourPageUrl!,
              screenshotUrl: yourData.screenshot,
              title: yourData.metadata?.title,
              description: yourData.metadata?.description,
              content: yourData.summary || yourData.markdown?.substring(0, 2000),
            }
          : null,
        focusAreas: areas,
        analysisContext,
      };
    },
    needsApproval: true,
  }),
} satisfies ToolSet;
