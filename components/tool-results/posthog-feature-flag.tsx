"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  CheckCircle2Icon,
  CopyIcon,
  ExternalLinkIcon,
  FlagIcon,
  ToggleLeftIcon,
} from "lucide-react";
import { useState } from "react";
import type {
  PosthogFeatureFlagInput,
  PosthogFeatureFlagOutput,
  ToolApprovalProps,
  ToolResultProps,
} from "./types";

export function PosthogFeatureFlagResult({
  input,
  output,
  state,
}: ToolResultProps<PosthogFeatureFlagInput, PosthogFeatureFlagOutput>) {
  const [copied, setCopied] = useState(false);

  if (state !== "output-available" || !output) {
    return null;
  }

  const flagKey = output.featureFlagKey || output.key || input.featureFlagKey;
  const variants = output.filters?.multivariate?.variants || [];
  const isActive = output.active !== false;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(flagKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlagIcon className="size-4 text-purple-500" />
          <span className="text-sm font-medium">Feature Flag Created</span>
        </div>
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={cn(
            "text-xs",
            isActive && "bg-green-500 hover:bg-green-600"
          )}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="rounded-lg border bg-card p-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <code className="rounded bg-muted px-2 py-1 text-sm font-mono truncate">
              {flagKey}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0"
              onClick={copyToClipboard}
            >
              {copied ? (
                <CheckCircle2Icon className="size-3.5 text-green-500" />
              ) : (
                <CopyIcon className="size-3.5" />
              )}
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="size-7 shrink-0" asChild>
            <a
              href={`${process.env.NEXT_PUBLIC_POSTHOG_HOST}/feature_flags/${output.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon className="size-3.5" />
            </a>
          </Button>
        </div>

        {variants.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Variants
            </p>
            <div className="grid gap-2">
              {variants.map((variant, index) => (
                <div
                  key={variant.key}
                  className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "size-2 rounded-full",
                        index === 0
                          ? "bg-gray-400"
                          : index === 1
                          ? "bg-blue-500"
                          : "bg-green-500"
                      )}
                    />
                    <span className="text-sm font-medium">{variant.name}</span>
                    <code className="text-xs text-muted-foreground">
                      {variant.key}
                    </code>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {variant.rollout_percentage}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PosthogFeatureFlagApproval({
  input,
}: ToolApprovalProps<PosthogFeatureFlagInput>) {
  const variants = [
    { name: "Control", percentage: Math.floor(100 / input.numVariants) },
    ...Array.from({ length: input.numVariants - 1 }, (_, i) => ({
      name: `Variant ${i + 1}`,
      percentage: Math.floor(100 / input.numVariants),
    })),
  ];

  return (
    <div className="space-y-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
          <FlagIcon className="size-5 text-purple-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">Create Feature Flag</p>
          <code className="text-xs text-muted-foreground font-mono">
            {input.featureFlagKey}
          </code>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {variants.map((v, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 rounded-full bg-white dark:bg-gray-900 border px-2.5 py-1 text-xs"
          >
            <div
              className={cn(
                "size-1.5 rounded-full",
                i === 0 ? "bg-gray-400" : i === 1 ? "bg-blue-500" : "bg-green-500"
              )}
            />
            <span>{v.name}</span>
            <span className="text-muted-foreground">({v.percentage}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}
