# Feature: Multi-modal Input

> Drag and drop images, paste screenshots, and upload files directly into chat

## Overview

Enable rich multi-modal interaction by allowing users to drag, paste, or upload images and files directly into the chat. The AI processes these alongside text to provide context-aware responses.

## User Story

As a product manager, I want to share screenshots, wireframes, and documents with the copilot so that it can provide feedback and suggestions based on visual context.

## Technical Approach

### AI SDK Parts Array

The AI SDK supports multi-modal messages through the `parts` array:

```typescript
// Message structure with attachments
interface Message {
  role: 'user' | 'assistant';
  content: string;
  parts?: Part[];
}

type Part =
  | { type: 'text'; text: string }
  | { type: 'image'; image: string } // base64 data URL
  | { type: 'file'; data: string; mimeType: string };
```

### useChat with Attachments

```typescript
// lib/hooks/use-chat-with-attachments.ts
import { useChat } from '@ai-sdk/react';
import { useState, useCallback } from 'react';

interface Attachment {
  id: string;
  type: 'image' | 'file';
  name: string;
  dataUrl: string;
  mimeType: string;
}

export function useChatWithAttachments() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const chat = useChat({
    // ... existing config
  });

  const addAttachment = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const attachment: Attachment = {
        id: crypto.randomUUID(),
        type: file.type.startsWith('image/') ? 'image' : 'file',
        name: file.name,
        dataUrl: reader.result as string,
        mimeType: file.type,
      };
      setAttachments(prev => [...prev, attachment]);
    };
    reader.readAsDataURL(file);
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  }, []);

  const clearAttachments = useCallback(() => {
    setAttachments([]);
  }, []);

  const sendMessageWithAttachments = useCallback(async (text: string) => {
    // Build parts array
    const parts: Part[] = [
      { type: 'text', text },
      ...attachments.map(a =>
        a.type === 'image'
          ? { type: 'image' as const, image: a.dataUrl }
          : { type: 'file' as const, data: a.dataUrl, mimeType: a.mimeType }
      ),
    ];

    // Send message
    await chat.sendMessage({ text, parts });

    // Clear attachments after send
    clearAttachments();
  }, [attachments, chat, clearAttachments]);

  return {
    ...chat,
    attachments,
    addAttachment,
    removeAttachment,
    clearAttachments,
    sendMessage: sendMessageWithAttachments,
  };
}
```

### Drop Zone Component

```tsx
// components/ai-elements/drop-zone.tsx
import { useCallback, useState } from 'react';
import { ImageIcon, FileIcon, XIcon } from 'lucide-react';

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  acceptedTypes?: string[];
  maxFiles?: number;
  maxSizeMB?: number;
  children: React.ReactNode;
}

export function DropZone({
  onFilesAdded,
  acceptedTypes = ['image/*', 'application/pdf'],
  maxFiles = 5,
  maxSizeMB = 10,
  children
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files)
      .filter(file => {
        // Check type
        const isValidType = acceptedTypes.some(type => {
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.replace('/*', ''));
          }
          return file.type === type;
        });

        // Check size
        const isValidSize = file.size <= maxSizeMB * 1024 * 1024;

        return isValidType && isValidSize;
      })
      .slice(0, maxFiles);

    if (files.length > 0) {
      onFilesAdded(files);
    }
  }, [acceptedTypes, maxFiles, maxSizeMB, onFilesAdded]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative transition-all ${
        isDragging
          ? 'ring-2 ring-primary ring-offset-2 bg-primary/5'
          : ''
      }`}
    >
      {isDragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg border-2 border-dashed border-primary">
          <div className="text-center">
            <ImageIcon className="size-8 mx-auto text-primary" />
            <p className="text-sm font-medium mt-2">Drop files here</p>
            <p className="text-xs text-muted-foreground">Images, PDFs up to {maxSizeMB}MB</p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
```

### Attachment Preview Component

```tsx
// components/ai-elements/attachment-preview.tsx
import { ImageIcon, FileIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Attachment {
  id: string;
  type: 'image' | 'file';
  name: string;
  dataUrl: string;
}

interface AttachmentPreviewProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

export function AttachmentPreview({ attachments, onRemove }: AttachmentPreviewProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="flex gap-2 p-2 overflow-x-auto">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="relative shrink-0 group"
        >
          {attachment.type === 'image' ? (
            <img
              src={attachment.dataUrl}
              alt={attachment.name}
              className="size-16 object-cover rounded-md border"
            />
          ) : (
            <div className="size-16 flex items-center justify-center bg-muted rounded-md border">
              <FileIcon className="size-6 text-muted-foreground" />
            </div>
          )}
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 size-5 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(attachment.id)}
          >
            <XIcon className="size-3" />
          </Button>
          <p className="text-[10px] text-muted-foreground truncate max-w-16 mt-1">
            {attachment.name}
          </p>
        </div>
      ))}
    </div>
  );
}
```

### Paste Handler Integration

```tsx
// In PromptInputTextarea
const handlePaste = useCallback((e: React.ClipboardEvent) => {
  const items = e.clipboardData.items;
  const files: File[] = [];

  for (const item of items) {
    if (item.kind === 'file') {
      const file = item.getAsFile();
      if (file) files.push(file);
    }
  }

  if (files.length > 0) {
    e.preventDefault(); // Prevent pasting file as text
    files.forEach(addAttachment);
  }
  // Let text paste through normally
}, [addAttachment]);
```

### Server Route Update

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Messages with parts are handled automatically by AI SDK
  const result = await streamText({
    model: anthropic('claude-sonnet-4-20250514'), // Vision capable
    messages: messages.map(m => ({
      role: m.role,
      content: m.parts || m.content, // Support both formats
    })),
    system: SYSTEM_PROMPT,
  });

  return result.toDataStreamResponse();
}
```

## Supported File Types

| Type | Extensions | Max Size | Use Case |
|------|------------|----------|----------|
| Images | png, jpg, gif, webp | 10MB | Screenshots, wireframes, charts |
| PDFs | pdf | 10MB | Reports, documentation |
| Text | txt, md, json | 1MB | Code snippets, configs |

## UX Flow

### Drag & Drop
1. User drags image onto chat area
2. Drop zone highlights
3. Thumbnail preview appears above input
4. User adds text and sends

### Paste (Cmd+V)
1. User copies screenshot (Cmd+Shift+4)
2. Pastes into chat input
3. Image preview appears
4. User sends with optional text

### Upload Button
1. User clicks attachment icon
2. File picker opens
3. Selects files
4. Previews appear, user sends

## Demo Script

1. **User**: Takes screenshot of wireframe, pastes into chat
2. **Preview**: Thumbnail appears above input
3. **User**: Types "What A/B tests would you suggest for this layout?"
4. **AI**: Analyzes image, suggests 3 tests with mockup descriptions
5. **User**: "Create an experiment for the CTA position test"
6. **AI**: Creates experiment in PostHog

## Implementation Checklist

- [ ] Create `useChatWithAttachments` hook
- [ ] Create `DropZone` wrapper component
- [ ] Create `AttachmentPreview` component
- [ ] Add paste handler to textarea
- [ ] Add upload button to input toolbar
- [ ] Update chat route for multi-modal
- [ ] Handle file size limits
- [ ] Show upload progress for large files
- [ ] Compress images before sending
- [ ] Test with various file types

## Edge Cases

- **Large images**: Compress to max 2MB before encoding
- **Multiple files**: Support up to 5 per message
- **Invalid types**: Show toast error, ignore file
- **Paste + text**: Support mixed paste (image + text)

## Dependencies

- AI SDK with multi-modal support (built-in)
- Claude claude-sonnet-4-20250514 (vision capable)
- No external dependencies

## Estimated Effort

**Medium** - UI components + hook modifications.

## Related Features

- Screenshot to Experiment (Feature #2)
- Voice Input (Feature #1)
