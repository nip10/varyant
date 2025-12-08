import type { InferUITools, UIMessage, ToolSet } from "ai";
import { firecrawlTools } from "./firecrawl";
import { githubTools } from "./github";
import { linearTools } from "./linear";
import { posthogTools } from "./posthog";

export const tools = {
  ...posthogTools,
  ...firecrawlTools,
  ...linearTools,
  ...githubTools,
} satisfies ToolSet;

export type MyUIMessage = UIMessage<never, never, InferUITools<typeof tools>>;
