# Feature: Competitor Intelligence

> Analyze competitor sites and suggest experiments based on their strategies

## Overview

Allow users to input competitor URLs. The copilot crawls the page (using Firecrawl), analyzes their UX patterns, messaging, and conversion strategies, then suggests experiments to test similar approaches.

## User Story

As a product manager, I want to analyze competitor landing pages so that I can identify successful patterns to test on my own site.

## Technical Approach

### Existing Infrastructure

We already have `crawlWebsite` tool using Firecrawl:

```typescript
// Current tool definition
{
  name: "crawlWebsite",
  description: "Capture screenshot and extract content from a website",
  parameters: {
    url: { type: "string", description: "URL to crawl" },
    formats: { type: "array", items: { type: "string" } }, // screenshot, markdown, html, links
  },
}
```

### Enhanced Competitor Analysis Tool

```typescript
// lib/ai/tools/analyze-competitor.ts
export const analyzeCompetitorTool = createTool({
  name: "analyzeCompetitor",
  description: "Analyze a competitor's website and suggest A/B tests based on their strategies",
  parameters: z.object({
    competitorUrl: z.string().url().describe("Competitor website URL"),
    focusAreas: z.array(z.enum([
      'pricing',
      'cta',
      'hero',
      'social-proof',
      'navigation',
      'forms',
      'messaging'
    ])).optional().describe("Specific areas to focus analysis on"),
    yourPageUrl: z.string().url().optional().describe("Your equivalent page for comparison"),
  }),
  execute: async ({ competitorUrl, focusAreas, yourPageUrl }) => {
    // 1. Crawl competitor
    const competitorData = await firecrawl.scrape({
      url: competitorUrl,
      formats: ['screenshot', 'markdown', 'links'],
    });

    // 2. Optionally crawl your page for comparison
    let yourData = null;
    if (yourPageUrl) {
      yourData = await firecrawl.scrape({
        url: yourPageUrl,
        formats: ['screenshot', 'markdown'],
      });
    }

    return {
      competitor: {
        url: competitorUrl,
        screenshot: competitorData.screenshot,
        content: competitorData.markdown,
        links: competitorData.links,
      },
      yours: yourData ? {
        url: yourPageUrl,
        screenshot: yourData.screenshot,
        content: yourData.markdown,
      } : null,
      focusAreas: focusAreas || ['all'],
    };
  },
});
```

### Comparison UI Component

```tsx
// components/tool-results/competitor-analysis.tsx
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function CompetitorAnalysisResult({ input, output }) {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Competitor Analysis</h3>
        <Badge variant="secondary">{input.focusAreas?.join(', ') || 'Full Analysis'}</Badge>
      </div>

      <Tabs defaultValue="screenshots" className="w-full">
        <TabsList>
          <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="experiments">Suggested Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="screenshots">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-2">
              <p className="text-xs text-muted-foreground mb-2">Competitor</p>
              <img src={output.competitor.screenshot} alt="Competitor" className="rounded-md" />
              <p className="text-xs mt-1 truncate">{input.competitorUrl}</p>
            </Card>
            {output.yours && (
              <Card className="p-2">
                <p className="text-xs text-muted-foreground mb-2">Your Page</p>
                <img src={output.yours.screenshot} alt="Yours" className="rounded-md" />
                <p className="text-xs mt-1 truncate">{input.yourPageUrl}</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="insights">
          {/* AI-generated insights appear in chat */}
          <p className="text-sm text-muted-foreground">See chat for detailed analysis</p>
        </TabsContent>

        <TabsContent value="experiments">
          {/* List of suggested experiments with "Create" buttons */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### System Prompt for Analysis

```typescript
const COMPETITOR_ANALYSIS_PROMPT = `
When analyzing competitor websites:

## Analysis Framework

### 1. Value Proposition
- What's their main headline/claim?
- What benefits do they emphasize?
- What differentiators do they highlight?

### 2. Trust Signals
- Social proof (logos, testimonials, reviews)
- Security badges
- Case studies / numbers

### 3. Conversion Elements
- CTA text, color, placement
- Form length and fields
- Pricing presentation
- Urgency/scarcity tactics

### 4. User Experience
- Navigation structure
- Content hierarchy
- Mobile responsiveness (if visible)

## Output Format

1. **Key Observations**: 3-5 notable patterns
2. **What They Do Well**: Strengths to consider adopting
3. **Potential Weaknesses**: Opportunities for differentiation
4. **Experiment Ideas**: Specific tests inspired by their approach

For each experiment idea, include:
- Hypothesis based on competitor observation
- Specific change to test
- Expected impact
- Offer to create the experiment in PostHog
`;
```

## UX Flow

### Basic Flow
1. User: "Analyze competitor.com and suggest tests"
2. Copilot calls `crawlWebsite` on competitor URL
3. Shows screenshot + content extraction
4. AI provides analysis with 4-5 experiment ideas
5. User selects one, copilot creates PostHog experiment

### Comparison Flow
1. User: "Compare competitor.com to our /pricing page"
2. Copilot crawls both URLs
3. Shows side-by-side screenshot comparison
4. AI highlights differences and opportunities
5. Suggests experiments based on gaps

## Demo Script

1. **User**: "Analyze notion.so and suggest experiments for our landing page"
2. **Copilot**: Captures screenshot, extracts content
3. **Analysis**:
   - "Notion uses a minimal hero with clear value prop: 'The connected workspace'"
   - "Strong social proof: 'Trusted by teams at' with logos"
   - "CTA is high-contrast with action verb: 'Get Notion free'"
4. **Suggestions**:
   - Test minimal headline vs current
   - Add customer logos section
   - A/B test CTA copy variations
5. **User**: "Create experiment for the CTA copy test"
6. **Copilot**: Creates PostHog experiment with variants

## Implementation Checklist

- [ ] Enhance `crawlWebsite` tool to support comparison mode
- [ ] Create `CompetitorAnalysisResult` component
- [ ] Add side-by-side screenshot comparison UI
- [ ] Add system prompt for competitor analysis
- [ ] Create "Compare to" quick action
- [ ] Add experiment suggestion cards with "Create" buttons
- [ ] Cache competitor screenshots (avoid re-crawling)

## Privacy & Ethics

- Only crawl publicly accessible pages
- Don't store competitor data long-term
- Clearly label screenshots as "captured for analysis"
- Rate limit crawling to respect robots.txt

## Dependencies

- Firecrawl (existing integration)
- PostHog MCP (existing integration)

## Estimated Effort

**Medium** - Builds on existing crawl tool, needs UI enhancements.

## Related Features

- Screenshot to Experiment (Feature #2)
- Natural Language Analytics (Feature #5)
