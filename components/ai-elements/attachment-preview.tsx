"use client";

import { FileIcon, XIcon, Loader2Icon, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Attachment } from "@/lib/hooks/use-attachments";

export interface AttachmentPreviewProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
  isProcessing?: boolean;
  error?: string | null;
  onClearError?: () => void;
  className?: string;
}

/**
 * Displays thumbnail previews of attached files with remove buttons.
 * Shows a processing indicator when files are being added.
 */
export function AttachmentPreview({
  attachments,
  onRemove,
  isProcessing = false,
  error = null,
  onClearError,
  className,
}: AttachmentPreviewProps) {
  if (attachments.length === 0 && !isProcessing && !error) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Error message */}
      {error && (
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-2",
            "text-sm text-destructive",
            "bg-destructive/10 rounded-md",
            "animate-in fade-in slide-in-from-bottom-1 duration-200"
          )}
        >
          <AlertCircleIcon className="size-4 shrink-0" />
          <span className="flex-1">{error}</span>
          {onClearError && (
            <Button
              variant="ghost"
              size="icon"
              className="size-5 hover:bg-destructive/20"
              onClick={onClearError}
            >
              <XIcon className="size-3" />
            </Button>
          )}
        </div>
      )}

      {/* Attachments grid */}
      {(attachments.length > 0 || isProcessing) && (
        <div className="flex flex-wrap gap-2 p-2">
          {attachments.map((attachment) => (
            <AttachmentThumbnail
              key={attachment.id}
              attachment={attachment}
              onRemove={onRemove}
            />
          ))}

          {/* Processing indicator */}
          {isProcessing && (
            <div
              className={cn(
                "relative shrink-0",
                "size-16 flex items-center justify-center",
                "bg-muted rounded-lg border border-dashed border-border",
                "animate-in fade-in duration-200"
              )}
            >
              <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface AttachmentThumbnailProps {
  attachment: Attachment;
  onRemove: (id: string) => void;
}

function AttachmentThumbnail({ attachment, onRemove }: AttachmentThumbnailProps) {
  const isImage = attachment.type === "image";

  return (
    <div
      className={cn(
        "relative shrink-0 group",
        "animate-in fade-in zoom-in-95 duration-200"
      )}
    >
      {/* Thumbnail */}
      <div
        className={cn(
          "size-16 rounded-lg border border-border overflow-hidden",
          "bg-muted"
        )}
      >
        {isImage ? (
          <img
            src={attachment.dataUrl}
            alt={attachment.name}
            className="size-full object-cover"
          />
        ) : (
          <div className="size-full flex items-center justify-center">
            <FileIcon className="size-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Remove button */}
      <Button
        variant="destructive"
        size="icon"
        className={cn(
          "absolute -top-1.5 -right-1.5",
          "size-5 rounded-full",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-150",
          "shadow-sm"
        )}
        onClick={() => onRemove(attachment.id)}
      >
        <XIcon className="size-3" />
        <span className="sr-only">Remove {attachment.name}</span>
      </Button>

      {/* Filename tooltip */}
      <p
        className={cn(
          "absolute -bottom-5 left-0 right-0",
          "text-[10px] text-center text-muted-foreground",
          "truncate px-0.5"
        )}
        title={attachment.name}
      >
        {attachment.name}
      </p>
    </div>
  );
}

/**
 * A compact inline preview for showing attachments in a horizontal row.
 * Useful for displaying in the input area.
 */
export function AttachmentPreviewInline({
  attachments,
  onRemove,
  isProcessing = false,
  className,
}: Omit<AttachmentPreviewProps, "error" | "onClearError">) {
  if (attachments.length === 0 && !isProcessing) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2",
        "overflow-x-auto scrollbar-thin",
        "border-b border-border",
        className
      )}
    >
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className={cn(
            "relative shrink-0 group",
            "animate-in fade-in zoom-in-95 duration-200"
          )}
        >
          <div
            className={cn(
              "size-10 rounded-md border border-border overflow-hidden",
              "bg-muted flex items-center justify-center"
            )}
          >
            {attachment.type === "image" ? (
              <img
                src={attachment.dataUrl}
                alt={attachment.name}
                className="size-full object-cover"
              />
            ) : (
              <FileIcon className="size-4 text-muted-foreground" />
            )}
          </div>
          <Button
            variant="destructive"
            size="icon"
            className={cn(
              "absolute -top-1 -right-1",
              "size-4 rounded-full",
              "opacity-0 group-hover:opacity-100",
              "transition-opacity duration-150"
            )}
            onClick={() => onRemove(attachment.id)}
          >
            <XIcon className="size-2.5" />
          </Button>
        </div>
      ))}

      {isProcessing && (
        <div className="size-10 shrink-0 flex items-center justify-center bg-muted rounded-md border border-dashed">
          <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
