import { createEnv } from "@t3-oss/env-nextjs"; // or core package
import { z } from "zod";

export const env = createEnv({
  /**
   * Server-only variables.
   */
  server: {
    SUPABASE_SECRET_KEY: z.string().min(1),
    POSTHOG_PROJECT_ID: z.string().min(1),
    POSTHOG_API_KEY: z.string().min(1),
    LINEAR_API_KEY: z.string().min(1),
    LINEAR_TEAM_ID: z.string().min(1),
    LINEAR_WEBHOOK_SECRET: z.string().min(1),
    GITHUB_TOKEN: z.string().min(1),
    GITHUB_REPO: z.string().min(1),
    GITHUB_WORKFLOW_ID: z.string().optional(),
    ANTHROPIC_API_KEY: z.string().optional(),
    FIRECRAWL_API_KEY: z.string().min(1),
  },
  /**
   * Client + server variables (must be NEXT_PUBLIC_).
   */
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.url(),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
    NEXT_PUBLIC_POSTHOG_HOST: z.url().default("https://eu.i.posthog.com"),
    NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
  },
  /**
   * Explicit runtime env mapping.
   */
  runtimeEnv: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    POSTHOG_PROJECT_ID: process.env.POSTHOG_PROJECT_ID,
    POSTHOG_API_KEY: process.env.POSTHOG_API_KEY,
    LINEAR_API_KEY: process.env.LINEAR_API_KEY,
    LINEAR_TEAM_ID: process.env.LINEAR_TEAM_ID,
    LINEAR_WEBHOOK_SECRET: process.env.LINEAR_WEBHOOK_SECRET,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_REPO: process.env.GITHUB_REPO,
    GITHUB_WORKFLOW_ID: process.env.GITHUB_WORKFLOW_ID,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY,
  },
});
