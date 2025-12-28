"use client";

import { useCallback, useState, type ReactNode, type DragEvent } from "react";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * A wrapper component that enables drag & drop file uploads.
 * Wraps its children and shows an overlay when files are dragged over.
 */
export function DropZone({
  onFilesAdded,
  acceptedTypes = ["image/*"],
  maxFiles = 5,
  maxSizeMB = 10,
  disabled = false,
  children,
  className,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const validateFile = useCallback(
    (file: File): boolean => {
      // Check type
      const isValidType = acceptedTypes.some((type) => {
        if (type.endsWith("/*")) {
          return file.type.startsWith(type.replace("/*", "/"));
        }
        return file.type === type;
      });

      if (!isValidType) return false;

      // Check size
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) return false;

      return true;
    },
    [acceptedTypes, maxSizeMB]
  );

  const handleDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      setDragCounter((prev) => prev + 1);

      // Check if the drag contains files
      if (e.dataTransfer.types.includes("Files")) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      setDragCounter((prev) => {
        const newCount = prev - 1;
        if (newCount === 0) {
          setIsDragging(false);
        }
        return newCount;
      });
    },
    [disabled]
  );

  const handleDragOver = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      // Set the drop effect
      if (e.dataTransfer.types.includes("Files")) {
        e.dataTransfer.dropEffect = "copy";
      }
    },
    [disabled]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(false);
      setDragCounter(0);

      if (disabled) return;

      const droppedFiles = Array.from(e.dataTransfer.files);

      // Filter and validate files
      const validFiles = droppedFiles.filter(validateFile).slice(0, maxFiles);

      if (validFiles.length > 0) {
        onFilesAdded(validFiles);
      }
    },
    [disabled, validateFile, maxFiles, onFilesAdded]
  );

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cn("relative", className)}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div
          className={cn(
            "absolute inset-0 z-50",
            "flex items-center justify-center",
            "bg-background/90 backdrop-blur-sm",
            "rounded-lg border-2 border-dashed border-primary",
            "animate-in fade-in duration-200"
          )}
        >
          <div className="text-center pointer-events-none">
            <div className="flex items-center justify-center size-12 mx-auto rounded-full bg-primary/10 mb-3">
              <ImageIcon className="size-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Drop files here
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Images up to {maxSizeMB}MB
            </p>
          </div>
        </div>
      )}

      {/* Children content */}
      {children}
    </div>
  );
}
