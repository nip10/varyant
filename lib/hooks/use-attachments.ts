"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export interface Attachment {
  id: string;
  type: "image" | "file";
  name: string;
  dataUrl: string;
  mimeType: string;
  size: number;
}

export interface UseAttachmentsOptions {
  maxFiles?: number;
  maxSizeMB?: number;
  maxTotalSizeMB?: number;
  acceptedTypes?: string[];
  compressImages?: boolean;
  maxImageDimension?: number;
}

export interface UseAttachmentsReturn {
  attachments: Attachment[];
  addFiles: (files: File[] | FileList) => Promise<void>;
  removeAttachment: (id: string) => void;
  clearAttachments: () => void;
  totalSize: number;
  isProcessing: boolean;
  error: string | null;
  clearError: () => void;
}

const DEFAULT_MAX_FILES = 5;
const DEFAULT_MAX_SIZE_MB = 10;
const DEFAULT_MAX_IMAGE_DIMENSION = 2048;
const DEFAULT_ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];

/**
 * Compresses an image file by resizing and adjusting quality
 */
async function compressImage(
  file: File,
  maxDimension: number,
  targetMaxSizeBytes: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      // Create canvas for compression
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Try different quality levels to meet size target
      const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
      let quality = 0.9;
      let dataUrl = canvas.toDataURL(mimeType, quality);

      // For PNG, we can't reduce quality, so just return the resized version
      if (mimeType === "image/png") {
        resolve(dataUrl);
        return;
      }

      // For JPEG, reduce quality until we're under the target size
      while (dataUrl.length > targetMaxSizeBytes * 1.37 && quality > 0.1) {
        // 1.37 accounts for base64 overhead
        quality -= 0.1;
        dataUrl = canvas.toDataURL(mimeType, quality);
      }

      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}

/**
 * Converts a file to a base64 data URL
 */
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Hook for managing file attachments with compression and validation
 */
export function useAttachments(
  options: UseAttachmentsOptions = {}
): UseAttachmentsReturn {
  const {
    maxFiles = DEFAULT_MAX_FILES,
    maxSizeMB = DEFAULT_MAX_SIZE_MB,
    acceptedTypes = DEFAULT_ACCEPTED_TYPES,
    compressImages = true,
    maxImageDimension = DEFAULT_MAX_IMAGE_DIMENSION,
  } = options;

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to track current attachments count for validation
  const attachmentsRef = useRef(attachments);
  attachmentsRef.current = attachments;

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const clearError = useCallback(() => setError(null), []);

  const addFiles = useCallback(
    async (files: File[] | FileList) => {
      const fileArray = Array.from(files);

      if (fileArray.length === 0) return;

      // Check if adding these files would exceed the limit
      const currentCount = attachmentsRef.current.length;
      const availableSlots = maxFiles - currentCount;

      if (availableSlots <= 0) {
        setError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Take only what we can add
      const filesToAdd = fileArray.slice(0, availableSlots);

      if (filesToAdd.length < fileArray.length) {
        setError(
          `Only ${filesToAdd.length} of ${fileArray.length} files added (max ${maxFiles})`
        );
      }

      // Validate file types and sizes
      const validFiles: File[] = [];
      for (const file of filesToAdd) {
        // Check file type
        const isValidType = acceptedTypes.some((type) => {
          if (type.endsWith("/*")) {
            return file.type.startsWith(type.replace("/*", "/"));
          }
          return file.type === type;
        });

        if (!isValidType) {
          setError(`File type ${file.type || "unknown"} not supported`);
          continue;
        }

        // Check file size
        if (file.size > maxSizeBytes) {
          setError(`File "${file.name}" exceeds ${maxSizeMB}MB limit`);
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      setIsProcessing(true);

      try {
        const newAttachments: Attachment[] = [];

        for (const file of validFiles) {
          const isImage = file.type.startsWith("image/");
          let dataUrl: string;

          if (isImage && compressImages) {
            // Compress images
            dataUrl = await compressImage(file, maxImageDimension, maxSizeBytes);
          } else {
            // Convert to base64 directly
            dataUrl = await fileToDataUrl(file);
          }

          const attachment: Attachment = {
            id: crypto.randomUUID(),
            type: isImage ? "image" : "file",
            name: file.name,
            dataUrl,
            mimeType: file.type,
            size: file.size,
          };

          newAttachments.push(attachment);
        }

        setAttachments((prev) => [...prev, ...newAttachments]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process files");
      } finally {
        setIsProcessing(false);
      }
    },
    [maxFiles, maxSizeBytes, maxSizeMB, acceptedTypes, compressImages, maxImageDimension]
  );

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearAttachments = useCallback(() => {
    setAttachments([]);
  }, []);

  const totalSize = attachments.reduce((sum, a) => sum + a.size, 0);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    attachments,
    addFiles,
    removeAttachment,
    clearAttachments,
    totalSize,
    isProcessing,
    error,
    clearError,
  };
}
