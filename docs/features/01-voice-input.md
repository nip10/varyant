# Feature: Voice Input

> Talk to the copilot using voice commands

## Overview

Enable users to interact with the Varyant copilot using voice input, making it faster and more natural to request analytics, create experiments, and manage feature flags.

## User Story

As a product manager, I want to speak my questions to the copilot so that I can get insights quickly without typing, especially during meetings or while reviewing dashboards.

## Technical Approach

### Web Speech API (Recommended)

Use the browser's built-in `SpeechRecognition` API for a zero-dependency solution:

```typescript
// lib/hooks/use-voice-input.ts
import { useState, useCallback, useEffect } from 'react';

interface UseVoiceInputOptions {
  onTranscript: (text: string) => void;
  onInterim?: (text: string) => void;
  continuous?: boolean;
}

export function useVoiceInput({ onTranscript, onInterim, continuous = false }: UseVoiceInputOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');

      if (event.results[event.results.length - 1].isFinal) {
        onTranscript(transcript);
      } else {
        onInterim?.(transcript);
      }
    };

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
  }, [continuous, onTranscript, onInterim]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  return { isListening, isSupported, startListening, stopListening };
}
```

### UI Component

```tsx
// components/ai-elements/voice-input.tsx
import { MicIcon, MicOffIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceInput } from '@/lib/hooks/use-voice-input';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  onInterim?: (text: string) => void;
}

export function VoiceInputButton({ onTranscript, onInterim }: VoiceInputButtonProps) {
  const { isListening, isSupported, startListening, stopListening } = useVoiceInput({
    onTranscript,
    onInterim,
  });

  if (!isSupported) return null;

  return (
    <Button
      variant={isListening ? "destructive" : "ghost"}
      size="icon"
      onClick={isListening ? stopListening : startListening}
      className="relative"
    >
      {isListening ? (
        <>
          <MicOffIcon className="size-4" />
          <span className="absolute -top-1 -right-1 size-2 bg-red-500 rounded-full animate-pulse" />
        </>
      ) : (
        <MicIcon className="size-4" />
      )}
    </Button>
  );
}
```

### Integration with PromptInput

```tsx
// In PromptInputFooter
<PromptInputTools>
  <VoiceInputButton
    onTranscript={(text) => {
      textInput.setInput(text);
      submit(); // Auto-submit after voice input
    }}
    onInterim={(text) => {
      textInput.setInput(text); // Show interim results
    }}
  />
</PromptInputTools>
```

## UX Considerations

### Visual Feedback
- **Listening state**: Pulsing red dot, waveform animation
- **Interim transcription**: Show grayed text in input as user speaks
- **Finalization**: Flash green, auto-submit or allow edit

### Keyboard Shortcut
- `Cmd+Shift+V` or `Space` (when input focused) to toggle voice

### Error Handling
- Graceful fallback when Speech API not supported
- Handle microphone permission denied
- Show clear error messages

## Demo Flow

1. User clicks mic button (or uses keyboard shortcut)
2. Visual feedback shows listening state
3. User says: "Show me the conversion rate for the last 7 days"
4. Transcript appears in input with typing animation
5. Auto-submits after 1.5s pause (or immediately on "send" command)
6. Copilot responds with insights

## Implementation Checklist

- [ ] Create `useVoiceInput` hook
- [ ] Create `VoiceInputButton` component
- [ ] Add to `PromptInputTools`
- [ ] Add visual feedback (waveform, pulse)
- [ ] Add keyboard shortcut
- [ ] Handle errors gracefully
- [ ] Test on Chrome/Safari/Edge
- [ ] Add analytics for voice usage

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | Full |
| Safari | Full |
| Edge | Full |
| Firefox | Limited (needs flag) |

## Dependencies

- None (uses Web APIs)
- Optional: `recordrtc` for better audio handling
- Optional: `@huggingface/inference` for Whisper fallback

## Estimated Effort

**Low** - Uses built-in browser APIs, minimal code required.

## Related Features

- Multi-modal Input (Feature #7)
- Command Palette (Feature #11)
