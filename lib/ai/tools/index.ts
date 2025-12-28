import type { InferUITools, UIMessage, ToolSet } from "ai";
import { analyzeTools } from "./analyze";
import { firecrawlTools } from "./firecrawl";
import { githubTools } from "./github";
import { linearTools } from "./linear";
import { posthogTools } from "./posthog";
import { templateTools } from "./templates";

export const tools = {
  ...posthogTools,
  ...firecrawlTools,
  ...linearTools,
  ...githubTools,
  ...templateTools,
  ...analyzeTools,
} satisfies ToolSet;

export type MyUIMessage = UIMessage<never, never, InferUITools<typeof tools>>;
