## Project Status (Demo Track)

- **Owner:** you
- **Env:** prod-only
- **Timeline:** ASAP
- **Testing:** none (per scope)

### Now / Next / Later
- **Now:** Copilot + dashboard wired behind auth; validate env keys.
- **Next:** Exercise tool calls end-to-end (PostHog/Linear) and confirm dashboard data.
- **Later:** Polish UX (toasts, copy). No offline mode or rehearsal work planned now.

### Integration Readiness
- [ ] PostHog keys wired; queries return data in UI
- [ ] Linear ticket creation works with approval gate
- [ ] Supabase access verified (any tables/storage needed are present)
- [ ] AI SDK model routing tested (streaming visible)
- [ ] PostHog seeding script in place (`yarn seed:posthog --confirm`) and data populated
- [x] AI SDK v6 beta installed; copilot page using AI Elements

### Demo Readiness
- [ ] Happy-path run-through succeeds (analytics → copilot → approvals)
- [ ] Approval dialogs render and block writes until confirmed
- [ ] Seeded/demo data looks realistic in charts
- [ ] Offline/recorded fallback (optional; not planned)

### Blockers / Risks
- None reported. Update here if something arises.
