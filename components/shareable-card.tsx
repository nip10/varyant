"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BeakerIcon,
  CheckCircleIcon,
  CopyIcon,
  DownloadIcon,
  SparklesIcon,
  TrendingUpIcon,
  TrophyIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CardType = "experiment-win" | "insight" | "milestone" | "comparison";

interface ShareableCardData {
  title: string;
  subtitle?: string;
  metric: string;
  value: string;
  improvement?: string;
  secondaryValue?: string;
  secondaryLabel?: string;
  date: string;
  confidence?: string;
  variantName?: string;
}

interface ShareableCardProps {
  type: CardType;
  data: ShareableCardData;
  className?: string;
}

// Gradient backgrounds for different card types
const cardGradients: Record<CardType, string> = {
  "experiment-win":
    "from-green-500/20 via-emerald-500/10 to-teal-500/5 dark:from-green-900/40 dark:via-emerald-900/20 dark:to-teal-900/10",
  insight:
    "from-orange-500/20 via-amber-500/10 to-yellow-500/5 dark:from-orange-900/40 dark:via-amber-900/20 dark:to-yellow-900/10",
  milestone:
    "from-purple-500/20 via-violet-500/10 to-indigo-500/5 dark:from-purple-900/40 dark:via-violet-900/20 dark:to-indigo-900/10",
  comparison:
    "from-blue-500/20 via-cyan-500/10 to-sky-500/5 dark:from-blue-900/40 dark:via-cyan-900/20 dark:to-sky-900/10",
};

// Icons for different card types
const cardIcons: Record<CardType, typeof BeakerIcon> = {
  "experiment-win": TrophyIcon,
  insight: SparklesIcon,
  milestone: CheckCircleIcon,
  comparison: TrendingUpIcon,
};

// Accent colors for different card types
const accentColors: Record<CardType, string> = {
  "experiment-win": "text-green-600 dark:text-green-400",
  insight: "text-orange-600 dark:text-orange-400",
  milestone: "text-purple-600 dark:text-purple-400",
  comparison: "text-blue-600 dark:text-blue-400",
};

export function ShareableCard({ type, data, className }: ShareableCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const Icon = cardIcons[type];
  const gradient = cardGradients[type];
  const accentColor = accentColors[type];

  const exportAsImage = async () => {
    if (!cardRef.current || isExporting) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = `varyant-${type}-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Failed to export image:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = async () => {
    if (!cardRef.current || isExporting) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      });
    } catch (error) {
      console.error("Failed to copy image:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* The card to export */}
      <div
        ref={cardRef}
        className={cn(
          "relative overflow-hidden rounded-xl border p-6",
          "bg-gradient-to-br",
          gradient
        )}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={cn("flex size-8 items-center justify-center rounded-lg bg-background/80")}>
                <Icon className={cn("size-4", accentColor)} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Varyant</p>
                <p className="text-xs text-muted-foreground/70 capitalize">{type.replace("-", " ")}</p>
              </div>
            </div>
            {data.confidence && (
              <Badge variant="secondary" className="text-xs">
                {data.confidence} confidence
              </Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold tracking-tight">{data.title}</h3>
          {data.subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{data.subtitle}</p>
          )}

          {/* Main Metric */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className={cn("text-4xl font-bold tracking-tight", accentColor)}>
              {data.value}
            </span>
            {data.improvement && (
              <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                +{data.improvement}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{data.metric}</p>

          {/* Secondary Metric */}
          {data.secondaryValue && (
            <div className="mt-4 pt-4 border-t border-foreground/10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{data.secondaryLabel}</span>
                <span className="font-semibold">{data.secondaryValue}</span>
              </div>
            </div>
          )}

          {/* Variant Badge */}
          {data.variantName && (
            <div className="mt-4">
              <Badge variant="outline" className="text-xs">
                <BeakerIcon className="size-3 mr-1" />
                Winning: {data.variantName}
              </Badge>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-foreground/10 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{data.date}</span>
            <span className="text-xs text-muted-foreground">varyant.ai</span>
          </div>
        </div>
      </div>

      {/* Export buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={exportAsImage}
          disabled={isExporting}
          className="flex-1"
        >
          <DownloadIcon className="size-4 mr-1.5" />
          Save PNG
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          disabled={isExporting}
          className="flex-1"
        >
          <CopyIcon className="size-4 mr-1.5" />
          {copied ? "Copied!" : "Copy Image"}
        </Button>
      </div>
    </div>
  );
}

/**
 * Helper to create card data from experiment results
 */
export function createExperimentWinCard(experiment: {
  name: string;
  uplift: string;
  conversionRate: string;
  confidence: string;
  variantName: string;
  participants: number;
}): ShareableCardData {
  return {
    title: experiment.name,
    subtitle: "Experiment completed successfully",
    metric: "Conversion Rate",
    value: experiment.conversionRate,
    improvement: experiment.uplift,
    confidence: experiment.confidence,
    variantName: experiment.variantName,
    secondaryLabel: "Total Participants",
    secondaryValue: experiment.participants.toLocaleString(),
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
}

/**
 * Helper to create card data from insights
 */
export function createInsightCard(insight: {
  title: string;
  metric: string;
  value: string;
  trend?: string;
  period: string;
}): ShareableCardData {
  return {
    title: insight.title,
    metric: insight.metric,
    value: insight.value,
    improvement: insight.trend,
    date: insight.period,
  };
}

/**
 * Helper to create milestone card data
 */
export function createMilestoneCard(milestone: {
  title: string;
  description: string;
  value: string;
  metric: string;
}): ShareableCardData {
  return {
    title: milestone.title,
    subtitle: milestone.description,
    metric: milestone.metric,
    value: milestone.value,
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
  };
}
