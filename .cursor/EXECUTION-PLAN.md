## Execution Plan (Demo-first, Dec 2025)

- **Goal:** Keep the Varyant demo reliable: dashboard + AI copilot with visible tool calls and approvals.
- **Constraints:** Single owner, prod-only, demo-grade polish, no formal tests.
- **Stack in scope:** Next.js App Router, Supabase auth, PostHog, Linear, GitHub workflow dispatch, Firecrawl/Brave search, Vercel AI SDK v6 (Anthropic primary, OpenAI optional).

### Workstream 1 — Baseline & Environment
- [ ] Copy `.env.example` → `.env.local`; fill all keys from `lib/config/env.ts`.
- [ ] `yarn install` → `yarn dev`; smoke `/`, `/dashboard`, `/copilot`.
- [ ] Verify Supabase auth (sign-up/login/reset) flows.
- [ ] Confirm secrets exist in Vercel for prod deploy.

### Workstream 2 — Analytics & Seeding
- [ ] Run `yarn seed:posthog --dry-run` to inspect the plan JSON.
- [ ] Run `yarn seed:posthog --confirm` once keys are set; spot-check data in PostHog (CTA funnel + properties).
- [ ] Ensure dashboard cards/queries and copilot PostHog tools read seeded events without errors.

### Workstream 3 — Copilot (AI SDK v6 + AI Elements)
- [ ] Validate Anthropic key present; set OpenAI fallback if available.
- [ ] Confirm streaming + tool cards render in `/copilot`.
- [ ] Approval modals block writes for PostHog experiment creation, Linear ticket, and GitHub dispatch.
- [ ] Keep prompt scripts handy for the live run (analysis → recommend → create).

### Workstream 4 — Integrations
- **PostHog:** [ ] `POSTHOG_PROJECT_ID/KEY/HOST` wired; [ ] list/create experiment tools return data.
- **Linear:** [ ] `LINEAR_API_KEY/TEAM_ID` set; [ ] issue creation succeeds via approval flow.
- **GitHub:** [ ] `GITHUB_TOKEN/REPO` (+ optional `GITHUB_WORKFLOW_ID`) set; [ ] workflow dispatch tested.
- **Firecrawl/Brave:** [ ] `FIRECRAWL_API_KEY` set; [ ] web fetch/search tools respond with content.
- **Supabase:** [ ] `NEXT_PUBLIC_SUPABASE_*` + `SUPABASE_SECRET_KEY` valid; [ ] session persistence confirmed.

### Workstream 5 — Demo Flow & UX
- [ ] Prepare 3–5 canned prompts and expected tool chain outputs.
- [ ] Pre-auth PostHog/Linear/GitHub tabs; have seed JSON handy as offline fallback.
- [ ] Copy on approvals is clear; minimal toasts over blank states.
- [ ] Time the happy path (<10 minutes).

### Workstream 6 — Stability & Safety
- [ ] Warm model once pre-demo to reduce first-token delay.
- [ ] Keep error surfaces gentle (retry CTA, not stack traces).
- [ ] Monitor rate limits; cap web searches per session if needed.

### Milestones (ASAP)
- **M1: App boots with envs** — local dev runs, auth works.
- **M2: Analytics visible** — dashboard + tools read seeded PostHog data.
- **M3: Copilot reliable** — streaming + tool cards + approvals confirmed.
- **M4: Writes gated** — PostHog/Linear/GitHub actions blocked until approved.
- **M5: Demo-ready** — rehearsed script, fallback assets prepared.
