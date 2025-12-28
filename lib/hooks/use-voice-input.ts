import { useState, useCallback, useEffect, useRef } from 'react';

// ============================================================================
// Web Speech API Type Declarations (local types to avoid conflicts)
// ============================================================================

// Use a local interface to avoid conflicts with global declarations
interface VoiceSpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives?: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((ev: Event) => void) | null;
  onend: ((ev: Event) => void) | null;
  onresult: ((ev: VoiceSpeechRecognitionEvent) => void) | null;
  onerror: ((ev: VoiceSpeechRecognitionErrorEvent) => void) | null;
  onspeechstart?: ((ev: Event) => void) | null;
  onspeechend?: ((ev: Event) => void) | null;
  onaudiostart?: ((ev: Event) => void) | null;
  onaudioend?: ((ev: Event) => void) | null;
}

interface VoiceSpeechRecognitionEvent {
  readonly results: VoiceSpeechRecognitionResultList;
  readonly resultIndex: number;
}

interface VoiceSpeechRecognitionResultList {
  readonly length: number;
  [index: number]: VoiceSpeechRecognitionResult;
}

interface VoiceSpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  [index: number]: VoiceSpeechRecognitionAlternative;
}

interface VoiceSpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface VoiceSpeechRecognitionErrorEvent {
  readonly error: SpeechRecognitionErrorCode;
  readonly message?: string;
}

type SpeechRecognitionErrorCode =
  | 'aborted'
  | 'audio-capture'
  | 'bad-grammar'
  | 'language-not-supported'
  | 'network'
  | 'no-speech'
  | 'not-allowed'
  | 'service-not-allowed';

// Type for getting the SpeechRecognition constructor from window
type SpeechRecognitionConstructor = new () => VoiceSpeechRecognition;

// ============================================================================
// Hook Types
// ============================================================================

export type VoiceInputError = {
  code: SpeechRecognitionErrorCode | 'unsupported';
  message: string;
};

export interface UseVoiceInputOptions {
  /** Called when final transcript is available */
  onTranscript: (text: string) => void;
  /** Called with interim (partial) transcript as user speaks */
  onInterim?: (text: string) => void;
  /** Called when an error occurs */
  onError?: (error: VoiceInputError) => void;
  /** Keep listening until manually stopped. Default: false */
  continuous?: boolean;
  /** Language for speech recognition. Default: 'en-US' */
  lang?: string;
  /** Auto-stop after this many ms of silence. Default: 1500 */
  silenceTimeout?: number;
}

export interface UseVoiceInputReturn {
  /** Whether currently listening for speech */
  isListening: boolean;
  /** Whether speech is being detected (voice activity) */
  isSpeaking: boolean;
  /** Whether the browser supports speech recognition */
  isSupported: boolean;
  /** Current interim transcript while speaking */
  interimTranscript: string;
  /** Start listening for speech */
  startListening: () => void;
  /** Stop listening for speech */
  stopListening: () => void;
  /** Toggle listening state */
  toggleListening: () => void;
  /** Current error, if any */
  error: VoiceInputError | null;
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for voice input using the Web Speech API.
 *
 * @example
 * ```tsx
 * const { isListening, isSupported, startListening, stopListening } = useVoiceInput({
 *   onTranscript: (text) => setInput(text),
 *   onInterim: (text) => setInterimText(text),
 * });
 * ```
 */
export function useVoiceInput({
  onTranscript,
  onInterim,
  onError,
  continuous = false,
  lang = 'en-US',
  silenceTimeout = 1500,
}: UseVoiceInputOptions): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<VoiceInputError | null>(null);

  const recognitionRef = useRef<VoiceSpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const finalTranscriptRef = useRef('');

  // Check browser support on mount
  useEffect(() => {
    const supported = typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    setIsSupported(supported);
  }, []);

  // Clear silence timeout
  const clearSilenceTimeout = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  }, []);

  // Reset silence timeout
  const resetSilenceTimeout = useCallback(() => {
    clearSilenceTimeout();
    if (!continuous && silenceTimeout > 0) {
      silenceTimeoutRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, silenceTimeout);
    }
  }, [continuous, silenceTimeout, clearSilenceTimeout]);

  // Stop listening
  const stopListening = useCallback(() => {
    clearSilenceTimeout();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setIsSpeaking(false);
    setInterimTranscript('');
  }, [clearSilenceTimeout]);

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported) {
      const err: VoiceInputError = {
        code: 'unsupported',
        message: 'Speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge.',
      };
      setError(err);
      onError?.(err);
      return;
    }

    // Reset state
    setError(null);
    setInterimTranscript('');
    finalTranscriptRef.current = '';

    // Create recognition instance
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      const err: VoiceInputError = {
        code: 'unsupported',
        message: 'Speech recognition is not available.',
      };
      setError(err);
      onError?.(err);
      return;
    }

    const recognition = new SpeechRecognitionAPI() as VoiceSpeechRecognition;
    recognitionRef.current = recognition;

    // Configure recognition
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 1;

    // Event handlers
    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    if ('onspeechstart' in recognition) {
      recognition.onspeechstart = () => {
        setIsSpeaking(true);
        clearSilenceTimeout();
      };
    }

    if ('onspeechend' in recognition) {
      recognition.onspeechend = () => {
        setIsSpeaking(false);
        resetSilenceTimeout();
      };
    }

    recognition.onresult = (event: VoiceSpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript || '';

        if (result.isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      // Update interim display
      if (interim) {
        setInterimTranscript(interim);
        onInterim?.(finalTranscriptRef.current + interim);
      }

      // Handle final transcript
      if (final) {
        finalTranscriptRef.current += final;
        setInterimTranscript('');

        if (!continuous) {
          // In non-continuous mode, deliver transcript and stop
          onTranscript(finalTranscriptRef.current.trim());
          recognition.stop();
        } else {
          // In continuous mode, deliver each final segment
          onTranscript(finalTranscriptRef.current.trim());
        }
      }

      // Reset silence timeout when we get results
      if (interim || final) {
        resetSilenceTimeout();
      }
    };

    recognition.onerror = (event: VoiceSpeechRecognitionErrorEvent) => {
      const errorMessages: Record<SpeechRecognitionErrorCode, string> = {
        'aborted': 'Speech recognition was aborted.',
        'audio-capture': 'No microphone was found or microphone access is blocked.',
        'bad-grammar': 'There was an error in the speech recognition grammar.',
        'language-not-supported': 'The language is not supported.',
        'network': 'A network error occurred. Please check your connection.',
        'no-speech': 'No speech was detected. Please try again.',
        'not-allowed': 'Microphone access was denied. Please allow microphone access.',
        'service-not-allowed': 'Speech recognition service is not allowed.',
      };

      const err: VoiceInputError = {
        code: event.error,
        message: errorMessages[event.error] || `Speech recognition error: ${event.error}`,
      };

      // Don't treat 'no-speech' or 'aborted' as fatal errors
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(err);
        onError?.(err);
      }

      setIsListening(false);
      setIsSpeaking(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsSpeaking(false);
      setInterimTranscript('');
      clearSilenceTimeout();

      // If we have accumulated transcript that wasn't delivered, deliver it now
      if (finalTranscriptRef.current.trim() && !continuous) {
        onTranscript(finalTranscriptRef.current.trim());
      }
    };

    // Start recognition
    try {
      recognition.start();
    } catch (e) {
      const err: VoiceInputError = {
        code: 'aborted',
        message: e instanceof Error ? e.message : 'Failed to start speech recognition.',
      };
      setError(err);
      onError?.(err);
    }
  }, [
    isSupported,
    continuous,
    lang,
    onTranscript,
    onInterim,
    onError,
    clearSilenceTimeout,
    resetSilenceTimeout,
  ]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearSilenceTimeout();
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [clearSilenceTimeout]);

  return {
    isListening,
    isSpeaking,
    isSupported,
    interimTranscript,
    startListening,
    stopListening,
    toggleListening,
    error,
  };
}
