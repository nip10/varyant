import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type ModelMessage,
} from "ai";
import { anthropic, type AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { tools, type MyUIMessage } from "@/lib/ai/tools";

const SYSTEM_PROMPT = `You are Varyant, an AI copilot for product analytics and experimentation. You help users with:
- Creating and managing A/B experiments and feature flags in PostHog
- Analyzing product metrics and insights
- Managing Linear tickets and GitHub workflows

When users share images (screenshots, wireframes, charts, etc.), analyze them carefully and provide relevant insights. For UI screenshots, you can suggest A/B test ideas based on the layout and design elements.

Be concise and actionable in your responses. Use the available tools when appropriate to take actions on behalf of the user.`;

export async function POST(req: Request) {
  const { messages }: { messages: MyUIMessage[] } = await req.json();

  // NOTE: We convert the messages to the format expected by the model.
  // The convertToModelMessages function handles multi-modal content (text + images)
  // automatically when the message includes a 'parts' array.
  const modelMessages: ModelMessage[] = convertToModelMessages(messages);

  const streamTextResult = streamText({
    model: anthropic("claude-sonnet-4-5"),
    system: SYSTEM_PROMPT,
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
