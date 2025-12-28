"use client";

import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Reasoning } from "@/components/ai-elements/reasoning";
import {
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { isRegisteredTool } from "@/components/tool-results";
import type { MyUIMessage } from "@/lib/ai/tools";
import type { ToolUIPart, UIMessage } from "ai";
import { ToolPartRenderer, type ExtendedToolPart } from "./tool-part-renderer";

// Type for a message part that could be any type from the UI message
type MessagePart = UIMessage["parts"][number];

// Type guard to check if a part is a tool part with state
function isToolPart(part: MessagePart): part is ExtendedToolPart {
  return (
    part !== null &&
    typeof part === "object" &&
    "state" in part &&
    typeof part.state === "string" &&
    "type" in part &&
    typeof part.type === "string" &&
    part.type.startsWith("tool-")
  );
}

export interface MessageRendererProps {
  message: MyUIMessage;
  messages: MyUIMessage[];
  status: string;
  addToolApprovalResponse: (response: { id: string; approved: boolean }) => void;
  CustomToolHeader: React.ComponentType<{ type: string; state: ToolUIPart["state"] }>;
  ToolResult: React.ComponentType<{ part: ExtendedToolPart }>;
  ToolApproval: React.ComponentType<{ part: ExtendedToolPart; onApprove?: () => void; onReject?: () => void }>;
}

export function MessageRenderer({
  message,
  messages,
  status,
  addToolApprovalResponse,
  CustomToolHeader,
  ToolResult,
  ToolApproval,
}: MessageRendererProps) {
  return (
    <Message from={message.role}>
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
                  <ToolPartRenderer
                    key={`${message.id}-${partIndex}-tool-container`}
                    part={part}
                    messageId={message.id}
                    partIndex={partIndex}
                    addToolApprovalResponse={addToolApprovalResponse}
                    CustomToolHeader={CustomToolHeader}
                    ToolResult={ToolResult}
                    ToolApproval={ToolApproval}
                  />
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
  );
}
