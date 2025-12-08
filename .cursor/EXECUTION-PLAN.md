## Execution Plan (Demo-First)

- **Goal:** Ship a working demo for the tech talk (analytics dashboard + AI copilot).
- **Constraints:** Single owner, ASAP timeline, prod-only env, no tests, no feature flags, demo-grade quality acceptable.
- **Integrations in scope:** PostHog, Linear, Supabase, AI SDK (Vercel AI SDK). Avoid adding others.

### Workstream 1 — Baseline & Environment
- [ ] Validate `.env.local` against required keys (PostHog, Linear, Supabase, AI SDK).
- [ ] Confirm prod deployment target and secrets placement (Vercel or equivalent).
- [ ] Run app end-to-end locally; note any broken imports or missing deps.
- [ ] Lock package versions if drifted; run `yarn install` sanity check.

### Workstream 2 — PostHog Analytics (Read-Only + Seeding)
- [ ] Ensure PostHog client/server keys load via config helper.
- [ ] Implement/verify queries for metrics, funnels, experiments required by UI.
- [ ] Wire queries into dashboard components (loading/error states acceptable to be minimal).
- [ ] Add seeding script `scripts/seed-posthog.ts`:
  - [ ] Generate ~1k users, ~20–50k events over last 7 days.
  - [ ] Event mix: `pageview`, `signup`, `experiment_view`, `variant_a_click`, `variant_b_click`, `checkout`, `experiment_created`, `ticket_created`.
  - [ ] Properties: `plan`, `device`, `country`, `utm_campaign`, `demo_seed=true`.
  - [ ] Ensure funnels: pageview → signup → checkout; A/B split with slight B uplift.
  - [ ] Include one completed experiment with B “winning.”
  - [ ] Flags: `--confirm` required to run; optional `DRY_RUN`.
  - [ ] Run via `yarn seed:posthog` (add script).

### Workstream 3 — AI Copilot (Vercel AI SDK)
- [ ] Confirm model routing (primary Anthropic/OpenAI fallback) and API keys present.
- [ ] Inventory tools exposed to the agent; keep to required PostHog + Linear + Supabase utilities.
- [ ] Implement multi-step reasoning flow with visible streaming.
- [ ] Add at least 3 approval gates (experiment creation, Linear ticket, any write to external service).
- [ ] Structure outputs (tables/charts/snippets) for demo clarity.

### Workstream 4 — Integrations
- **Linear:** [ ] Ticket creation tool; [ ] minimal payload (title/body) fed by agent; [ ] dry-run mode toggle optional.
- **Supabase:** [ ] Define minimal tables or storage usage (notes/session logs if needed); [ ] env keys wired.
- **PostHog:** [ ] Queries already covered; [ ] ensure host/project ID configurable.

### Workstream 5 — UI & Demo Flow
- [ ] Dashboard page shows key metrics + recent experiments summary.
- [ ] Chat panel with streaming responses and tool-call transparency.
- [ ] Approval modals surfaced inline with clear copy.
- [ ] “Happy path” demo script rehearsed end-to-end (no dead ends).

### Workstream 6 — Stability for Demo
- [ ] Add basic error toasts/fallbacks (no blank screens).
- [ ] Preload/prime any slow first-call (model warm-up) before going on stage.
- [ ] Network/offline contingencies: have cached example response or short recording available.

### Milestones (ASAP Oriented)
- **M1: App boots & env valid** — runs locally with keys, no crashes.
- **M2: Analytics visible** — dashboard shows PostHog data.
- **M3: Copilot operational** — AI can read metrics and propose experiment.
- **M4: Writes gated** — approvals in place; Linear ticket creation demonstrated.
- **M5: Demo-ready** — rehearsed script passes without blockers.
