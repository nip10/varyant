# Feature: AI Experiment Analyst

> AI interprets experiment results and suggests data-driven next steps

## Overview

When viewing experiment results, the AI provides intelligent analysis: interpreting statistical significance, identifying patterns, warning about potential issues, and recommending whether to ship, iterate, or roll back.

## User Story

As a product manager, I want the AI to help me understand experiment results so that I can make confident decisions without being a statistics expert.

## Technical Approach

### Analysis Prompt System

```typescript
// lib/ai/prompts/experiment-analyst.ts
export const EXPERIMENT_ANALYST_PROMPT = `
You are an expert A/B testing analyst. When analyzing experiment results:

## Analysis Framework

### 1. Statistical Validity
- Check sample size adequacy (minimum 100 per variant recommended)
- Assess statistical significance (target: 95%+)
- Look for p-hacking risks (multiple metrics, early peeking)
- Consider practical significance vs statistical significance

### 2. Result Interpretation
- Explain what the numbers mean in plain English
- Calculate confidence intervals
- Identify the winning variant (if any)
- Quantify the impact in business terms

### 3. Risk Assessment
- Sample Ratio Mismatch (SRM): Are variants balanced?
- Novelty effects: Could results change over time?
- Segment skew: Are results consistent across segments?
- External factors: Seasonality, promotions, etc.

### 4. Recommendations
Based on results, recommend ONE of:
- **SHIP**: High confidence in positive result
- **ITERATE**: Promising signal, test refined hypothesis
- **END**: No significant difference, try different approach
- **WAIT**: Insufficient data, continue running
- **INVESTIGATE**: Anomalies detected, review implementation

## Output Format

### Quick Summary (2-3 sentences)
Plain English interpretation for executives.

### Detailed Analysis
- Current state (running/significant/concluded)
- Conversion rates with confidence intervals
- Statistical significance level
- Sample size adequacy

### Risks & Caveats
- Any issues detected
- Assumptions made
- Limitations of analysis

### Recommendation
- Clear action with rationale
- If SHIP: Expected impact at scale
- If WAIT: Estimated time to significance
- If ITERATE: Suggested refinements

### Follow-up Questions
Offer to explore:
- Segment breakdown (device, geography, user type)
- Metric deep-dive (secondary metrics)
- Historical comparison
`;
```

### Enhanced Experiment Tool

```typescript
// lib/ai/tools/analyze-experiment.ts
export const analyzeExperimentTool = createTool({
  name: "analyzeExperiment",
  description: "Get AI-powered analysis of experiment results with recommendations",
  parameters: z.object({
    experimentId: z.string().describe("PostHog experiment ID"),
    includeSegments: z.boolean().optional().describe("Include segment breakdown"),
    compareToBaseline: z.boolean().optional().describe("Compare to historical baseline"),
  }),
  execute: async ({ experimentId, includeSegments, compareToBaseline }) => {
    // 1. Fetch experiment data from PostHog
    const experiment = await posthog.getExperiment(experimentId);
    const results = await posthog.getExperimentResults(experimentId);

    // 2. Fetch segment data if requested
    let segments = null;
    if (includeSegments) {
      segments = await posthog.getExperimentResultsBySegment(experimentId);
    }

    // 3. Fetch historical baseline if requested
    let baseline = null;
    if (compareToBaseline) {
      baseline = await posthog.getBaselineMetrics(experiment.metric);
    }

    // 4. Calculate additional statistics
    const stats = calculateExperimentStats(results);

    return {
      experiment,
      results,
      segments,
      baseline,
      stats: {
        sampleSize: stats.totalParticipants,
        controlRate: stats.controlConversionRate,
        testRate: stats.testConversionRate,
        relativeUplift: stats.uplift,
        confidenceInterval: stats.ci,
        statisticalPower: stats.power,
        pValue: stats.pValue,
        srmCheck: stats.srmPValue, // Sample Ratio Mismatch check
      },
    };
  },
});
```

### Analysis Result Component

```tsx
// components/tool-results/experiment-analysis.tsx
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  CheckCircleIcon, AlertTriangleIcon, XCircleIcon,
  ClockIcon, SearchIcon, TrendingUpIcon
} from 'lucide-react';

type Recommendation = 'SHIP' | 'ITERATE' | 'END' | 'WAIT' | 'INVESTIGATE';

const recommendationConfig: Record<Recommendation, { icon: typeof CheckCircleIcon; color: string; label: string }> = {
  SHIP: { icon: CheckCircleIcon, color: 'text-green-500', label: 'Ship It!' },
  ITERATE: { icon: TrendingUpIcon, color: 'text-blue-500', label: 'Iterate' },
  END: { icon: XCircleIcon, color: 'text-red-500', label: 'End Test' },
  WAIT: { icon: ClockIcon, color: 'text-yellow-500', label: 'Keep Running' },
  INVESTIGATE: { icon: SearchIcon, color: 'text-orange-500', label: 'Investigate' },
};

export function ExperimentAnalysisResult({ input, output }) {
  const { experiment, results, stats } = output;

  // AI determines recommendation based on stats
  const recommendation = deriveRecommendation(stats);
  const config = recommendationConfig[recommendation];
  const Icon = config.icon;

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{experiment.name}</h3>
        <Badge variant="outline" className={config.color}>
          <Icon className="size-3 mr-1" />
          {config.label}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Sample Size"
          value={stats.sampleSize.toLocaleString()}
          status={stats.sampleSize >= 1000 ? 'good' : stats.sampleSize >= 100 ? 'warning' : 'bad'}
        />
        <StatCard
          label="Significance"
          value={`${((1 - stats.pValue) * 100).toFixed(1)}%`}
          status={stats.pValue <= 0.05 ? 'good' : stats.pValue <= 0.1 ? 'warning' : 'neutral'}
        />
        <StatCard
          label="Uplift"
          value={`${stats.relativeUplift > 0 ? '+' : ''}${stats.relativeUplift.toFixed(1)}%`}
          status={stats.relativeUplift > 0 ? 'good' : stats.relativeUplift < -5 ? 'bad' : 'neutral'}
        />
      </div>

      {/* Variant Comparison */}
      <Card className="p-3">
        <div className="space-y-2">
          <VariantRow
            name="Control"
            rate={stats.controlRate}
            ci={stats.controlCI}
          />
          <VariantRow
            name="Test"
            rate={stats.testRate}
            ci={stats.testCI}
            highlight={stats.testRate > stats.controlRate}
          />
        </div>
      </Card>

      {/* Warnings */}
      {stats.srmPValue < 0.01 && (
        <Alert variant="destructive">
          <AlertTriangleIcon className="size-4" />
          <AlertTitle>Sample Ratio Mismatch Detected</AlertTitle>
          <AlertDescription>
            Traffic split is uneven ({stats.controlPct}% / {stats.testPct}%).
            This may indicate an implementation bug.
          </AlertDescription>
        </Alert>
      )}

      {/* AI Summary - rendered in chat as markdown */}
      <div className="text-sm text-muted-foreground">
        See AI analysis above for detailed interpretation and recommendations.
      </div>
    </div>
  );
}

function StatCard({ label, value, status }) {
  const statusColors = {
    good: 'text-green-600 bg-green-50 dark:bg-green-950/20',
    warning: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20',
    bad: 'text-red-600 bg-red-50 dark:bg-red-950/20',
    neutral: 'text-gray-600 bg-gray-50 dark:bg-gray-950/20',
  };

  return (
    <Card className={`p-2 ${statusColors[status]}`}>
      <p className="text-xs opacity-70">{label}</p>
      <p className="font-bold text-lg">{value}</p>
    </Card>
  );
}

function VariantRow({ name, rate, ci, highlight = false }) {
  return (
    <div className={`flex justify-between items-center p-2 rounded ${highlight ? 'bg-green-50 dark:bg-green-950/20' : ''}`}>
      <span className="font-medium">{name}</span>
      <div className="text-right">
        <span className="font-bold">{rate.toFixed(2)}%</span>
        <span className="text-xs text-muted-foreground ml-2">
          [{ci[0].toFixed(2)}%, {ci[1].toFixed(2)}%]
        </span>
      </div>
    </div>
  );
}
```

## AI Analysis Output Example

```markdown
## Quick Summary
Your checkout flow test is showing strong results! The simplified form variant
has a **+15.2% higher conversion rate** with 97.3% statistical confidence.
This translates to approximately **$42,000 in additional monthly revenue**.

## Detailed Analysis

### Current State
- **Status**: Significant result (97.3% confidence)
- **Duration**: 14 days
- **Sample Size**: 12,456 participants (adequate)

### Conversion Rates
| Variant | Rate | 95% CI | Participants |
|---------|------|--------|--------------|
| Control (3-step form) | 3.21% | [2.89%, 3.53%] | 6,234 |
| Test (single page) | 3.70% | [3.36%, 4.04%] | 6,222 |

**Relative Uplift**: +15.2% [+4.8%, +25.9%]

### Statistical Validity
✅ Sample size is adequate (>1000 per variant)
✅ Traffic split is balanced (50.0% / 50.0%)
✅ Statistical significance reached (p=0.027)
⚠️ Consider: 14 days may not capture weekly seasonality

## Risks & Caveats
1. **Novelty Effect**: Monitor for 7 more days to ensure persistence
2. **Mobile vs Desktop**: Mobile shows +22%, desktop only +8%
3. **Power Users**: Segment shows power users neutral; new users +25%

## Recommendation: 🚀 SHIP

**Rationale**: High confidence result with significant business impact.
The confidence interval is entirely positive [+4.8%, +25.9%].

**Expected Impact at Scale**:
- Conversions: +450/month
- Revenue: +$42,000/month (assuming $93 AOV)

**Suggested Rollout**:
1. Roll out to 100% of new users immediately
2. Monitor power user segment for 7 more days
3. Create follow-up test for desktop-specific optimization

---

*Would you like me to:*
- [ ] Create a follow-up experiment for desktop users?
- [ ] Generate a summary for stakeholders?
- [ ] Show the segment breakdown in detail?
```

## UX Flow

1. User: "Analyze experiment pricing-page-v2"
2. Tool fetches experiment data from PostHog
3. AI processes data with analyst prompt
4. Returns structured analysis + visual component
5. Offers follow-up actions (segment breakdown, stakeholder summary, follow-up test)

## Demo Script

1. **User**: "How is the checkout experiment doing?"
2. **AI**: Shows experiment analysis component
3. **Analysis**: "Strong positive result! +15% conversion lift with 97% confidence."
4. **Recommendation**: "I recommend shipping this. Expected +$42K/month."
5. **User**: "Create a summary for the team"
6. **AI**: Generates Slack-ready summary with key metrics
7. **User**: "Ship it"
8. **AI**: Updates experiment status, creates Linear ticket for rollout

## Implementation Checklist

- [ ] Create `analyzeExperiment` tool
- [ ] Write experiment analyst prompt
- [ ] Build analysis result component
- [ ] Add statistical calculation utilities
- [ ] Implement recommendation derivation logic
- [ ] Add SRM detection
- [ ] Create segment breakdown view
- [ ] Add stakeholder summary generation
- [ ] Test with various experiment states

## Dependencies

- PostHog MCP (existing)
- AI SDK for analysis generation

## Estimated Effort

**Medium** - Statistical logic + comprehensive prompting.

## Related Features

- Live Experiment Dashboard (Feature #4)
- Natural Language Analytics (Feature #5)
