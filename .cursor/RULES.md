## Cursor Rules for Varyant (Demo Tech Talk)

- **Context:** Demo-focused Next.js app with AI copilot + analytics dashboard; prod-only; demo-grade polish; no formal tests/feature flags.
- **Core Stack:** Next.js (App Router), TypeScript, Tailwind, shadcn/ui (registry: https://ui.shadcn.com/llms.txt), Vercel AI SDK v6 + AI Elements (Anthropic primary, OpenAI optional fallback).
- **Integrations:** PostHog (read + seed), Linear (ticket creation), Supabase (auth/session), GitHub workflow dispatch, Firecrawl/Brave search for research; AI SDK tools orchestrate calls.
- **Approvals:** Any write action (feature flags/experiments, Linear tickets, PR/workflow dispatch) must require approval; keep UX simple but explicit.
- **Env/Secrets:** Keep `.env.local` local; supply keys for PostHog, Linear, Supabase, GitHub, AI models, Firecrawl. Add to Vercel for prod; no staging env.
- **Data Seeding:** Use `yarn seed:posthog --dry-run|--confirm` to generate ~1k users and 5–12 events/user tagged `demo_seed=true`.
- **Quality Bar:** Optimize for live-demo reliability: streaming + tool cards visible, approvals blocking writes, minimal toasts over blank states.
