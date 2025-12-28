"use client";

import { CheckIcon, XIcon } from "lucide-react";
import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRejected,
  ConfirmationRequest,
} from "@/components/ai-elements/confirmation";
import {
  Tool,
  ToolContent,
} from "@/components/ai-elements/tool";
import type { ToolUIPart } from "ai";

// Extended tool part type with additional properties we need
// Using intersection since ToolUIPart is a union type
export type ExtendedToolPart = ToolUIPart & {
  input: unknown;
  output: unknown;
  approval?: { id: string };
  errorText?: string;
};

export interface ToolPartRendererProps {
  part: ExtendedToolPart;
  messageId: string;
  partIndex: number;
  addToolApprovalResponse: (response: { id: string; approved: boolean }) => void;
  CustomToolHeader: React.ComponentType<{ type: string; state: ToolUIPart["state"] }>;
  ToolResult: React.ComponentType<{ part: ExtendedToolPart }>;
  ToolApproval: React.ComponentType<{ part: ExtendedToolPart; onApprove?: () => void; onReject?: () => void }>;
}

export function ToolPartRenderer({
  part,
  messageId,
  partIndex,
  addToolApprovalResponse,
  CustomToolHeader,
  ToolResult,
  ToolApproval,
}: ToolPartRendererProps) {
  return (
    <div key={`${messageId}-${partIndex}-tool-container`}>
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
              <ToolApproval part={part} />
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
