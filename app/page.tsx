import Link from "next/link";

const proofPoints = [
  { title: "10+ AI tools", detail: "PostHog, Linear, GitHub, web search" },
  { title: "Live approvals", detail: "Safety gates on tickets & flags" },
  { title: "Streamed reasoning", detail: "Watch the agent think in real time" },
];

const steps = [
  {
    label: "01",
    title: "Instrument your hero",
    copy: "Drop in tracking and feature flags for your CTA without touching infra.",
  },
  {
    label: "02",
    title: "Ask the copilot",
    copy: "Query real PostHog data, research UX patterns, and compare variants.",
  },
  {
    label: "03",
    title: "Ship with confidence",
    copy: "Approve experiment, Linear ticket, and GitHub PR from one flow.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#fefaf5] via-white to-[#eef8ff] text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#dfe4ea_1px,transparent_0)] bg-size-[32px_32px] opacity-80" />
      <AnimatedLines />

      <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-10 sm:pt-14">
        <nav className="mb-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 via-cyan-500 to-amber-400 text-lg font-bold text-white shadow-lg shadow-emerald-500/30">
              VY
            </div>
            <div>
              <p className="text-sm font-semibold">Varyant</p>
              <p className="text-xs text-muted-foreground">
                AI Experimentation Copilot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-emerald-800 transition hover:text-emerald-600"
            >
              Log in
            </Link>
            <Link
              href="/auth/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-amber-500/40 transition hover:-translate-y-px hover:shadow-amber-500/60"
            >
              Sign up
            </Link>
          </div>
        </nav>

        <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Live demo: AI SDK + PostHog + Linear + GitHub
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Ship experiments with an AI copilot that shows its work.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                Varyant analyzes your landing page, runs research, drafts
                experiments, and opens the PR—while you keep final approval.
                Built for fast-moving teams and ambitious demos.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-px hover:shadow-emerald-500/50"
              >
                Start the experiment
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/70 px-5 py-3 text-sm font-semibold text-emerald-800 shadow-sm transition hover:-translate-y-px hover:border-emerald-200 hover:shadow-md"
              >
                View the demo dashboard
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              {proofPoints.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3 text-sm shadow-sm backdrop-blur"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-[11px] font-bold text-emerald-700">
                    ●
                  </span>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 -top-6 h-24 w-24 rounded-full bg-amber-400/40 blur-3xl" />
            <div className="absolute -right-6 top-10 h-28 w-28 rounded-full bg-emerald-400/30 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-emerald-100/80 bg-white/90 shadow-2xl backdrop-blur">
              <div className="border-b border-emerald-50/80 bg-linear-to-r from-emerald-50 via-white to-amber-50 px-6 py-4">
                <div className="flex items-center gap-3 text-sm font-semibold text-emerald-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700">
                    ✦
                  </span>
                  AI Copilot Runbook
                </div>
              </div>

              <div className="space-y-4 px-6 py-6">
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm font-semibold text-emerald-800">
                  “Research mobile CTA conversion, propose two variants, open a
                  PR with the winning layout.”
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3 shadow-sm">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-sm font-semibold text-emerald-700">
                      PH
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-emerald-900">
                        Query PostHog
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Funnel: page_view → signup_completed (30d, device split)
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Complete
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-cyan-100 bg-white/80 px-4 py-3 shadow-sm">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-sm font-semibold text-cyan-700">
                      🔎
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-cyan-900">
                        Web research
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Mobile CTA best practices and color psychology
                      </p>
                    </div>
                    <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                      Streaming
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-white/90 px-4 py-3 shadow-sm">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-sm font-semibold text-amber-700">
                      ✅
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-900">
                        Approval gates
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Feature flag + Linear ticket + PR creation
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      Awaiting you
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-100/70 bg-emerald-50/70 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Highlight
                  </p>
                  <p className="mt-2 text-sm text-emerald-900">
                    The agent writes real React/TypeScript for both variants and
                    triggers a GitHub Action to open the PR.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {step.label}
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <h3 className="mt-3 text-lg font-semibold text-emerald-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.copy}</p>
            </div>
          ))}
        </section>

        <section className="mt-14 grid gap-8 rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-lg backdrop-blur lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Why teams use Varyant
            </p>
            <h2 className="text-2xl font-semibold text-emerald-900">
              Modern experimentation without the wait time.
            </h2>
            <p className="text-base text-muted-foreground">
              Pair AI research with real analytics. See every tool call, approve
              actions before they ship, and keep experiments moving while
              stakeholders watch.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-900">
                <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Streaming reasoning plus tool cards for transparency.
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-cyan-100 bg-cyan-50/60 px-4 py-3 text-sm text-cyan-900">
                <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                Integrated with PostHog, Linear, GitHub, and Brave search.
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
                <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-amber-500" />
                Approval-first for feature flags, tickets, and PR automation.
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white/60 px-4 py-3 text-sm text-slate-900">
                <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Designed for live demos—fast, visible, and resilient.
              </li>
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-linear-to-b from-white via-emerald-50 to-white p-6 shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.08),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(251,191,36,0.08),transparent_35%)]" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-emerald-900">
                  Demo-ready signal
                </p>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Stable
                </span>
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3">
                  <div>
                    <p className="font-semibold text-emerald-900">
                      PostHog seeded
                    </p>
                    <p className="text-xs text-muted-foreground">
                      50k events · hero CTA funnel
                    </p>
                  </div>
                  <span className="text-emerald-600">●</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-cyan-100 bg-white/80 px-4 py-3">
                  <div>
                    <p className="font-semibold text-cyan-900">AI SDK tools</p>
                    <p className="text-xs text-muted-foreground">
                      10+ with streaming responses
                    </p>
                  </div>
                  <span className="text-cyan-600">●</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-amber-100 bg-white/80 px-4 py-3">
                  <div>
                    <p className="font-semibold text-amber-900">
                      Approvals on writes
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Feature flags, tickets, PRs
                    </p>
                  </div>
                  <span className="text-amber-600">●</span>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 text-sm text-emerald-900 shadow-sm">
                “Built to show how AI SDK handles multi-step agent flows—query
                analytics, research, generate code, and automate delivery with
                safety checks.”
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function AnimatedLines() {
  return (
    <div className="animated-lines pointer-events-none absolute inset-0 overflow-hidden">
      <div className="animated-line line-1" />
      <div className="animated-line line-2" />
      <div className="animated-line line-3" />
      <div className="animated-orb orb-1" />
      <div className="animated-orb orb-2" />
    </div>
  );
}
