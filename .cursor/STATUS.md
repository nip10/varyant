## Project Status (Demo Track)

- **Owner:** you
- **Env:** prod-only
- **Timeline:** ASAP for tech talk demo
- **Testing:** none (demo-only scope)

### Now / Next / Later
- **Now:** Validate env keys and smoke `/dashboard` + `/copilot` with streaming/tool cards.
- **Next:** Run PostHog seeding (`--dry-run` then `--confirm`) and verify dashboard/copilot queries.
- **Later:** Prep prompt scripts + backup assets (seed JSON/screenshots) for the live run.

### Integration Readiness
- [ ] PostHog keys wired; dashboard/copilot queries return seeded data
- [ ] Linear ticket creation works with approval gate
- [ ] Supabase auth flows verified (sign-up/login/reset)
- [ ] AI SDK model routing tested (streaming visible)
- [ ] GitHub workflow dispatch succeeds with current repo/branch
- [ ] PostHog seeding script run (`yarn seed:posthog --confirm`) and data populated
- [x] AI SDK v6 beta installed; copilot page using AI Elements
- [ ] Firecrawl/Brave search tool returns content

### Demo Readiness
- [ ] Happy-path run-through succeeds (analytics → copilot → approvals)
- [ ] Approval dialogs render and block writes until confirmed
- [ ] Seeded/demo data looks realistic in charts
- [ ] Offline/recorded fallback ready (seed JSON or screenshots)
- [ ] Prompt script and timing rehearsed (<10 minutes)

### Blockers / Risks
- None reported. Update here if something arises.
