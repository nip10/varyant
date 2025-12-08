import {
  convertToModelMessages,
  ModelMessage,
  stepCountIs,
  streamText,
} from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { type MyUIMessage, tools } from "@/lib/ai/tools";

export async function POST(req: Request) {
  const { messages }: { messages: MyUIMessage[] } = await req.json();

  // NOTE: We convert the messages to the format expected by the model.
  const modelMessages: ModelMessage[] = convertToModelMessages(messages);

  const streamTextResult = streamText({
    model: anthropic("claude-sonnet-4-5"),
    messages: modelMessages,
    tools,
    stopWhen: [stepCountIs(10)],
  });

  // NOTE: We convert the stream to the format expected by the client.
  return streamTextResult.toUIMessageStreamResponse();
}
