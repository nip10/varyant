"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import {
  ExternalLinkIcon,
  ImageIcon,
  SearchIcon,
  SparklesIcon,
  BeakerIcon,
  ZapIcon,
} from "lucide-react";
import type { ToolResultProps, ToolApprovalProps } from "./types";

interface CompetitorAnalysisInput {
  competitorUrl: string;
  yourPageUrl?: string;
  focusAreas?: string[];
}

interface CompetitorAnalysisOutput {
  competitor: {
    url: string;
    screenshotUrl?: string;
    title?: string;
    description?: string;
    content?: string;
  };
  yours: {
    url: string;
    screenshotUrl?: string;
    title?: string;
    description?: string;
    content?: string;
  } | null;
  focusAreas: string[];
  analysisContext: string;
}

export function CompetitorAnalysisResult({
  input,
  output,
  state,
}: ToolResultProps<CompetitorAnalysisInput, CompetitorAnalysisOutput>) {
  const [activeTab, setActiveTab] = useState("screenshots");

  if (state !== "output-available" || !output) {
    return null;
  }

  const { competitor, yours, focusAreas } = output;
  const hasComparison = !!yours;

  // Generate follow-up suggestions
  const suggestions = [
    "Create experiment based on their CTA style",
    "Test their headline approach",
    "Add similar social proof elements",
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
            <SearchIcon className="size-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold">Competitor Analysis</h3>
            <p className="text-xs text-muted-foreground">
              {hasComparison ? "Side-by-side comparison" : "Single page analysis"}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {focusAreas.map((area) => (
            <Badge key={area} variant="outline" className="text-xs capitalize">
              {area}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="screenshots" className="text-xs">
            <ImageIcon className="size-3 mr-1" />
            Screenshots
          </TabsTrigger>
          <TabsTrigger value="insights" className="text-xs">
            <SparklesIcon className="size-3 mr-1" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="experiments" className="text-xs">
            <BeakerIcon className="size-3 mr-1" />
            Test Ideas
          </TabsTrigger>
        </TabsList>

        {/* Screenshots Tab */}
        <TabsContent value="screenshots" className="mt-3">
          <div className={`grid gap-4 ${hasComparison ? "grid-cols-2" : "grid-cols-1"}`}>
            {/* Competitor Screenshot */}
            <Card className="overflow-hidden">
              <div className="p-2 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Competitor</span>
                  <a
                    href={competitor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    Visit <ExternalLinkIcon className="size-3" />
                  </a>
                </div>
                {competitor.title && (
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {competitor.title}
                  </p>
                )}
              </div>
              {competitor.screenshotUrl ? (
                <img
                  src={competitor.screenshotUrl}
                  alt={`Screenshot of ${competitor.url}`}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-video flex items-center justify-center bg-muted">
                  <p className="text-sm text-muted-foreground">No screenshot available</p>
                </div>
              )}
            </Card>

            {/* Your Page Screenshot */}
            {yours && (
              <Card className="overflow-hidden">
                <div className="p-2 border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">Your Page</span>
                    <a
                      href={yours.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      Visit <ExternalLinkIcon className="size-3" />
                    </a>
                  </div>
                  {yours.title && (
                    <p className="text-xs text-muted-foreground truncate mt-1">{yours.title}</p>
                  )}
                </div>
                {yours.screenshotUrl ? (
                  <img
                    src={yours.screenshotUrl}
                    alt={`Screenshot of ${yours.url}`}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="aspect-video flex items-center justify-center bg-muted">
                    <p className="text-sm text-muted-foreground">No screenshot available</p>
                  </div>
                )}
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="mt-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <ZapIcon className="size-4 text-yellow-500" />
              <span className="text-sm font-medium">AI Analysis</span>
            </div>
            <p className="text-sm text-muted-foreground">
              See the chat above for detailed AI-powered insights about this competitor&apos;s
              strategies, strengths, and opportunities for experimentation.
            </p>
            {competitor.description && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Competitor Description
                </p>
                <p className="text-sm">{competitor.description}</p>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Experiments Tab */}
        <TabsContent value="experiments" className="mt-3">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BeakerIcon className="size-4 text-blue-500" />
              <span className="text-sm font-medium">Suggested Experiments</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Based on the competitor analysis, consider testing these approaches on your site.
              Click a suggestion below to create an experiment.
            </p>
            <Suggestions>
              {suggestions.map((suggestion) => (
                <Suggestion key={suggestion} suggestion={suggestion} className="text-xs" />
              ))}
            </Suggestions>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="flex items-center gap-2 pt-2">
        <Button variant="outline" size="sm" className="text-xs" asChild>
          <a href={competitor.url} target="_blank" rel="noopener noreferrer">
            <ExternalLinkIcon className="size-3 mr-1" />
            View Competitor
          </a>
        </Button>
        {yours && (
          <Button variant="outline" size="sm" className="text-xs" asChild>
            <a href={yours.url} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon className="size-3 mr-1" />
              View Your Page
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

export function CompetitorAnalysisApproval({
  input,
}: ToolApprovalProps<CompetitorAnalysisInput>) {
  return (
    <div className="space-y-3 p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
          <SearchIcon className="size-5 text-cyan-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Analyze Competitor</p>
          <p className="text-xs text-muted-foreground truncate">{input.competitorUrl}</p>
        </div>
      </div>

      {input.yourPageUrl && (
        <div className="text-xs text-muted-foreground">
          Comparing against: <span className="text-foreground">{input.yourPageUrl}</span>
        </div>
      )}

      {input.focusAreas && input.focusAreas.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {input.focusAreas.map((area) => (
            <Badge key={area} variant="secondary" className="text-xs capitalize">
              {area}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
