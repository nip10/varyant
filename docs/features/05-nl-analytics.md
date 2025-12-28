# Feature: Natural Language Analytics

> Ask questions in plain English, get charts and insights

## Overview

Enable users to query their PostHog analytics using natural language. The copilot translates questions into HogQL queries, executes them, and presents results with appropriate visualizations.

## User Story

As a non-technical product manager, I want to ask "How many users signed up last week?" and get a clear answer with a chart, without writing SQL or navigating dashboards.

## Technical Approach

### PostHog MCP Query Tool

We already have `queryPosthogInsights` tool. Enhance it to support natural language:

```typescript
// lib/ai/tools/query-posthog.ts
export const queryPosthogInsightsTool = createTool({
  name: "queryPosthogInsights",
  description: `Query PostHog analytics using natural language. Examples:
    - "How many users signed up last week?"
    - "What's our conversion rate for the pricing page?"
    - "Show me daily active users for the past month"
    - "Compare signup rates between mobile and desktop"`,
  parameters: z.object({
    question: z.string().describe("Natural language analytics question"),
    visualization: z.enum(['line', 'bar', 'pie', 'number', 'table']).optional()
      .describe("Preferred chart type, if not specified AI will choose"),
    dateRange: z.object({
      from: z.string().optional(),
      to: z.string().optional(),
    }).optional().describe("Date range for the query"),
  }),
  execute: async ({ question, visualization, dateRange }) => {
    // 1. Use AI to translate question to HogQL
    const hogql = await translateToHogQL(question, dateRange);

    // 2. Execute query via PostHog MCP
    const results = await posthog.query(hogql);

    // 3. Determine best visualization
    const chartType = visualization || inferChartType(results);

    return {
      question,
      hogql,
      results,
      chartType,
      metadata: {
        rowCount: results.length,
        executionTime: Date.now(),
      },
    };
  },
});
```

### HogQL Translation

```typescript
// lib/posthog/translate-hogql.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const HOGQL_SYSTEM_PROMPT = `
You are a PostHog HogQL expert. Translate natural language questions into valid HogQL queries.

## Available Tables
- events: All tracked events (event, timestamp, distinct_id, properties)
- persons: User profiles (id, properties, created_at)
- sessions: Session data (session_id, duration, entry_url, exit_url)

## Common Event Names
- $pageview: Page views
- $autocapture: Automatic click tracking
- $identify: User identification
- sign_up: User registration (custom)
- purchase: Completed purchase (custom)

## Examples

Q: "How many users signed up last week?"
A: SELECT count(distinct distinct_id) as signups FROM events WHERE event = 'sign_up' AND timestamp >= now() - INTERVAL 7 DAY

Q: "What's the conversion rate from homepage to signup?"
A: WITH funnel AS (
  SELECT distinct_id,
    max(event = '$pageview' AND properties.$current_url LIKE '%/home%') as saw_home,
    max(event = 'sign_up') as signed_up
  FROM events
  WHERE timestamp >= now() - INTERVAL 30 DAY
  GROUP BY distinct_id
)
SELECT
  countIf(saw_home) as homepage_visitors,
  countIf(signed_up AND saw_home) as signups,
  round(countIf(signed_up AND saw_home) / countIf(saw_home) * 100, 2) as conversion_rate
FROM funnel

Always return valid HogQL. Do not include markdown formatting.
`;

export async function translateToHogQL(question: string, dateRange?: { from?: string; to?: string }) {
  const result = await streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    system: HOGQL_SYSTEM_PROMPT,
    prompt: `Translate this question to HogQL: "${question}"${dateRange ? ` Date range: ${dateRange.from || 'not specified'} to ${dateRange.to || 'now'}` : ''}`,
  });

  return await result.text;
}
```

### Visualization Components

```tsx
// components/tool-results/analytics-chart.tsx
import { Card } from '@/components/ui/card';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface AnalyticsChartProps {
  data: Record<string, unknown>[];
  chartType: 'line' | 'bar' | 'pie' | 'number' | 'table';
  title?: string;
}

export function AnalyticsChart({ data, chartType, title }: AnalyticsChartProps) {
  if (chartType === 'number') {
    const value = Object.values(data[0] || {})[0];
    return (
      <Card className="p-6 text-center">
        {title && <p className="text-sm text-muted-foreground mb-2">{title}</p>}
        <p className="text-4xl font-bold">{formatNumber(value)}</p>
      </Card>
    );
  }

  if (chartType === 'table') {
    return <DataTable data={data} />;
  }

  const keys = Object.keys(data[0] || {});
  const xKey = keys[0];
  const yKey = keys[1];

  return (
    <Card className="p-4">
      {title && <p className="text-sm font-medium mb-4">{title}</p>}
      <ResponsiveContainer width="100%" height={250}>
        {chartType === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey={xKey} className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Line type="monotone" dataKey={yKey} stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        ) : chartType === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey={xKey} className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip />
            <Bar dataKey={yKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        ) : (
          <PieChart>
            <Pie data={data} dataKey={yKey} nameKey={xKey} cx="50%" cy="50%" outerRadius={80} label>
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </ResponsiveContainer>
    </Card>
  );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function formatNumber(value: unknown): string {
  if (typeof value === 'number') {
    return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString();
  }
  return String(value);
}
```

### Enhanced Query Result Component

```tsx
// components/tool-results/posthog-query-result.tsx
export function PosthogQueryResult({ input, output }) {
  const [showSQL, setShowSQL] = useState(false);

  return (
    <div className="space-y-3 p-4">
      {/* Question Echo */}
      <div className="flex items-center gap-2">
        <SearchIcon className="size-4 text-primary" />
        <p className="text-sm font-medium">{input.question}</p>
      </div>

      {/* Chart */}
      <AnalyticsChart
        data={output.results}
        chartType={output.chartType}
      />

      {/* SQL Toggle */}
      <div className="flex items-center justify-between text-xs">
        <button
          onClick={() => setShowSQL(!showSQL)}
          className="text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <CodeIcon className="size-3" />
          {showSQL ? 'Hide' : 'Show'} HogQL
        </button>
        <span className="text-muted-foreground">
          {output.metadata.rowCount} rows in {output.metadata.executionTime}ms
        </span>
      </div>

      {showSQL && (
        <pre className="p-2 bg-muted rounded text-xs overflow-x-auto">
          {output.hogql}
        </pre>
      )}

      {/* Follow-up suggestions */}
      <Suggestions className="mt-2">
        <Suggestion suggestion="Break this down by day" />
        <Suggestion suggestion="Compare to last month" />
        <Suggestion suggestion="Save as insight" />
      </Suggestions>
    </div>
  );
}
```

## Example Queries

| Natural Language | HogQL Translation |
|------------------|-------------------|
| "How many users signed up last week?" | `SELECT count(distinct distinct_id) FROM events WHERE event = 'sign_up' AND timestamp >= now() - INTERVAL 7 DAY` |
| "Daily active users this month" | `SELECT toDate(timestamp) as day, count(distinct distinct_id) as dau FROM events WHERE timestamp >= now() - INTERVAL 30 DAY GROUP BY day ORDER BY day` |
| "Top 5 pages by views" | `SELECT properties.$current_url as page, count() as views FROM events WHERE event = '$pageview' GROUP BY page ORDER BY views DESC LIMIT 5` |
| "Signup funnel conversion" | `WITH ... SELECT ... (funnel query)` |

## UX Flow

1. User: "How many people visited our pricing page last week?"
2. AI translates to HogQL
3. Executes query via PostHog
4. Returns bar chart showing daily visits
5. Offers follow-ups: "Compare to previous week", "Show by device type"

## Demo Script

1. **User**: "Show me signups over the past 30 days"
2. **Chart**: Line chart with daily signups
3. **AI**: "You had 1,234 signups in the past 30 days, averaging 41/day. That's up 12% from the previous period."
4. **User**: "Break that down by acquisition source"
5. **Updated chart**: Stacked bar chart by source
6. **AI**: "Organic search drives 45% of signups, followed by direct at 30%."

## Implementation Checklist

- [ ] Enhance `queryPosthogInsights` tool with natural language
- [ ] Create HogQL translation prompt
- [ ] Build visualization components (line, bar, pie, number, table)
- [ ] Add chart type inference logic
- [ ] Create result component with SQL toggle
- [ ] Add follow-up suggestions
- [ ] Test with 20+ example queries
- [ ] Handle edge cases (empty results, errors)

## Dependencies

- PostHog MCP (existing)
- Recharts for visualization
- AI SDK for HogQL translation

## Estimated Effort

**Medium** - HogQL translation is the complex part.

## Related Features

- AI Experiment Analyst (Feature #6)
- Live Experiment Dashboard (Feature #4)
