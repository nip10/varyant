"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CameraIcon,
  ExternalLinkIcon,
  GlobeIcon,
  MaximizeIcon,
} from "lucide-react";
import { useState } from "react";
import type {
  ToolApprovalProps,
  ToolResultProps,
  WebsiteScreenshotInput,
  WebsiteScreenshotOutput,
} from "./types";

export function WebsiteScreenshotResult({
  input,
  output,
  state,
}: ToolResultProps<WebsiteScreenshotInput, WebsiteScreenshotOutput>) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (state !== "output-available" || !output?.screenshotUrl) {
    return null;
  }

  const hostname = (() => {
    try {
      return new URL(input.url).hostname;
    } catch {
      return input.url;
    }
  })();

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CameraIcon className="size-4 text-cyan-500" />
          <span className="text-sm font-medium">Website Screenshot</span>
        </div>
        <Badge variant="secondary" className="text-xs gap-1">
          <GlobeIcon className="size-3" />
          {hostname}
        </Badge>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div
          className="relative group cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <img
            src={output.screenshotUrl}
            alt={`Screenshot of ${input.url}`}
            className={`w-full object-cover transition-all ${
              isExpanded ? "max-h-none" : "max-h-64"
            }`}
          />
          {!isExpanded && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity gap-1.5"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <MaximizeIcon className="size-3" />
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>

        <div className="p-3 border-t bg-muted/30">
          <div className="flex items-center justify-between gap-2">
            <code className="text-xs text-muted-foreground truncate flex-1">
              {input.url}
            </code>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="size-7" asChild>
                <a
                  href={input.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLinkIcon className="size-3.5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" className="size-7" asChild>
                <a
                  href={output.screenshotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <CameraIcon className="size-3.5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WebsiteScreenshotApproval({
  input,
}: ToolApprovalProps<WebsiteScreenshotInput>) {
  const hostname = (() => {
    try {
      return new URL(input.url).hostname;
    } catch {
      return input.url;
    }
  })();

  return (
    <div className="space-y-3 p-3 rounded-lg bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-800">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10">
          <CameraIcon className="size-5 text-cyan-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Capture Screenshot</p>
          <p className="text-xs text-muted-foreground truncate">{hostname}</p>
        </div>
      </div>

      <div className="rounded-md bg-white dark:bg-gray-900 border p-2">
        <div className="flex items-center gap-2">
          <GlobeIcon className="size-3.5 text-muted-foreground shrink-0" />
          <code className="text-xs truncate">{input.url}</code>
        </div>
      </div>

      {input.formats && input.formats.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Formats:</span>
          {input.formats.map((format) => (
            <Badge key={format} variant="outline" className="text-xs">
              {format}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
