# Feature: Screenshot to Experiment

> Paste or upload a screenshot, AI suggests A/B tests

## Overview

Allow users to paste or upload screenshots of their UI, landing pages, or competitor sites. The AI analyzes the visual content and suggests relevant A/B test ideas, complete with hypothesis, metrics, and implementation guidance.

## User Story

As a growth marketer, I want to share a screenshot of my landing page with the copilot so that it can suggest specific A/B tests to improve conversion.

## Technical Approach

### AI SDK Multi-modal Support

The AI SDK supports sending images via the `parts` array in messages:

```typescript
// Using useChat with attachments
import { useChat } from '@ai-sdk/react';

const { messages, sendMessage } = useChat();

// Send message with image attachment
sendMessage({
  text: "Analyze this landing page and suggest A/B tests",
  parts: [
    { type: 'text', text: 'Analyze this landing page and suggest A/B tests' },
    { type: 'image', image: dataUrl }, // base64 data URL
  ],
});
```

### Image Input Component

```tsx
// components/ai-elements/image-input.tsx
import { useState, useCallback } from 'react';
import { ImageIcon, XIcon, UploadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageInputProps {
  onImageSelect: (dataUrl: string) => void;
  onImageRemove: () => void;
  selectedImage?: string;
}

export function ImageInput({ onImageSelect, onImageRemove, selectedImage }: ImageInputProps) {
  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            onImageSelect(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  }, [onImageSelect]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  return (
    <div className="relative">
      {selectedImage ? (
        <div className="relative inline-block">
          <img
            src={selectedImage}
            alt="Selected"
            className="max-h-32 rounded-md border"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 size-6"
            onClick={onImageRemove}
          >
            <XIcon className="size-3" />
          </Button>
        </div>
      ) : (
        <label className="flex items-center gap-2 px-3 py-2 border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
          <UploadIcon className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Drop image or <span className="text-primary underline">browse</span>
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </label>
      )}
    </div>
  );
}
```

### System Prompt Enhancement

```typescript
const SCREENSHOT_ANALYSIS_PROMPT = `
When analyzing a screenshot or image:

1. **Visual Analysis**
   - Identify key UI elements (CTAs, forms, navigation, hero sections)
   - Note visual hierarchy and emphasis points
   - Assess color usage and contrast
   - Identify potential friction points

2. **A/B Test Suggestions**
   For each suggestion provide:
   - **Hypothesis**: What we believe and why
   - **Change**: Specific modification to test
   - **Primary Metric**: What to measure
   - **Expected Impact**: Low/Medium/High
   - **Implementation Effort**: Easy/Medium/Hard

3. **Output Format**
   Provide 3-5 prioritized test ideas, starting with highest impact + lowest effort.

4. **Available Actions**
   After analysis, offer to:
   - Create a PostHog experiment for any suggestion
   - Create a Linear ticket for implementation
   - Capture a fresh screenshot of the URL (if provided)
`;
```

### Route Handler

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Messages with images are handled automatically
  const result = await streamText({
    model: anthropic('claude-sonnet-4-20250514'),
    messages,
    system: SCREENSHOT_ANALYSIS_PROMPT,
  });

  return result.toDataStreamResponse();
}
```

## UX Flow

### Option A: Paste Anywhere
1. User copies screenshot (Cmd+Shift+4 on Mac)
2. Pastes directly into chat input (Cmd+V)
3. Thumbnail preview appears above input
4. User types optional context: "This is our pricing page"
5. Submits, AI analyzes and suggests tests

### Option B: Drag & Drop
1. User drags image file onto chat
2. Drop zone highlights
3. Image preview appears
4. User adds context and submits

### Option C: Upload Button
1. User clicks image/attachment icon in input toolbar
2. File picker opens
3. Selects image
4. Continues as above

## Demo Flow

1. **Open copilot**, paste screenshot of landing page
2. **AI analyzes**: "I can see a hero section with a headline, CTA button, and feature list. Here are my suggested A/B tests..."
3. **Shows 4 test ideas** with hypothesis, metrics, effort
4. **User selects one**: "Create experiment for the CTA color test"
5. **AI creates experiment** in PostHog, offers to create implementation ticket

## Implementation Checklist

- [ ] Add paste event listener to PromptInputTextarea
- [ ] Create ImageInput component for drag/drop/upload
- [ ] Update sendMessage to support parts array
- [ ] Update route handler for multi-modal messages
- [ ] Add image thumbnail preview in chat
- [ ] Add system prompt for screenshot analysis
- [ ] Test with various image types/sizes
- [ ] Add image compression for large files

## Edge Cases

- **Large images**: Compress to max 1MB before sending
- **Non-image paste**: Ignore and let text paste work
- **Multiple images**: Support up to 3 images per message
- **Invalid format**: Show error toast

## Dependencies

- AI SDK with multi-modal support (built-in)
- Claude claude-sonnet-4-20250514 (vision capable)
- No external image processing needed

## Estimated Effort

**Medium** - Requires UI components + route handler updates.

## Related Features

- Multi-modal Input (Feature #7)
- Competitor Intelligence (Feature #3)
