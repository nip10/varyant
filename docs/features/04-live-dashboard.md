# Feature: Live Experiment Dashboard

> Real-time streaming experiment results with auto-updating metrics

## Overview

Display live experiment results in the chat interface with real-time updates. As users watch, metrics update, significance levels change, and the AI provides running commentary on experiment health.

## User Story

As a product manager running an experiment, I want to see real-time results directly in the copilot so that I can make faster decisions without switching between tools.

## Technical Approach

### AI SDK Streaming with useObject

Use the AI SDK's `useObject` hook for streaming structured data:

```typescript
// lib/hooks/use-experiment-stream.ts
import { useObject } from '@ai-sdk/react';
import { experimentSchema } from './schemas';

export function useExperimentStream(experimentId: string) {
  const { object, isLoading, error } = useObject({
    api: '/api/experiment-stream',
    schema: experimentSchema,
    id: experimentId,
  });

  return {
    experiment: object,
    isLoading,
    error,
  };
}
```

### Polling with React Query + PostHog MCP

For real-time updates, poll the PostHog MCP:

```typescript
// lib/hooks/use-live-experiment.ts
import { useQuery } from '@tanstack/react-query';

interface ExperimentResults {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'draft';
  variants: {
    key: string;
    name: string;
    participants: number;
    conversions: number;
    conversionRate: number;
    improvement: number;
    significance: number;
  }[];
  lastUpdated: Date;
}

export function useLiveExperiment(experimentId: string, enabled = true) {
  return useQuery({
    queryKey: ['experiment', experimentId, 'live'],
    queryFn: async () => {
      const response = await fetch(`/api/experiments/${experimentId}/results`);
      return response.json() as Promise<ExperimentResults>;
    },
    refetchInterval: enabled ? 10000 : false, // Poll every 10 seconds
    enabled,
  });
}
```

### Live Dashboard Component

```tsx
// components/tool-results/live-experiment-dashboard.tsx
import { useLiveExperiment } from '@/lib/hooks/use-live-experiment';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUpIcon, TrendingDownIcon, ActivityIcon, RefreshCwIcon } from 'lucide-react';

interface LiveExperimentDashboardProps {
  experimentId: string;
  showAICommentary?: boolean;
}

export function LiveExperimentDashboard({ experimentId, showAICommentary = true }: LiveExperimentDashboardProps) {
  const { data: experiment, isLoading, dataUpdatedAt } = useLiveExperiment(experimentId);

  if (isLoading || !experiment) {
    return <LiveDashboardSkeleton />;
  }

  const controlVariant = experiment.variants.find(v => v.key === 'control');
  const testVariant = experiment.variants.find(v => v.key !== 'control');

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{experiment.name}</h3>
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={experiment.status === 'running' ? 'default' : 'secondary'}>
            <ActivityIcon className="size-3 mr-1 animate-pulse" />
            {experiment.status}
          </Badge>
          <RefreshCwIcon className="size-4 text-muted-foreground animate-spin" />
        </div>
      </div>

      {/* Variant Comparison */}
      <div className="grid grid-cols-2 gap-4">
        {experiment.variants.map((variant) => (
          <VariantCard key={variant.key} variant={variant} isWinning={variant.improvement > 0} />
        ))}
      </div>

      {/* Significance Meter */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Statistical Significance</span>
          <span className="text-sm font-mono">
            {(testVariant?.significance || 0).toFixed(1)}%
          </span>
        </div>
        <Progress
          value={testVariant?.significance || 0}
          className="h-2"
          indicatorClassName={
            (testVariant?.significance || 0) >= 95
              ? 'bg-green-500'
              : (testVariant?.significance || 0) >= 80
                ? 'bg-yellow-500'
                : 'bg-gray-400'
          }
        />
        <p className="text-xs text-muted-foreground mt-1">
          {(testVariant?.significance || 0) >= 95
            ? 'Statistically significant! Ready to call.'
            : `Need ${Math.max(0, 95 - (testVariant?.significance || 0)).toFixed(0)}% more for significance.`}
        </p>
      </Card>

      {/* Live Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <MetricCard
          label="Total Participants"
          value={experiment.variants.reduce((sum, v) => sum + v.participants, 0)}
          format="number"
        />
        <MetricCard
          label="Improvement"
          value={testVariant?.improvement || 0}
          format="percent"
          trend={testVariant?.improvement || 0 > 0 ? 'up' : 'down'}
        />
        <MetricCard
          label="Days Running"
          value={getDaysRunning(experiment.startDate)}
          format="number"
        />
      </div>

      {/* AI Commentary */}
      {showAICommentary && (
        <AICommentary experiment={experiment} />
      )}
    </div>
  );
}

function VariantCard({ variant, isWinning }) {
  return (
    <Card className={`p-3 ${isWinning ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">{variant.name}</span>
        {isWinning && <Badge className="bg-green-100 text-green-700">Leading</Badge>}
      </div>
      <div className="text-2xl font-bold">
        {variant.conversionRate.toFixed(2)}%
      </div>
      <div className="text-xs text-muted-foreground">
        {variant.conversions.toLocaleString()} / {variant.participants.toLocaleString()}
      </div>
    </Card>
  );
}

function MetricCard({ label, value, format, trend }) {
  const formatted = format === 'percent'
    ? `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
    : value.toLocaleString();

  return (
    <Card className="p-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="flex items-center gap-1">
        <span className="font-semibold">{formatted}</span>
        {trend && (trend === 'up'
          ? <TrendingUpIcon className="size-3 text-green-500" />
          : <TrendingDownIcon className="size-3 text-red-500" />
        )}
      </div>
    </Card>
  );
}

function AICommentary({ experiment }) {
  // AI generates real-time commentary based on experiment state
  const commentary = generateCommentary(experiment);

  return (
    <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
      <SparklesIcon className="size-4 text-primary mt-0.5" />
      <p className="text-sm">{commentary}</p>
    </div>
  );
}
```

### API Route for Experiment Results

```typescript
// app/api/experiments/[id]/results/route.ts
import { NextRequest } from 'next/server';
import { getPostHogClient } from '@/lib/posthog';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const posthog = getPostHogClient();

  // Call PostHog MCP to get experiment results
  const experiment = await posthog.getExperimentResults(params.id);

  return Response.json({
    id: experiment.id,
    name: experiment.name,
    status: experiment.start_date && !experiment.end_date ? 'running' : 'draft',
    variants: experiment.parameters.feature_flag_variants.map(v => ({
      key: v.key,
      name: v.name || v.key,
      participants: v.exposure_count || 0,
      conversions: v.success_count || 0,
      conversionRate: v.exposure_count ? (v.success_count / v.exposure_count) * 100 : 0,
      improvement: calculateImprovement(v, experiment.parameters.feature_flag_variants[0]),
      significance: v.significance_level || 0,
    })),
    lastUpdated: new Date(),
  });
}
```

## UX Flow

### Embedded in Chat
1. User: "Show me live results for experiment-123"
2. Copilot embeds LiveExperimentDashboard component
3. Metrics update every 10 seconds
4. AI provides commentary: "Looking good! Test variant is up 12%, need 500 more visitors for significance."

### Full Screen Mode
1. User clicks "Expand" on dashboard
2. Opens modal with larger charts, historical data
3. Real-time updates continue

### Notifications
1. When experiment reaches significance, AI proactively notifies
2. "Your checkout button test just hit 95% significance! The blue variant won with +8.3% conversion."

## Demo Script

1. **Start**: "Show live results for our pricing experiment"
2. **Dashboard appears** with real-time metrics
3. **Watch numbers update** every 10 seconds
4. **AI commentary**: "Control is currently winning by 2%, but we're only at 67% significance. Recommend waiting 3 more days."
5. **User**: "What if I want to end it early?"
6. **AI**: "Based on current trends, ending now risks a false negative. The improvement could reach 5-8% with more data."

## Implementation Checklist

- [ ] Create `useLiveExperiment` hook with polling
- [ ] Create `LiveExperimentDashboard` component
- [ ] Add variant comparison cards
- [ ] Add significance progress meter
- [ ] Implement AI commentary generation
- [ ] Add expand to full screen mode
- [ ] Create API route for experiment results
- [ ] Add significance reached notification
- [ ] Test real-time updates

## Dependencies

- PostHog MCP (existing)
- React Query (for polling)
- AI SDK (for commentary generation)

## Estimated Effort

**Medium-High** - Requires real-time data flow, multiple UI components.

## Related Features

- AI Experiment Analyst (Feature #6)
- Natural Language Analytics (Feature #5)
