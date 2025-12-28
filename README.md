# Varyant – AI Experimentation Copilot

An AI-powered experimentation platform built with Next.js. Features a PostHog-powered dashboard paired with an intelligent copilot that can analyze data, suggest experiments, monitor results in real-time, and orchestrate work across Linear and GitHub.

## Features

### Core Capabilities
- **AI Copilot** – Streaming reasoning, tool call cards, and approval gates
- **Real Integrations** – PostHog, Linear, GitHub, Firecrawl, Supabase auth
- **Natural Language Analytics** – Ask questions, get charts and answers

### Input Methods
- **Multi-modal Input** – Drag & drop or paste images into chat
- **Voice Input** – Talk to the copilot using Web Speech API (Cmd+Shift+V)
- **Command Palette** – Quick access to all features (Cmd+K)

### Experimentation Tools
- **Screenshot → Experiment** – Paste a UI screenshot, get A/B test suggestions
- **Experiment Templates** – 12 battle-tested experiment configurations
- **AI Experiment Analyst** – Statistical analysis with recommendations (SHIP, ITERATE, END, WAIT, INVESTIGATE)
- **Live Dashboard** – Real-time experiment results with auto-refresh
- **Competitor Intelligence** – Analyze competitor sites, get experiment ideas

### Polish
- **Confetti Celebrations** – Celebrate experiment wins
- **Shareable Cards** – Export results as images (PNG/clipboard)

## Quickstart

```bash
# 1. Install dependencies
yarn install

# 2. Set up environment
cp .env.example .env.local
# Fill in the values (see Environment section below)

# 3. Run the app
yarn dev
```

Visit `http://localhost:3000`. Auth pages at `/auth/*`, dashboard at `/dashboard`, copilot at `/copilot`.

## Environment

Key variables (see `lib/config/env.ts` for validation):

**Client:**
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`
- `NEXT_PUBLIC_APP_URL`

**Server:**
- `SUPABASE_SECRET_KEY`
- `POSTHOG_PROJECT_ID`, `POSTHOG_API_KEY`
- `LINEAR_API_KEY`, `LINEAR_TEAM_ID`, `LINEAR_WEBHOOK_SECRET`
- `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_WORKFLOW_ID` (optional)
- `ANTHROPIC_API_KEY`
- `FIRECRAWL_API_KEY`

## Demo Flow

### Quick Demo (2 min)
1. Open Copilot, press Cmd+K, select "CTA Button Test" template
2. Watch the experiment get created with confetti

### Full Demo (5 min)
1. **Voice query**: Hold mic button → "Show me signup trends this week"
2. **Chart appears** via Natural Language Analytics
3. **Paste screenshot**: Drag a UI screenshot → "Suggest A/B tests for this"
4. **AI suggests experiments** based on the image
5. **Create experiment** → confetti celebration
6. **Live dashboard**: "Show me live results for this experiment"

### Competitor Analysis (3 min)
1. "Analyze notion.so and suggest experiments"
2. Side-by-side screenshots + insights appear
3. Pick a test idea, create experiment
4. Create Linear ticket for implementation

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` | Open command palette |
| `Cmd+Shift+V` | Voice input |
| `Cmd+Enter` | Submit message |

## Commands

```bash
yarn dev                      # Start dev server
yarn build && yarn start      # Production build
yarn lint                     # Lint the repo
yarn seed:posthog --dry-run   # Preview seed data
yarn seed:posthog --confirm   # Write demo events to PostHog
```

## Data Seeding

Generate demo analytics:
```bash
yarn seed:posthog --confirm
```

Creates ~1000 users with 5–12 events each over 15 days. Events: `$pageview`, `hero_cta_button_clicked`, `signup`, `checkout` with properties like `plan`, `device`, `country`.

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript
- **UI**: Tailwind CSS, shadcn/ui, Radix primitives
- **AI**: Vercel AI SDK, Anthropic Claude
- **Analytics**: PostHog (experiments, feature flags, insights)
- **Auth**: Supabase
- **Integrations**: Linear, GitHub Actions, Firecrawl
- **Data Fetching**: React Query (for live dashboard polling)

## Project Structure

```
app/
  api/              # API routes (chat, experiments, auth)
  copilot/          # AI copilot interface
  dashboard/        # Analytics dashboard
components/
  ai-elements/      # Chat UI, suggestions, voice input
  tool-results/     # Custom renderers for each AI tool
  copilot/          # Template browser, slash commands
  ui/               # shadcn components
lib/
  ai/tools/         # AI tool definitions (PostHog, Linear, GitHub, etc.)
  hooks/            # React hooks (voice, attachments, confetti, etc.)
  integrations/     # API clients (PostHog, Linear, GitHub)
  templates/        # Experiment template library
```

## Notes for Live Demo

- Keep approval gates on for write operations
- Pre-authenticate PostHog/Linear/GitHub in separate tabs
- Have a competitor URL ready for analysis demo
- Test voice input before presenting (requires HTTPS or localhost)
