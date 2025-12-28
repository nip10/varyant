"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  CodeIcon,
  LineChartIcon,
  PieChartIcon,
  HashIcon,
  TableIcon,
  CopyIcon,
  CheckIcon,
  SearchIcon,
} from "lucide-react";
import { useState } from "react";
import { AnalyticsChart } from "./analytics-chart";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import type {
  ToolApprovalProps,
  ToolResultProps,
  ChartType,
  PosthogQueryInput,
  PosthogQueryOutput,
} from "./types";

// Chart type icon mapping
function ChartTypeIcon({ type }: { type: ChartType }) {
  switch (type) {
    case "line":
      return <LineChartIcon className="size-3.5" />;
    case "bar":
      return <BarChart3Icon className="size-3.5" />;
    case "pie":
      return <PieChartIcon className="size-3.5" />;
    case "number":
      return <HashIcon className="size-3.5" />;
    case "table":
      return <TableIcon className="size-3.5" />;
    default:
      return <BarChart3Icon className="size-3.5" />;
  }
}

// Follow-up suggestions based on query type
function getFollowUpSuggestions(output: PosthogQueryOutput): string[] {
  const suggestions: string[] = [];

  // Time-based suggestions
  if (output.chartType === "line") {
    suggestions.push("Compare to previous period");
    suggestions.push("Break down by day of week");
  }

  // Breakdown suggestions
  if (output.chartType === "bar" || output.chartType === "number") {
    suggestions.push("Break this down by day");
    suggestions.push("Show trend over time");
  }

  // General suggestions
  suggestions.push("Show top performers");
  suggestions.push("Filter by specific segment");

  return suggestions.slice(0, 3);
}

export function PosthogQueryResult({
  input,
  output,
  state,
}: ToolResultProps<PosthogQueryInput, PosthogQueryOutput>) {
  const [showSQL, setShowSQL] = useState(false);
  const [copied, setCopied] = useState(false);

  if (state !== "output-available" || !output) {
    return null;
  }

  const followUpSuggestions = getFollowUpSuggestions(output);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output.hogql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header with question */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          <SearchIcon className="size-4 text-orange-500 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{output.question}</p>
        </div>
        <Badge variant="secondary" className="shrink-0 text-xs">
          <ChartTypeIcon type={output.chartType} />
          <span className="ml-1 capitalize">{output.chartType}</span>
        </Badge>
      </div>

      {/* Chart */}
      <div className="rounded-lg border bg-card p-4">
        <AnalyticsChart
          data={output.results}
          columns={output.columns}
          chartType={output.chartType}
        />
      </div>

      {/* Metadata and SQL Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => setShowSQL(!showSQL)}
        >
          <CodeIcon className="size-3 mr-1" />
          {showSQL ? "Hide" : "Show"} HogQL
          {showSQL ? (
            <ChevronUpIcon className="size-3 ml-1" />
          ) : (
            <ChevronDownIcon className="size-3 ml-1" />
          )}
        </Button>
        <span className="text-xs text-muted-foreground">
          {output.metadata.rowCount} row{output.metadata.rowCount !== 1 ? "s" : ""}
          {output.metadata.columnCount > 1 &&
            ` x ${output.metadata.columnCount} columns`}
        </span>
      </div>

      {/* SQL Query Display */}
      {showSQL && (
        <div className="relative rounded-lg border bg-muted/50 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/50">
            <span className="text-xs font-medium text-muted-foreground">
              HogQL Query
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <CheckIcon className="size-3 mr-1 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <CopyIcon className="size-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
            {output.hogql}
          </pre>
        </div>
      )}

      {/* Follow-up Suggestions */}
      <Suggestions className="pt-2">
        {followUpSuggestions.map((suggestion) => (
          <Suggestion
            key={suggestion}
            suggestion={suggestion}
            className="text-xs"
          />
        ))}
      </Suggestions>
    </div>
  );
}

export function PosthogQueryApproval({
  input,
}: ToolApprovalProps<PosthogQueryInput>) {
  return (
    <div className="space-y-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10">
          <BarChart3Icon className="size-5 text-orange-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Query Analytics</p>
          <p className="text-xs text-muted-foreground truncate">
            {input.question}
          </p>
        </div>
      </div>

      {/* Show a preview of the query */}
      <div className="rounded-md bg-white dark:bg-gray-900 border p-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <CodeIcon className="size-3" />
          <span>HogQL Query</span>
        </div>
        <pre className="text-xs font-mono text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap">
          {input.hogqlQuery.length > 100
            ? input.hogqlQuery.substring(0, 100) + "..."
            : input.hogqlQuery}
        </pre>
      </div>
    </div>
  );
}
