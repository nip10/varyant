# Varyant – AI Experimentation Copilot (Demo)

An opinionated Next.js app that demonstrates a live AI copilot for experimentation workflows. The demo pairs a PostHog-powered dashboard with an AI SDK–backed agent that can research, propose variants, and (with approval) push work through Linear and GitHub.

- **AI-first UX:** Streaming reasoning, tool call cards, and approval gates.
- **Real integrations:** PostHog (read + seed), Linear (tickets), GitHub (workflow dispatch), Brave/Firecrawl for research, Supabase for auth/session.
- **Demo-grade reliability:** Minimal happy-path polish, fast setup, seeded analytics data.

## Quickstart

1) Install deps
```bash
yarn install
```

2) Copy envs
```bash
cp .env.example .env.local
```
Fill the values (see **Environment**). Required: PostHog, Supabase, Linear, GitHub, AI model, Firecrawl. Anthropic is primary; OpenAI optional fallback.

3) Run the app
```bash
yarn dev
```
Visit `http://localhost:3000`. Auth pages live under `/auth/*`; the dashboard is at `/dashboard`; the copilot is at `/copilot`.

## Environment

Key variables (see `lib/config/env.ts` for validation):
- Client: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`, `NEXT_PUBLIC_APP_URL`
- Server: `SUPABASE_SECRET_KEY`, `POSTHOG_PROJECT_ID`, `POSTHOG_API_KEY`, `LINEAR_API_KEY`, `LINEAR_TEAM_ID`, `LINEAR_WEBHOOK_SECRET`, `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_WORKFLOW_ID` (optional), `ANTHROPIC_API_KEY`, `FIRECRAWL_API_KEY`

Keep `.env.local` out of git; add secrets to Vercel for deployment.

## Data seeding (PostHog)

Generate demo analytics with the provided script:
```bash
yarn seed:posthog --dry-run   # preview
yarn seed:posthog --confirm   # write events
```
Config knobs (via env): `SEED_USERS` (default 1000), event volume 5–12 per user over the last 15 days. Events include `$pageview`, `hero_cta_button_clicked`, `signup`, `checkout` with properties like `plan`, `device`, `country`, `demo_seed`.

## Demo flow (suggested)

1) Sign up or log in, then open `Dashboard` to show seeded metrics.
2) Switch to `Copilot` and ask it to analyze the CTA funnel; watch streamed reasoning + tool cards.
3) Approve actions: PostHog experiment/flag, Linear ticket, and GitHub workflow dispatch.
4) Show the generated React/TypeScript snippet the agent proposes for variants.

## Commands

- `yarn dev` – start local dev server
- `yarn build` / `yarn start` – production build & serve
- `yarn lint` – lint the repo
- `yarn seed:posthog --dry-run|--confirm` – generate PostHog demo data

## Tech stack

Next.js (App Router) · TypeScript · Tailwind/shadcn · Supabase auth · Vercel AI SDK v6 + AI Elements · PostHog JS/Node · Linear SDK · GitHub Actions dispatch · Firecrawl (web fetch) · Brave search (via tools)

## Notes for live demo

- Keep approvals on for any write (flags, tickets, PRs).
- If a provider is slow, keep the agent streaming; you can fall back to the `--dry-run` seed output.
- Have PostHog/Linear/GitHub tabs pre-authenticated before presenting.
