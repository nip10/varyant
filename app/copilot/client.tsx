"use client";

import { useChat } from "@ai-sdk/react";
import { lastAssistantMessageIsCompleteWithApprovalResponses } from "ai";
import { CheckIcon, Loader2Icon, ShieldCheckIcon, XIcon } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
} from "@/components/ai-elements/confirmation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputMessage,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import {
  Tool,
  ToolContent,
  ToolHeader,
} from "@/components/ai-elements/tool";
import { MyUIMessage } from "@/lib/ai/tools";
import { Reasoning } from "@/components/ai-elements/reasoning";
import {
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { getToolEntry, isRegisteredTool } from "@/components/tool-results";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ToolUIPart } from "ai";

// Type guard to check if a part is a tool part with state
function isToolPart(part: any): part is ToolUIPart & { type: string; input: unknown; output: unknown; approval?: { id: string } } {
  return part && typeof part.state === "string" && part.type?.startsWith("tool-");
}

// Tool-specific loading indicator
function ToolLoading({ toolType }: { toolType: string }) {
  const entry = getToolEntry(toolType);
  if (!entry) return null;

  const Icon = entry.icon;

  return (
    <div className="flex items-center gap-3 p-4">
      <div className={cn("flex size-8 items-center justify-center rounded-md bg-muted", entry.color)}>
        <Icon className="size-4" />
      </div>
      <div className="flex items-center gap-2">
        <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{entry.loadingText}</span>
      </div>
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
    "input-streaming": "bg-gray-100 text-gray-700",
    "input-available": "bg-yellow-100 text-yellow-700",
    "approval-requested": "bg-amber-100 text-amber-700",
    "approval-responded": "bg-blue-100 text-blue-700",
    "output-available": "bg-green-100 text-green-700",
    "output-error": "bg-red-100 text-red-700",
    "output-denied": "bg-orange-100 text-orange-700",
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

// Render tool result using registry
function ToolResult({ part }: { part: any }) {
  const entry = getToolEntry(part.type);

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
function ToolApproval({ part, onApprove, onReject }: {
  part: any;
  onApprove: () => void;
  onReject: () => void;
}) {
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

export default function CopilotClient() {
  const { messages, sendMessage, status, addToolApprovalResponse } =
    useChat<MyUIMessage>({
      sendAutomaticallyWhen:
        lastAssistantMessageIsCompleteWithApprovalResponses,
    });

  const handleSend = async ({ text }: PromptInputMessage) => {
    if (!text.trim()) return;
    await sendMessage({
      text,
    });
  };

  return (
    <div className="relative flex size-full flex-col overflow-hidden px-2 py-4 bg-white max-h-[calc(100dvh-80px)] gap-2">
      <Conversation className="border border-border rounded-md">
        <ConversationContent>
          {messages.length === 0 ? (
            <ConversationEmptyState
              description="Ask about PostHog metrics or have the copilot propose a Linear ticket."
              icon={<ShieldCheckIcon className="size-6" />}
              title="Ready when you are"
            />
          ) : (
            messages.map((message, i) => (
              <Message from={message.role} key={`${message.id}-${i}-message`}>
                <MessageContent>
                  {message.parts.map((part, partIndex) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <MessageResponse key={`${message.id}-${partIndex}-text`}>
                            {part.text}
                          </MessageResponse>
                        );

                      case "reasoning":
                        return (
                          <Reasoning
                            key={`${message.id}-${partIndex}-reasoning`}
                            className="w-full"
                            isStreaming={
                              status === "streaming" &&
                              partIndex === message.parts.length - 1 &&
                              message.id === messages.at(-1)?.id
                            }
                          >
                            <ReasoningTrigger />
                            <ReasoningContent>{part.text}</ReasoningContent>
                          </Reasoning>
                        );

                      default:
                        // Handle all tool types using the registry
                        if (isToolPart(part) && isRegisteredTool(part.type)) {
                          return (
                            <div key={`${message.id}-${partIndex}-tool-container`}>
                              <Tool>
                                <CustomToolHeader type={part.type} state={part.state} />
                                <ToolContent>
                                  <ToolResult part={part} />
                                </ToolContent>
                              </Tool>

                              {part.approval && (
                                <Confirmation
                                  approval={part.approval}
                                  state={part.state}
                                >
                                  <div className="flex gap-2 items-center">
                                    <ConfirmationRequest>
                                      <ToolApproval
                                        part={part}
                                        onApprove={() =>
                                          addToolApprovalResponse({
                                            id: part.approval!.id,
                                            approved: true,
                                          })
                                        }
                                        onReject={() =>
                                          addToolApprovalResponse({
                                            id: part.approval!.id,
                                            approved: false,
                                          })
                                        }
                                      />
                                    </ConfirmationRequest>
                                    <ConfirmationAccepted>
                                      <CheckIcon className="size-4 text-green-700" />
                                      <span className="text-green-700">
                                        Approved
                                      </span>
                                    </ConfirmationAccepted>
                                    <ConfirmationRejected>
                                      <XIcon className="size-4 text-red-700" />
                                      <span className="text-red-700">
                                        Rejected
                                      </span>
                                    </ConfirmationRejected>
                                  </div>
                                  <ConfirmationActions>
                                    <ConfirmationAction
                                      variant="destructive"
                                      onClick={() =>
                                        addToolApprovalResponse({
                                          id: part.approval!.id,
                                          approved: false,
                                        })
                                      }
                                    >
                                      Reject
                                    </ConfirmationAction>
                                    <ConfirmationAction
                                      variant="success"
                                      onClick={() =>
                                        addToolApprovalResponse({
                                          id: part.approval!.id,
                                          approved: true,
                                        })
                                      }
                                    >
                                      Approve
                                    </ConfirmationAction>
                                  </ConfirmationActions>
                                </Confirmation>
                              )}
                            </div>
                          );
                        }

                        // Fallback for unknown types
                        return (
                          <span
                            key={`${message.id}-${partIndex}-unknown`}
                            className="text-xs text-muted-foreground"
                          >
                            Unknown part type: {part.type}
                          </span>
                        );
                    }
                  })}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <PromptInputProvider>
        <PromptInput onSubmit={handleSend}>
          <PromptInputTextarea placeholder="Ask the copilot anything about your analytics..." />
          <PromptInputFooter>
            <PromptInputTools className="text-xs text-muted-foreground">
              Approvals will be requested for PostHog writes, Linear, and GitHub
              actions.
            </PromptInputTools>
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </PromptInputProvider>
    </div>
  );
}
