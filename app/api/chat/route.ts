import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type ModelMessage,
} from "ai";
import { anthropic, type AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { tools, type MyUIMessage } from "@/lib/ai/tools";

export async function POST(req: Request) {
  const { messages }: { messages: MyUIMessage[] } = await req.json();

  // NOTE: We convert the messages to the format expected by the model.
  const modelMessages: ModelMessage[] = convertToModelMessages(messages);

  const streamTextResult = streamText({
    model: anthropic("claude-sonnet-4-5"),
    providerOptions: {
      anthropic: {
        sendReasoning: true,
      } satisfies AnthropicProviderOptions,
    },
    messages: modelMessages,
    tools,
    stopWhen: [stepCountIs(20)],
  });

  // NOTE: We convert the stream to the format expected by the client.
  return streamTextResult.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}
