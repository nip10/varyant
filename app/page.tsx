import Link from "next/link";
import { GridPattern } from "@/components/ui/grid-pattern";

const proofPoints = [
  {
    title: "Voice & multimodal",
    detail: "Speak, paste screenshots, drag & drop",
    icon: "🎙️",
  },
  {
    title: "12 templates",
    detail: "CTA, pricing, onboarding & more",
    icon: "📋",
  },
  {
    title: "Live dashboard",
    detail: "Real-time experiment monitoring",
    icon: "📊",
  },
];

const steps = [
  {
    label: "01",
    title: "Pick a template or speak",
    copy: "Choose from 12 battle-tested experiments or describe what you want to test with voice input.",
  },
  {
    label: "02",
    title: "Watch the copilot work",
    copy: "See every tool call stream live - PostHog queries, competitor analysis, and variant generation.",
  },
  {
    label: "03",
    title: "Approve and ship",
    copy: "Review AI recommendations, approve the feature flag, Linear ticket, and PR in one flow.",
  },
];

const capabilities = [
  {
    title: "PostHog Analytics",
    description: "Query funnels, trends, and experiments with natural language",
    icon: "📈",
    color: "emerald",
  },
  {
    title: "Competitor Analysis",
    description: "Screenshot and compare competitor CTAs side-by-side",
    icon: "🔍",
    color: "cyan",
  },
  {
    title: "AI Analyst",
    description: "Get SHIP, ITERATE, or END recommendations with confidence scores",
    icon: "🧠",
    color: "violet",
  },
  {
    title: "Live Experiments",
    description: "Monitor variant performance in real-time with auto-refresh",
    icon: "⚡",
    color: "amber",
  },
  {
    title: "GitHub Actions",
    description: "Trigger workflows and open PRs with generated code",
    icon: "🚀",
    color: "slate",
  },
  {
    title: "Linear Integration",
    description: "Create and track experiment tickets automatically",
    icon: "📝",
    color: "blue",
  },
];

const templates = [
  { name: "CTA Button Test", category: "Conversion", difficulty: "Easy" },
  { name: "Hero Headline", category: "Conversion", difficulty: "Easy" },
  { name: "Pricing Model", category: "Pricing", difficulty: "Medium" },
  { name: "Onboarding Flow", category: "Engagement", difficulty: "Hard" },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#fefaf5] via-white to-[#eef8ff] text-foreground">
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray="4 2"
        className="mask-[radial-gradient(520px_circle_at_45%_32%,white,transparent)] opacity-90"
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-10 sm:pt-16">
        {/* Navigation */}
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

        {/* Hero Section */}
        <section className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/90 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              New: Voice input, templates & live dashboards
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                Ship experiments with an AI copilot that shows its work.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                Speak your hypothesis, pick from 12 templates, or analyze
                competitors. Watch the agent query PostHog, generate variants,
                and open the PR - while you keep final approval.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/auth/sign-up"
                className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:-translate-y-px hover:shadow-emerald-500/50"
              >
                Start experimenting
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white/70 px-5 py-3 text-sm font-semibold text-emerald-800 shadow-sm transition hover:-translate-y-px hover:border-emerald-200 hover:shadow-md"
              >
                View demo dashboard
              </Link>
            </div>

            {/* Proof Points */}
            <div className="flex flex-wrap gap-3">
              {proofPoints.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm shadow-sm backdrop-blur"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-base">
                    {item.icon}
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

          {/* Demo Mockup - Voice + Templates */}
          <div className="relative">
            <div className="absolute -left-10 -top-6 h-24 w-24 rounded-full bg-amber-400/40 blur-3xl" />
            <div className="absolute -right-6 top-10 h-28 w-28 rounded-full bg-emerald-400/30 blur-3xl" />

            <div className="relative overflow-hidden rounded-3xl border border-emerald-100/80 bg-white shadow-2xl backdrop-blur">
              <div className="border-b border-emerald-50/80 bg-linear-to-r from-emerald-50 via-white to-amber-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm font-semibold text-emerald-900">
                    <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-700">
                      ✦
                    </span>
                    AI Copilot
                  </div>
                  <div className="flex items-center gap-2">
                    <kbd className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">
                      ⌘K
                    </kbd>
                    <kbd className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-600">
                      ⌘⇧V
                    </kbd>
                  </div>
                </div>
              </div>

              <div className="space-y-4 px-6 py-6">
                {/* Voice Input Demo */}
                <div className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50/80 px-4 py-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
                    <span className="h-3 w-3 animate-pulse rounded-full bg-violet-500" />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-violet-900">
                      Voice input active
                    </p>
                    <p className="text-xs text-violet-700">
                      &quot;Test a sticky CTA on mobile...&quot;
                    </p>
                  </div>
                </div>

                {/* Template Selection */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Or pick a template
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {templates.map((t) => (
                      <div
                        key={t.name}
                        className="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-xs shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                      >
                        <p className="font-semibold text-emerald-900">
                          {t.name}
                        </p>
                        <p className="text-muted-foreground">
                          {t.category} · {t.difficulty}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tool Execution Preview */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-white px-3 py-2 shadow-sm">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-xs font-semibold text-emerald-700">
                      PH
                    </span>
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-emerald-900">
                        PostHog Query
                      </p>
                      <p className="text-muted-foreground">
                        Funnel analysis complete
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Done
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-cyan-100 bg-white px-3 py-2 shadow-sm">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 text-xs">
                      🔍
                    </span>
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-cyan-900">
                        Competitor Screenshot
                      </p>
                      <p className="text-muted-foreground">
                        Comparing CTAs...
                      </p>
                    </div>
                    <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-[10px] font-semibold text-cyan-700">
                      Streaming
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-violet-100 bg-white px-3 py-2 shadow-sm">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15 text-xs">
                      🧠
                    </span>
                    <div className="flex-1 text-xs">
                      <p className="font-semibold text-violet-900">
                        AI Analyst
                      </p>
                      <p className="text-muted-foreground">
                        Recommendation: SHIP
                      </p>
                    </div>
                    <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                      95% confidence
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Step Process */}
        <section className="mt-16 grid gap-7 border-t border-emerald-100/70 pt-12 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
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

        {/* Capabilities Grid */}
        <section className="mt-16 space-y-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Capabilities
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-emerald-900">
              11 AI tools with dedicated result UIs
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Every tool has a custom component showing exactly what the AI did.
              No black boxes - watch queries execute, see charts render, and
              review recommendations before approving.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className={`rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                  cap.color === "emerald"
                    ? "border-emerald-100 hover:border-emerald-200"
                    : cap.color === "cyan"
                      ? "border-cyan-100 hover:border-cyan-200"
                      : cap.color === "violet"
                        ? "border-violet-100 hover:border-violet-200"
                        : cap.color === "amber"
                          ? "border-amber-100 hover:border-amber-200"
                          : cap.color === "blue"
                            ? "border-blue-100 hover:border-blue-200"
                            : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${
                      cap.color === "emerald"
                        ? "bg-emerald-100"
                        : cap.color === "cyan"
                          ? "bg-cyan-100"
                          : cap.color === "violet"
                            ? "bg-violet-100"
                            : cap.color === "amber"
                              ? "bg-amber-100"
                              : cap.color === "blue"
                                ? "bg-blue-100"
                                : "bg-slate-100"
                    }`}
                  >
                    {cap.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{cap.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {cap.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Teams Use Varyant */}
        <section className="mt-16 grid gap-10 rounded-3xl border border-emerald-100 bg-white/90 p-10 shadow-xl backdrop-blur lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Why teams use Varyant
            </p>
            <h2 className="text-2xl font-semibold text-emerald-900">
              From hypothesis to shipped experiment in minutes.
            </h2>
            <p className="text-base text-muted-foreground">
              Stop context-switching between analytics, project management, and
              code. Varyant brings everything into one AI-powered flow with
              human approval at every step.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-900">
                <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Voice input and drag & drop screenshots for faster workflows.
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-cyan-100 bg-cyan-50/60 px-4 py-3 text-sm text-cyan-900">
                <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                Competitor analysis with side-by-side screenshot comparison.
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50/60 px-4 py-3 text-sm text-violet-900">
                <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-violet-500" />
                AI Analyst recommends SHIP, ITERATE, or END with confidence
                scores.
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
                <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-amber-500" />
                Live dashboards with real-time variant performance monitoring.
              </li>
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-linear-to-b from-white via-emerald-50 to-white p-7 shadow-inner">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.08),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(251,191,36,0.08),transparent_35%)]" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-emerald-900">
                  Platform highlights
                </p>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Production ready
                </span>
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-white/80 px-4 py-3">
                  <div>
                    <p className="font-semibold text-emerald-900">
                      11 tool components
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Custom UIs for every AI action
                    </p>
                  </div>
                  <span className="text-emerald-600">●</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-cyan-100 bg-white/80 px-4 py-3">
                  <div>
                    <p className="font-semibold text-cyan-900">
                      12 experiment templates
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Conversion, pricing, engagement
                    </p>
                  </div>
                  <span className="text-cyan-600">●</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-violet-100 bg-white/80 px-4 py-3">
                  <div>
                    <p className="font-semibold text-violet-900">
                      Keyboard-first UX
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ⌘K palette · ⌘⇧V voice · / templates
                    </p>
                  </div>
                  <span className="text-violet-600">●</span>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 text-sm text-emerald-900 shadow-sm">
                &quot;Share winning experiments as PNG cards, celebrate with
                confetti, and keep stakeholders in the loop with real-time
                dashboards.&quot;
              </div>
            </div>
          </div>
        </section>

        {/* Keyboard Shortcuts Footer */}
        <section className="mt-16 rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <kbd className="rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-xs shadow-sm">
                ⌘K
              </kbd>
              <span>Command palette</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-xs shadow-sm">
                ⌘⇧V
              </kbd>
              <span>Voice input</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-xs shadow-sm">
                /
              </kbd>
              <span>Templates</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-xs shadow-sm">
                Drag
              </kbd>
              <span>Drop screenshots</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
