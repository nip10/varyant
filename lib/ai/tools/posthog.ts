import { tool, ToolSet } from "ai";
import { z } from "zod";
import {
  createExperiment,
  createFeatureFlag,
  getInsights,
  runHogQL,
} from "@/lib/integrations/posthog";
import type { ChartType } from "@/components/tool-results/types";

// Infer the best chart type based on data structure
function inferChartType(
  results: unknown[],
  columns: string[]
): ChartType {
  if (!results || results.length === 0) {
    return "number";
  }

  // Single value - show as number
  if (results.length === 1 && columns.length === 1) {
    return "number";
  }

  // Check if we have a date/time column (suggests time series)
  const hasDateColumn = columns.some((col) =>
    /date|day|week|month|time|timestamp|hour/i.test(col)
  );

  // If 2 columns and one is date-like, use line chart for time series
  if (hasDateColumn && columns.length === 2) {
    return "line";
  }

  // If first column looks like categories and second is numeric
  if (columns.length === 2 && results.length <= 10) {
    return "bar";
  }

  // For distribution data (percentages, proportions)
  if (columns.length === 2 && results.length <= 6) {
    const values = results.map((r) => {
      const row = r as Record<string, unknown>;
      return row[columns[1]];
    });
    const total = values.reduce(
      (sum: number, v) => sum + (typeof v === "number" ? v : 0),
      0
    );
    // If values look like they could be proportions (sum to ~100 or values are small)
    if (total <= 100 || (total <= 1.1 && total >= 0.9)) {
      return "pie";
    }
  }

  // Many columns or rows - use table
  if (columns.length > 3 || results.length > 10) {
    return "table";
  }

  // Default to bar chart
  return "bar";
}

// Format column names for display
function formatColumnName(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

// Extract column names from a HogQL SELECT query
function extractColumnNames(query: string): string[] {
  // Find the SELECT ... FROM part
  const selectMatch = query.match(/SELECT\s+([\s\S]*?)\s+FROM/i);
  if (!selectMatch) {
    return ["value"];
  }

  const selectPart = selectMatch[1];

  // Split by commas, but respect parentheses
  const columns: string[] = [];
  let current = "";
  let parenDepth = 0;

  for (const char of selectPart) {
    if (char === "(") {
      parenDepth++;
      current += char;
    } else if (char === ")") {
      parenDepth--;
      current += char;
    } else if (char === "," && parenDepth === 0) {
      columns.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    columns.push(current.trim());
  }

  // Extract column names (handle aliases with AS, or use the expression)
  return columns.map((col) => {
    // Check for AS alias (case insensitive)
    const asMatch = col.match(/\s+[Aa][Ss]\s+(\w+)\s*$/);
    if (asMatch) {
      return asMatch[1];
    }

    // Check for implicit alias (expression followed by space and identifier)
    const implicitMatch = col.match(/\)\s+(\w+)\s*$/);
    if (implicitMatch) {
      return implicitMatch[1];
    }

    // If it's a simple column reference, use that
    const simpleMatch = col.match(/^[\w.]+$/);
    if (simpleMatch) {
      // Get the last part after any dots
      const parts = col.split(".");
      return parts[parts.length - 1];
    }

    // For complex expressions without alias, generate a name
    // Try to extract a meaningful name from common patterns
    if (col.toLowerCase().includes("count")) return "count";
    if (col.toLowerCase().includes("sum")) return "total";
    if (col.toLowerCase().includes("avg")) return "average";
    if (col.toLowerCase().includes("min")) return "minimum";
    if (col.toLowerCase().includes("max")) return "maximum";

    return "value";
  });
}

export const posthogTools = {
  queryPosthogInsights: tool({
    description: "List all PostHog insights or funnels",
    inputSchema: z.object({}),
    execute: async () => {
      const data = await getInsights();
      return data;
    },
  }),
  queryPosthogAnalytics: tool({
    description: `Query PostHog analytics using natural language. Translates questions into HogQL queries and returns data with appropriate visualizations.

Examples:
- "How many users signed up last week?"
- "What's our conversion rate for the pricing page?"
- "Show me daily active users for the past month"
- "Top 5 pages by views"
- "Compare signup rates between mobile and desktop"

The tool will:
1. Execute the HogQL query against PostHog
2. Determine the best chart type (line, bar, pie, number, table)
3. Return structured data for visualization`,
    inputSchema: z.object({
      question: z.string().describe("Natural language analytics question"),
      hogqlQuery: z.string().describe("The HogQL query to execute. Must be valid HogQL syntax."),
      visualization: z
        .enum(["line", "bar", "pie", "number", "table"])
        .optional()
        .describe(
          "Preferred chart type. If not specified, the best type will be inferred from the data structure."
        ),
    }),
    outputSchema: z.object({
      question: z.string(),
      hogql: z.string(),
      results: z.array(z.record(z.string(), z.unknown())),
      columns: z.array(z.string()),
      chartType: z.enum(["line", "bar", "pie", "number", "table"]),
      metadata: z.object({
        rowCount: z.number(),
        columnCount: z.number(),
      }),
    }),
    execute: async ({ question, hogqlQuery, visualization }) => {
      // Execute the HogQL query
      const response = await runHogQL("nl_analytics_query", hogqlQuery);

      // Extract column names from the query result
      // HogQL returns results as arrays, we need to parse column names from the query
      const columnNames = extractColumnNames(hogqlQuery);

      // Transform array results to objects with column names
      const results = (response.results || []).map((row) => {
        if (Array.isArray(row)) {
          const obj: Record<string, unknown> = {};
          columnNames.forEach((col, i) => {
            obj[col] = row[i];
          });
          return obj;
        }
        return row as Record<string, unknown>;
      });

      // Determine chart type
      const chartType = visualization || inferChartType(results, columnNames);

      return {
        question,
        hogql: hogqlQuery,
        results,
        columns: columnNames.map(formatColumnName),
        chartType,
        metadata: {
          rowCount: results.length,
          columnCount: columnNames.length,
        },
      };
    },
  }),
  createPostHogFeatureFlag: tool({
    description: "Create a PostHog feature flag (required for experiments)",
    inputSchema: z.object({
      featureFlagKey: z.string().describe("The key of the feature flag"),
      numVariants: z
        .number()
        .describe("The number of variants to create")
        .min(2)
        .max(3),
    }),
    outputSchema: z.object({
      id: z.number(),
      key: z.string(),
      name: z.string(),
      active: z.boolean(),
      filters: z.object({
        multivariate: z.object({
          variants: z.array(z.object({
            key: z.string(),
            name: z.string().optional(),
            rollout_percentage: z.number(),
          })),
        }).optional(),
      }).optional(),
    }),
    execute: async (input) => {
      const data = await createFeatureFlag(input);
      return {
        id: data.id,
        key: data.key,
        name: data.name,
        active: data.active,
        filters: data.filters ? {
          multivariate: data.filters.multivariate ? {
            variants: data.filters.multivariate.variants,
          } : undefined,
        } : undefined,
      };
    },
    needsApproval: true,
  }),
  createPostHogExperiment: tool({
    description: "Create a PostHog experiment (requires a feature flag and a ticket in Linear)",
    inputSchema: z.object({
      name: z.string().describe("The name of the experiment"),
      featureFlagKey: z.string().describe("The key of the feature flag"),
      linearTicketId: z.string().describe("The ID of the ticket in Linear"),
      implementationEffort: z
        .enum(["low", "medium", "high"])
        .describe("The implementation effort of the experiment"),
    }),
    outputSchema: z.object({
      id: z.number(),
      name: z.string(),
      feature_flag_key: z.string(),
      start_date: z.string().optional(),
      created_at: z.string(),
      description: z.string().optional(),
    }),
    execute: async (input) => {
      const data = await createExperiment(input);
      return {
        id: data.id,
        name: data.name,
        feature_flag_key: data.feature_flag_key,
        start_date: data.start_date,
        created_at: data.created_at,
        description: data.description,
      };
    },
    needsApproval: (input) => input.implementationEffort === "high",
  }),
} satisfies ToolSet;
