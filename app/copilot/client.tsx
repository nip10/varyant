"use client";

import { useChat } from "@ai-sdk/react";
import { lastAssistantMessageIsCompleteWithApprovalResponses } from "ai";
import { AlertCircleIcon, ImageIcon, Loader2Icon, MicIcon, MicOffIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useKeyboardShortcuts } from "@/lib/hooks/use-keyboard-shortcuts";
import { useVoiceInput } from "@/lib/hooks/use-voice-input";
import { useAttachments, type Attachment } from "@/lib/hooks/use-attachments";
import { DropZone } from "@/components/ai-elements/drop-zone";
import { AttachmentPreviewInline } from "@/components/ai-elements/attachment-preview";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { CopilotEmptyState } from "@/components/ai-elements/empty-state";
import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputMessage,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputController,
} from "@/components/ai-elements/prompt-input";
import {
  SlashCommands,
  useSlashCommands,
} from "@/components/ai-elements/slash-commands";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import {
  ToolHeader,
} from "@/components/ai-elements/tool";
import { MyUIMessage } from "@/lib/ai/tools";
import { getToolEntry } from "@/components/tool-results";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ToolUIPart } from "ai";
import { MessageRenderer, type ExtendedToolPart } from "@/components/copilot";

// Tool-specific loading indicator with skeleton
function ToolLoading({ toolType }: { toolType: string }) {
  const entry = getToolEntry(toolType);
  if (!entry) return null;

  const SkeletonComponent = entry.SkeletonComponent;

  return (
    <div>
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{entry.loadingText}</span>
      </div>
      {SkeletonComponent && <SkeletonComponent />}
    </div>
  );
}

// Custom tool header with icon and color from registry
function CustomToolHeader({ type, state }: { type: string; state: ToolUIPart["state"] }) {
  const entry = getToolEntry(type);

  if (!entry) {
    return <ToolHeader type={type as ToolUIPart["type"]} state={state} />;
  }

  const Icon = entry.icon;

  const statusLabels: Record<ToolUIPart["state"], string> = {
    "input-streaming": "Preparing",
    "input-available": "Running",
    "approval-requested": "Awaiting Approval",
    "approval-responded": "Approved",
    "output-available": "Completed",
    "output-error": "Error",
    "output-denied": "Denied",
  };

  const statusColors: Record<ToolUIPart["state"], string> = {
    "input-streaming": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    "input-available": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    "approval-requested": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    "approval-responded": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "output-available": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "output-error": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "output-denied": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  };

  return (
    <div className="flex w-full items-center justify-between gap-4 p-3">
      <div className="flex items-center gap-2">
        <div className={cn("flex size-6 items-center justify-center rounded", entry.color.replace("text-", "bg-").replace("500", "100"))}>
          <Icon className={cn("size-3.5", entry.color)} />
        </div>
        <span className="font-medium text-sm">{entry.title}</span>
      </div>
      <Badge className={cn("text-xs", statusColors[state])}>
        {statusLabels[state]}
      </Badge>
    </div>
  );
}

// Tool error display component
function ToolError({ errorText, toolName }: { errorText: string; toolName?: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-b-md animate-in fade-in duration-200">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
        <AlertCircleIcon className="size-4 text-red-500" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-red-700 dark:text-red-400">
          {toolName ? `${toolName} failed` : "Tool execution failed"}
        </h4>
        <p className="text-sm text-red-600 dark:text-red-400/80 mt-1 whitespace-pre-wrap">
          {errorText}
        </p>
      </div>
    </div>
  );
}

// Render tool result using registry
function ToolResult({ part }: { part: ExtendedToolPart }) {
  const entry = getToolEntry(part.type);

  // Handle error state
  if (part.state === "output-error" && part.errorText) {
    return <ToolError errorText={part.errorText} toolName={entry?.title} />;
  }

  // Handle denied state
  if (part.state === "output-denied") {
    return (
      <div className="flex items-center gap-2 p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-b-md animate-in fade-in duration-200">
        <AlertCircleIcon className="size-4 shrink-0" />
        <span className="text-sm">This action was denied.</span>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="p-4 text-xs text-muted-foreground">
        <pre className="whitespace-pre-wrap">
          {JSON.stringify(part.output, null, 2)}
        </pre>
      </div>
    );
  }

  const ResultComponent = entry.ResultComponent;

  // Show loading state
  if (part.state === "input-available" || part.state === "input-streaming") {
    return <ToolLoading toolType={part.type} />;
  }

  return (
    <ResultComponent
      input={part.input}
      output={part.output}
      state={part.state}
      errorText={part.errorText}
    />
  );
}

// Render tool approval using registry
function ToolApproval({ part }: { part: ExtendedToolPart }) {
  const entry = getToolEntry(part.type);

  if (!entry) {
    return (
      <div className="flex flex-col gap-2 p-3">
        <span className="text-sm">
          Approve tool <span className="font-semibold">{part.type}</span>?
        </span>
        <pre className="text-xs bg-muted/50 p-2 rounded-md block text-wrap">
          {JSON.stringify(part.input, null, 2)}
        </pre>
      </div>
    );
  }

  const ApprovalComponent = entry.ApprovalComponent;

  return (
    <ApprovalComponent
      input={part.input}
      toolName={part.type}
    />
  );
}

// Contextual suggestions based on conversation state
const QUICK_SUGGESTIONS = [
  "Show me all PostHog insights",
  "Create a feature flag",
  "What experiments are running?",
  "Create a Linear ticket",
];

const FOLLOW_UP_SUGGESTIONS = [
  "Tell me more",
  "Create an experiment for this",
  "Update the status",
  "Show related metrics",
];

// Inner component that can access the prompt input controller
function CopilotChatContent({
  messages,
  status,
  addToolApprovalResponse,
  onSuggestionClick,
}: {
  messages: MyUIMessage[];
  status: ReturnType<typeof useChat>["status"];
  addToolApprovalResponse: ReturnType<typeof useChat>["addToolApprovalResponse"];
  onSuggestionClick: (suggestion: string) => void;
}) {
  const { textInput } = usePromptInputController();

  const handlePromptSelect = (prompt: string) => {
    textInput.setInput(prompt);
  };

  return (
    <Conversation className="border border-border rounded-md">
      <ConversationContent>
        {messages.length === 0 ? (
          <CopilotEmptyState onPromptSelect={handlePromptSelect} />
        ) : (
          messages.map((message, i) => (
            <MessageRenderer
              key={`${message.id}-${i}-message`}
              message={message}
              messages={messages}
              status={status}
              addToolApprovalResponse={addToolApprovalResponse}
              CustomToolHeader={CustomToolHeader}
              ToolResult={ToolResult}
              ToolApproval={ToolApproval}
            />
          ))
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}

// Suggestions bar component
function SuggestionsBar({
  hasMessages,
  onSuggestionClick,
  isLoading,
}: {
  hasMessages: boolean;
  onSuggestionClick: (suggestion: string) => void;
  isLoading: boolean;
}) {
  const suggestions = hasMessages ? FOLLOW_UP_SUGGESTIONS : QUICK_SUGGESTIONS;

  if (isLoading) return null;

  return (
    <Suggestions className="px-1 py-2">
      {suggestions.map((suggestion) => (
        <Suggestion
          key={suggestion}
          suggestion={suggestion}
          onClick={onSuggestionClick}
          className="text-xs"
        />
      ))}
    </Suggestions>
  );
}

interface CopilotClientProps {
  initialPrompt?: string;
}

// Inner prompt input component that can access the controller
function PromptInputWithSuggestions({
  onSubmit,
  status,
  hasMessages,
  attachments,
  onAddFiles,
  onRemoveAttachment,
  isProcessingAttachments,
}: {
  onSubmit: (message: PromptInputMessage) => void;
  status: ReturnType<typeof useChat>["status"];
  hasMessages: boolean;
  attachments: Attachment[];
  onAddFiles: (files: File[]) => Promise<void>;
  onRemoveAttachment: (id: string) => void;
  isProcessingAttachments: boolean;
}) {
  const { textInput, textareaRef, submit } = usePromptInputController();
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSuggestionClick = (suggestion: string) => {
    textInput.setInput(suggestion);
  };

  // Open file dialog
  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onAddFiles(Array.from(files));
      }
      // Reset input to allow selecting the same file again
      e.target.value = "";
    },
    [onAddFiles]
  );

  const {
    isOpen: isSlashCommandsOpen,
    slashCommandsRef,
    handleSelect: handleSlashCommandSelect,
    handleClose: handleSlashCommandClose,
    handleKeyDown: handleSlashCommandKeyDown,
  } = useSlashCommands(textInput.value, textInput.setInput);

  const isLoading = status === "streaming" || status === "submitted";

  // Voice input hook
  const {
    isListening,
    isSpeaking,
    isSupported: isVoiceSupported,
    toggleListening,
    error: voiceInputError,
  } = useVoiceInput({
    onTranscript: (text) => {
      textInput.setInput(text);
      // Auto-submit after a short delay
      setTimeout(() => {
        submit();
      }, 300);
    },
    onInterim: (text) => {
      textInput.setInput(text);
    },
    onError: (error) => {
      setVoiceError(error.message);
      // Clear error after 3 seconds
      setTimeout(() => setVoiceError(null), 3000);
    },
    continuous: false,
    silenceTimeout: 1500,
  });

  // Focus the textarea
  const focusTextarea = useCallback(() => {
    textareaRef.current?.focus();
  }, [textareaRef]);

  // Clear the input and close any dropdowns
  const clearInput = useCallback(() => {
    textInput.clear();
    // Also close slash commands if open
    handleSlashCommandClose();
  }, [textInput, handleSlashCommandClose]);

  // Submit the form (only when textarea is focused)
  const handleSubmit = useCallback(() => {
    // Only submit if the textarea is focused
    if (document.activeElement === textareaRef.current) {
      submit();
    }
  }, [textareaRef, submit]);

  // Keyboard shortcuts
  const shortcuts = useMemo(() => [
    {
      key: 'k',
      meta: true,
      callback: focusTextarea,
    },
    {
      key: 'Enter',
      meta: true,
      callback: handleSubmit,
    },
    {
      key: 'Escape',
      callback: clearInput,
    },
    // Voice input shortcut: Cmd/Ctrl + Shift + V
    {
      key: 'v',
      meta: true,
      shift: true,
      callback: toggleListening,
    },
  ], [focusTextarea, handleSubmit, clearInput, toggleListening]);

  useKeyboardShortcuts(shortcuts);

  return (
    <div className="space-y-2">
      <SuggestionsBar
        hasMessages={hasMessages}
        onSuggestionClick={handleSuggestionClick}
        isLoading={isLoading}
      />
      <div className="relative">
        {isSlashCommandsOpen && (
          <SlashCommands
            ref={slashCommandsRef}
            inputValue={textInput.value}
            onSelect={handleSlashCommandSelect}
            onClose={handleSlashCommandClose}
          />
        )}
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
        />
        <PromptInput onSubmit={onSubmit}>
          {/* Attachment previews */}
          {(attachments.length > 0 || isProcessingAttachments) && (
            <PromptInputHeader>
              <AttachmentPreviewInline
                attachments={attachments}
                onRemove={onRemoveAttachment}
                isProcessing={isProcessingAttachments}
              />
            </PromptInputHeader>
          )}
          <PromptInputTextarea
            placeholder="Ask the copilot anything about your analytics... (type / for commands)"
            onKeyDown={(e) => {
              if (handleSlashCommandKeyDown(e)) {
                // Event was handled by slash commands, don't propagate
                return;
              }
            }}
          />
          <PromptInputFooter>
            <PromptInputTools className="text-xs text-muted-foreground gap-2">
              {/* Image attachment button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <PromptInputButton
                    onClick={openFileDialog}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ImageIcon className="size-4" />
                  </PromptInputButton>
                </TooltipTrigger>
                <TooltipContent>Add images (drag & drop or paste)</TooltipContent>
              </Tooltip>

              {/* Voice input button */}
              {isVoiceSupported && (
                <Tooltip open={isListening || voiceError ? true : undefined}>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant={isListening ? "destructive" : "ghost"}
                      size="icon-sm"
                      onClick={toggleListening}
                      disabled={isLoading}
                      className={cn(
                        "relative transition-all duration-200",
                        isListening && "ring-2 ring-red-500/50"
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
                    {voiceError ? (
                      <span className="flex items-center gap-1.5 text-red-400">
                        <AlertCircleIcon className="size-3" />
                        {voiceError}
                      </span>
                    ) : isListening ? (
                      isSpeaking ? "Listening... (speak now)" : "Listening... (waiting for speech)"
                    ) : (
                      <span className="flex items-center gap-1.5">
                        Voice input
                        <kbd className="px-1 py-0.5 text-[10px] font-mono bg-muted/50 rounded">
                          {typeof window !== 'undefined' && navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+Shift+V
                        </kbd>
                      </span>
                    )}
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Keyboard shortcut hint */}
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 font-mono bg-muted rounded border">
                  {typeof window !== 'undefined' && navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+K
                </kbd>
                <span className="hidden sm:inline ml-1">to focus</span>
              </div>
            </PromptInputTools>
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

// Chat error display component
function ChatError({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="flex items-start gap-3 p-4 mx-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/40">
        <AlertCircleIcon className="size-5 text-red-500" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-red-700 dark:text-red-400">
          Failed to send message
        </h4>
        <p className="text-sm text-red-600 dark:text-red-400/80 mt-1">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-3 gap-1.5 text-red-600 border-red-300 hover:bg-red-100 dark:hover:bg-red-900/30"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}

export default function CopilotClient({ initialPrompt }: CopilotClientProps) {
  const { messages, sendMessage, status, addToolApprovalResponse, error } =
    useChat<MyUIMessage>({
      sendAutomaticallyWhen:
        lastAssistantMessageIsCompleteWithApprovalResponses,
    });

  // Attachments hook for multi-modal input
  const {
    attachments,
    addFiles,
    removeAttachment,
    clearAttachments,
    isProcessing: isProcessingAttachments,
  } = useAttachments({
    maxFiles: 5,
    maxSizeMB: 10,
    compressImages: true,
    maxImageDimension: 2048,
  });

  // Track the last user message for retry functionality
  const lastUserMessageRef = useRef<string | null>(null);
  // Track last attachments for retry
  const lastAttachmentsRef = useRef<Attachment[]>([]);

  // Track if we've already sent the initial prompt to avoid double-sending
  const hasSentInitialPrompt = useRef(false);

  // Auto-send the initial prompt when the component mounts
  useEffect(() => {
    if (initialPrompt && !hasSentInitialPrompt.current && status === "ready") {
      hasSentInitialPrompt.current = true;
      sendMessage({ text: initialPrompt });
    }
  }, [initialPrompt, sendMessage, status]);

  const handleSend = async ({ text }: PromptInputMessage) => {
    if (!text.trim() && attachments.length === 0) return;

    lastUserMessageRef.current = text;
    lastAttachmentsRef.current = attachments;

    // Build files array for multi-modal messages using FileUIPart format
    if (attachments.length > 0) {
      const files = attachments
        .filter((attachment) => attachment.type === "image")
        .map((attachment) => ({
          type: "file" as const,
          mediaType: attachment.mimeType,
          filename: attachment.name,
          url: attachment.dataUrl,
        }));

      await sendMessage({
        text: text.trim() || "Analyze this image",
        files,
      });
    } else {
      await sendMessage({
        text,
      });
    }

    // Clear attachments after sending
    clearAttachments();
  };

  const handleSuggestionClick = (suggestion: string) => {
    lastUserMessageRef.current = suggestion;
    sendMessage({ text: suggestion });
  };

  const handleRetry = () => {
    if (lastUserMessageRef.current) {
      sendMessage({ text: lastUserMessageRef.current });
    }
  };

  // Handle files dropped on the chat area
  const handleFilesAdded = useCallback(
    (files: File[]) => {
      addFiles(files);
    },
    [addFiles]
  );

  return (
    <PromptInputProvider>
      <DropZone
        onFilesAdded={handleFilesAdded}
        acceptedTypes={["image/png", "image/jpeg", "image/gif", "image/webp"]}
        maxFiles={5}
        maxSizeMB={10}
        disabled={status === "streaming" || status === "submitted"}
        className="size-full"
      >
        <div className="relative flex size-full flex-col overflow-hidden px-2 py-4 bg-background max-h-[calc(100dvh-80px)] gap-2">
          <CopilotChatContent
            messages={messages}
            status={status}
            addToolApprovalResponse={addToolApprovalResponse}
            onSuggestionClick={handleSuggestionClick}
          />

          {error && (
            <ChatError error={error} onRetry={handleRetry} />
          )}

          <PromptInputWithSuggestions
            onSubmit={handleSend}
            status={status}
            hasMessages={messages.length > 0}
            attachments={attachments}
            onAddFiles={addFiles}
            onRemoveAttachment={removeAttachment}
            isProcessingAttachments={isProcessingAttachments}
          />
        </div>
      </DropZone>
    </PromptInputProvider>
  );
}
