"use client";

import { MicIcon, MicOffIcon, AlertCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useVoiceInput, type VoiceInputError } from "@/lib/hooks/use-voice-input";
import { cn } from "@/lib/utils";
import { useCallback, useState, useEffect } from "react";

// ============================================================================
// Types
// ============================================================================

export interface VoiceInputButtonProps {
  /** Called when final transcript is available */
  onTranscript: (text: string) => void;
  /** Called with interim transcript as user speaks */
  onInterim?: (text: string) => void;
  /** Called when an error occurs */
  onError?: (error: VoiceInputError) => void;
  /** Whether to auto-submit after speech ends */
  autoSubmit?: boolean;
  /** Callback for auto-submit */
  onAutoSubmit?: () => void;
  /** Delay before auto-submit in ms. Default: 800 */
  autoSubmitDelay?: number;
  /** Additional class names */
  className?: string;
  /** Button size variant */
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
  /** Whether the button is disabled */
  disabled?: boolean;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Voice input button with visual feedback for the copilot.
 *
 * Features:
 * - Pulsing indicator when listening
 * - Wave animation when speaking
 * - Tooltip with status/keyboard shortcut
 * - Graceful handling of unsupported browsers
 *
 * @example
 * ```tsx
 * <VoiceInputButton
 *   onTranscript={(text) => setInput(text)}
 *   onInterim={(text) => setInterimText(text)}
 *   autoSubmit
 *   onAutoSubmit={() => formRef.current?.submit()}
 * />
 * ```
 */
export function VoiceInputButton({
  onTranscript,
  onInterim,
  onError,
  autoSubmit = false,
  onAutoSubmit,
  autoSubmitDelay = 800,
  className,
  size = "icon-sm",
  disabled = false,
}: VoiceInputButtonProps) {
  const [showError, setShowError] = useState(false);
  const [autoSubmitPending, setAutoSubmitPending] = useState(false);

  const handleTranscript = useCallback(
    (text: string) => {
      onTranscript(text);

      // Trigger auto-submit if enabled
      if (autoSubmit && onAutoSubmit && text.trim()) {
        setAutoSubmitPending(true);
      }
    },
    [onTranscript, autoSubmit, onAutoSubmit]
  );

  const handleError = useCallback(
    (error: VoiceInputError) => {
      setShowError(true);
      onError?.(error);

      // Hide error tooltip after 3 seconds
      setTimeout(() => setShowError(false), 3000);
    },
    [onError]
  );

  const {
    isListening,
    isSpeaking,
    isSupported,
    interimTranscript,
    toggleListening,
    error,
  } = useVoiceInput({
    onTranscript: handleTranscript,
    onInterim,
    onError: handleError,
    continuous: false,
    silenceTimeout: 1500,
  });

  // Handle auto-submit with delay
  useEffect(() => {
    if (!autoSubmitPending || isListening) return;

    const timer = setTimeout(() => {
      onAutoSubmit?.();
      setAutoSubmitPending(false);
    }, autoSubmitDelay);

    return () => clearTimeout(timer);
  }, [autoSubmitPending, isListening, autoSubmitDelay, onAutoSubmit]);

  // Don't render if not supported
  if (!isSupported) {
    return null;
  }

  // Determine tooltip content
  const getTooltipContent = () => {
    if (error && showError) {
      return (
        <span className="flex items-center gap-1.5 text-red-400">
          <AlertCircleIcon className="size-3" />
          {error.message}
        </span>
      );
    }

    if (isListening) {
      if (isSpeaking) {
        return "Listening... (speak now)";
      }
      return "Listening... (waiting for speech)";
    }

    if (interimTranscript) {
      return `Heard: "${interimTranscript}"`;
    }

    return (
      <span className="flex items-center gap-1.5">
        Voice input
        <kbd className="px-1 py-0.5 text-[10px] font-mono bg-muted/50 rounded">
          {typeof window !== 'undefined' && navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+Shift+V
        </kbd>
      </span>
    );
  };

  return (
    <Tooltip open={isListening || showError ? true : undefined}>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={isListening ? "destructive" : "ghost"}
          size={size}
          onClick={toggleListening}
          disabled={disabled}
          className={cn(
            "relative transition-all duration-200",
            isListening && "ring-2 ring-red-500/50",
            className
          )}
          aria-label={isListening ? "Stop voice input" : "Start voice input"}
          aria-pressed={isListening}
        >
          {/* Mic icon */}
          {isListening ? (
            <MicOffIcon className="size-4" />
          ) : (
            <MicIcon className="size-4" />
          )}

          {/* Pulsing indicator when listening */}
          {isListening && (
            <span
              className={cn(
                "absolute -top-0.5 -right-0.5 size-2.5 rounded-full",
                isSpeaking
                  ? "bg-green-500 animate-pulse"
                  : "bg-red-500 animate-pulse"
              )}
            />
          )}

          {/* Wave animation when speaking */}
          {isListening && isSpeaking && (
            <span className="absolute inset-0 rounded-md animate-ping bg-red-500/20" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        {getTooltipContent()}
      </TooltipContent>
    </Tooltip>
  );
}

// ============================================================================
// Keyboard Shortcut Hook
// ============================================================================

/**
 * Hook to add keyboard shortcut for voice input.
 * Call this in a parent component and pass the toggle function.
 *
 * @example
 * ```tsx
 * const { toggleListening } = useVoiceInput(...);
 * useVoiceInputShortcut(toggleListening);
 * ```
 */
export function useVoiceInputShortcut(
  toggleListening: () => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + V
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        toggleListening();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleListening, enabled]);
}
