## Cursor Rules for Varyant (Demo Tech Talk)

- **Context:** Demo-focused Next.js app showing an AI copilot + analytics dashboard; single prod env; no tests/feature flags by request.
- **Core Stack:** Next.js (app router), TypeScript, Tailwind, shadcn/ui (see component registry: https://ui.shadcn.com/llms.txt), Vercel AI SDK (Anthropic primary, OpenAI fallback).
- **Integrations:** PostHog (analytics read + seeded demo data), Linear (ticket creation), Supabase (light data/storage as needed), AI SDK tools, optional GitHub/web search per original plan.
- **Approvals:** Any write action (experiments, Linear tickets, PRs) must surface an approval gate; demo-grade UX is fine.
- **Env/Secrets:** Keep `.env.local` local; required keys for PostHog, Linear, Supabase, AI models. Prod-only deploy; no staging.
- **Data Seeding:** Use `scripts/seed-posthog.ts` (planned) to create ~1k users / 20–50k events with `demo_seed=true`; `yarn seed:posthog` with `--confirm`.
- **Quality Bar:** Optimize for reliability of the live demo: minimal error toasts over blank states; no exhaustive testing required; favor breadth of tools over polish.
