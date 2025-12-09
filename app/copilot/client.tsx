"use client";

import { useChat } from "@ai-sdk/react";
import { lastAssistantMessageIsCompleteWithApprovalResponses } from "ai";
import { CheckIcon, ShieldCheckIcon, XIcon } from "lucide-react";
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
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { MyUIMessage } from "@/lib/ai/tools";
import { Reasoning } from "@/components/ai-elements/reasoning";
import {
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";

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
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <MessageResponse key={`${message.id}-${i}-text`}>
                            {part.text}
                          </MessageResponse>
                        );
                      case "tool-queryPosthogInsights":
                      case "tool-createPostHogExperiment":
                      case "tool-createPostHogFeatureFlag":
                      case "tool-crawlWebsite":
                      case "tool-createLinearIssue":
                      case "tool-updateLinearIssue":
                      case "tool-triggerFeatureDevelopment":
                        return (
                          <div key={`${message.id}-${i}-tool-container`}>
                            <Tool key={`${message.id}-${i}-tool`}>
                              <ToolHeader type={part.type} state={part.state} />
                              <ToolContent>
                                <ToolInput input={part.input} />
                                <ToolOutput
                                  output={
                                    part.output?.data?.screenshotUrl ? (
                                      <img
                                        src={part.output.data.screenshotUrl}
                                        alt="Screenshot"
                                      />
                                    ) : (
                                      <MessageResponse>
                                        {part.output?.toString() ?? "No output"}
                                      </MessageResponse>
                                    )
                                  }
                                  errorText={part.errorText}
                                />
                              </ToolContent>
                            </Tool>
                            {part.approval && (
                              <Confirmation
                                approval={part.approval}
                                state={part.state}
                                key={`${message.id}-${i}-confirmation`}
                              >
                                <div className="flex gap-2 items-center">
                                  <ConfirmationRequest>
                                    <div className="flex flex-col gap-2">
                                      <span>
                                        Request for calling tool{" "}
                                        <span className="font-semibold">
                                          {part.type}
                                        </span>{" "}
                                        with the following input:
                                      </span>
                                      <pre className="text-xs bg-muted/50 p-2 rounded-md block text-wrap">
                                        {JSON.stringify(part.input, null, 2)}
                                      </pre>
                                    </div>
                                  </ConfirmationRequest>
                                  <ConfirmationAccepted>
                                    <CheckIcon className="size-4 text-green-700" />
                                    <span className="text-green-700">
                                      You approved this tool execution
                                    </span>
                                  </ConfirmationAccepted>
                                  <ConfirmationRejected>
                                    <XIcon className="size-4 text-red-700" />
                                    <span className="text-red-700">
                                      You rejected this tool execution
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
                      case "reasoning":
                        return (
                          <Reasoning
                            key={`${message.id}-${i}-reasoning`}
                            className="w-full"
                            isStreaming={
                              status === "streaming" &&
                              i === message.parts.length - 1 &&
                              message.id === messages.at(-1)?.id
                            }
                          >
                            <ReasoningTrigger />
                            <ReasoningContent>{part.text}</ReasoningContent>
                          </Reasoning>
                        );
                      default:
                        return (
                          <span
                            key={`${message.id}-${i}-unknown`}
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
