# Varyant - AI-Powered Experimentation Platform
## Complete Project Plan

---

## Fast Facts (Dec 2025 repo state)

- Next.js (App Router) + TypeScript + Tailwind/shadcn; Supabase auth/session.
- Vercel AI SDK v6 + AI Elements with Anthropic primary (OpenAI fallback optional).
- Integrations live in code: PostHog (analytics + seed script `yarn seed:posthog`), Linear (issue creation), GitHub workflow dispatch, Firecrawl/Brave search tools.
- Copilot page streams reasoning with tool cards; approvals required for PostHog flag creation, Linear ticket, GitHub workflow dispatch.
- Environment keys validated in `lib/config/env.ts`; run locally with `yarn install && cp .env.example .env.local && yarn dev`.

---

## Project Context

### Purpose of This Project

**This is a DEMONSTRATION PROJECT for a technical talk**, not a production application. The goal is to showcase how to build AI-powered products using Vercel's AI SDK through a realistic, compelling use case.

### The Talk

**Title:** "Building AI-Powered Products with AI SDK"

**Venue:** Sword x Supabase meetup (community event; no sponsorship obligations)

**Audience:**
- Engineering team members (tech leads, senior engineers)
- Product managers interested in AI capabilities
- Developers learning to integrate AI into products

**Duration:** 45 minutes (30 min demo + 15 min Q&A)

**Learning Objectives:**
1. How to get started with AI SDK
2. Key features: tool calling, streaming, agents, approval flows
3. Real-world integration patterns (APIs, webhooks, automation)
4. Best practices for agentic AI in production apps

### What We're Building (MVP Scope)

**An analytics dashboard with an AI copilot** that demonstrates:

✅ **AI SDK Core Features:**
- Tool calling (10+ different tools)
- Streaming responses (word-by-word)
- Multi-step agents (research → analyze → suggest)
- Approval flows (3 critical decision points)
- Structured outputs (charts, tables, code)

✅ **Real Integrations:**
- PostHog (analytics data)
- Linear (ticket creation)
- GitHub (PR automation)
- Web search (UX research)

✅ **Production Patterns:**
- API route design
- Error handling
- Loading states
- User feedback loops

**What We're NOT Building:**
- ❌ A real analytics platform (PostHog already exists)
- ❌ A production-ready product (MVP only)
- ❌ Complex data pipelines (use PostHog's data)
- ❌ Authentication/authorization (demo only)
- ❌ Comprehensive testing (just enough to demo)
- ❌ Scalability optimizations (single user demo)

### Success Criteria

The demo is successful if:
1. ✅ Audience understands AI SDK basics after watching
2. ✅ Live demo runs smoothly (or backup works)
3. ✅ AI agent shows intelligent reasoning (not just tool execution)
4. ✅ Integration points are clear and realistic
5. ✅ Approval flows demonstrate safety considerations
6. ✅ Code generation impresses technical audience

### Why This Use Case?

**Analytics + Experimentation** was chosen because:

1. **Relatable** - Every company runs experiments
2. **Complex enough** - Shows agent capabilities
3. **Simple enough** - Doesn't require domain expertise
4. **Multiple integrations** - Demonstrates real-world patterns
5. **Natural approval gates** - Makes sense to ask for confirmation
6. **Visual results** - Charts and code diffs are engaging
7. **Sword-relevant** - Healthcare companies do A/B testing

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [External Integrations](#4-external-integrations)
5. [Demo Flow](#5-demo-flow)
6. [AI Agent Tools](#6-ai-agent-tools)
7. [UI Components](#7-ui-components)
8. [Setup Requirements](#8-setup-requirements)
9. [Implementation Phases](#9-implementation-phases)
10. [Demo Script](#10-demo-script)

---

## 1. Project Overview

### Concept
A minimal analytics platform with an embedded AI agent that demonstrates AI SDK's core capabilities through a realistic experimentation workflow:

**Agent Capabilities (Demo Focus):**
- Analyze conversion metrics from PostHog
- Research UX best practices via web search
- Suggest data-driven experiments with reasoning
- Create experiments in PostHog (with approval)
- Generate Linear tickets (with approval)
- Generate React code for variants
- Trigger GitHub PRs via Actions (with approval)

### Why This Works as a Demo

**1. Shows Real AI SDK Features:**
- ✅ Tool calling (the star of the show)
- ✅ Streaming (visible in UI)
- ✅ Agents with multi-step reasoning
- ✅ Approval flows (safety-critical)
- ✅ Structured outputs (not just chat)

**2. Real Integrations (Not Mocked):**
- PostHog API (actual analytics data)
- Linear API (creates real tickets)
- GitHub API (opens real PRs)
- Web search (real research)

**3. Demonstrates Production Patterns:**
- How to structure AI tools
- Error handling in tool execution
- User feedback loops
- Progressive disclosure (tool cards)

**4. Engaging for Technical Audience:**
- Code generation is impressive
- Multi-service orchestration is complex
- Research + reasoning shows intelligence
- Approval gates show thoughtfulness

### Scope Boundaries (MVP Only)

**What We're Building:**
```
✅ Analytics dashboard (read-only, PostHog data)
✅ AI chat interface (embedded copilot)
✅ 10+ AI tools (PostHog, Linear, GitHub, research)
✅ 3 approval flows (experiment, ticket, PR)
✅ Code generation (TypeScript/React)
✅ Simple landing page (experiment subject)
```

**What We're NOT Building:**
```
❌ User authentication (single-user demo)
❌ Database (use PostHog + Linear + GitHub as storage)
❌ Real-time collaboration
❌ Complex data pipelines
❌ Production scalability
❌ Comprehensive error handling
❌ Unit/integration tests (just enough to work)
❌ Mobile app
❌ Analytics processing engine (PostHog does this)
```

**Acceptable Shortcuts for Demo:**
- Hard-coded user ID in landing page
- No rate limiting on AI calls
- Minimal error messages ("Something went wrong")
- No loading optimizations (waterfalls are ok)
- Simple styling (good enough, not pixel-perfect)
- No analytics on the analytics platform itself
- Single environment (no staging)

### Target Audience

**Primary:** Engineering team at SwordHealth
- Tech leads who might integrate AI
- Senior engineers learning AI SDK
- Product people exploring AI features

**Secondary:** Anyone watching recording
- Developers getting started with AI SDK
- Teams evaluating AI integration patterns

### Key Talking Points for Demo

**During the talk, emphasize:**

1. **"This took ~3 weeks to build"** - AI SDK makes it fast
2. **"Notice the agent's reasoning"** - It's not just executing commands
3. **"Real integrations"** - PostHog/Linear/GitHub APIs
4. **"Approval gates are crucial"** - Safety in AI products
5. **"Code is production-ready"** - Generated TypeScript actually works
6. **"This pattern applies everywhere"** - Not just analytics

---

## 2. Architecture

### High-Level Design Philosophy

**For this MVP, we prioritize:**
1. **Demo impact** over production quality
2. **Feature breadth** over depth (show many tools, not perfect tools)
3. **Visual feedback** over silent processing
4. **Real integrations** over mocked data
5. **Simplicity** over scalability

```
┌─────────────────────────────────────────────────────────────┐
│                     Varyant Platform (MVP)                   │
│                                                              │
│  ┌──────────────────┐         ┌──────────────────────┐     │
│  │   Dashboard      │         │   AI Agent           │     │
│  │   (Read-Only)    │◄────────┤   "Experiment        │     │
│  │                  │         │    Copilot"          │     │
│  │  - Metrics       │         │                      │     │
│  │  - Funnels       │         │   DEMO FOCUS:        │     │
│  │  - Charts        │         │   - Tool calling     │     │
│  │  (PostHog data)  │         │   - Streaming        │     │
│  │                  │         │   - Reasoning        │     │
│  └──────────────────┘         │   - Approvals        │     │
│                               └──────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                    │                    │
        ┌───────────┴─────────┬──────────┴──────────┬─────────────┐
        ▼                     ▼                      ▼             ▼
┌──────────────┐      ┌─────────────┐      ┌──────────────┐  ┌────────┐
│   PostHog    │      │   Linear    │      │   GitHub     │  │  Web   │
│   (Data)     │      │   (Tickets) │      │   (Code)     │  │ Search │
│              │      │             │      │              │  │        │
│ - Events     │      │ - Issues    │      │ - Repos      │  │ - UX   │
│ - Funnels    │      │ - Projects  │      │ - Actions    │  │   Tips │
│ - Experiments│      │ - Teams     │      │ - PRs        │  │ - Best │
│              │      │             │      │              │  │   Practices│
└──────▲───────┘      └─────────────┘      └──────────────┘  └────────┘
       │
       │ posthog-js SDK (tracking)
       │
┌──────┴────────────┐
│  Landing Page     │
│  (Minimal)        │
│                   │
│  - Hero Section   │  ← Subject of experiments
│  - CTA Button     │  ← What we're testing
│  - Tracking       │
└───────────────────┘
```

### Data Flow (Simplified for Demo)

**Analysis Phase:**
```
User: "Improve conversions for the hero CTA button"
  ↓
Agent: Query PostHog → Get data
  ↓
Agent: Web search → Research patterns
  ↓
Agent: Synthesize → Make recommendation
  ↓
User: See reasoning + suggestion
```

**Experiment Creation:**
```
User: "Create experiment for the hero CTA button"
  ↓
Agent: Create Linear ticket (approval required)
  ↓
Agent: Create PostHog experiment (approval required)
  ↓
Agent: Trigger GitHub Action that generated the code (approval required) → Open PR
  ↓
User: Review in GitHub (manual merge for demo)
```

---

## 3. Tech Stack

### Core Technologies

**Frontend (Analytics Platform):**
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (pre-built components)
- **Data Fetching:** TanStack Query
- **Tables:** TanStack Table
- **Charts:** Recharts

**AI Layer (The Star):**
- **SDK:** Vercel AI SDK v4+
- **Models:**
  - Primary: Claude Sonnet 4 (Anthropic) - best reasoning
  - Fallback: GPT-4o (OpenAI) - backup
- **Features Demonstrated:**
  - Tool calling (10+ tools)
  - Streaming responses
  - Multi-step agents (`maxSteps: 10`)
  - Approval flow (`needsApproval: true`)
  - Structured outputs

**Deployment:**
- **Hosting:** Vercel (free tier is fine)
- **Monorepo:** Turborepo (optional, could be single repo)
- **CI/CD:** GitHub Actions (for PR creation)

### Why These Choices?

**Next.js + Vercel:**
- ✅ You already have boilerplate
- ✅ Vercel AI SDK integrates perfectly
- ✅ Easy deployment
- ✅ Server actions for tool execution

**Anthropic Claude:**
- ✅ Best at reasoning (important for demo)
- ✅ Good at following complex instructions
- ✅ Handles tool calling well

**PostHog:**
- ✅ Real analytics platform (not custom-built)
- ✅ Good API documentation
- ✅ Free tier sufficient for demo
- ✅ Actual companies use it

**TypeScript:**
- ✅ Type safety for tools
- ✅ Better autocomplete
- ✅ Professional feel

---

## 4. External Integrations

### Integration Strategy for Demo

**Philosophy:** Use real APIs, but keep it simple. We're showing integration patterns, not building production systems.

---

### PostHog

**Role in Demo:** Analytics backend (replaces building custom analytics)

**What We Use:**
- Events API (read historical data)
- Insights API (funnels, trends)
- Feature Flags API (create experiments)
- posthog-js SDK (track on landing page)

**Demo-Specific Approach:**
```typescript
// We don't need complex queries - simple ones are fine
queryPostHog({
  event: 'cta_click',
  dateRange: '30d'
})
// ↑ This is enough to show the concept

// Don't need:
// - Real-time streaming
// - Complex filters
// - Cohort analysis
// - Advanced funnels
```

**APIs Used:**
```
GET  /api/projects/{id}/events           (query events)
POST /api/projects/{id}/query            (complex queries)
GET  /api/projects/{id}/feature_flags    (list experiments)
POST /api/projects/{id}/feature_flags    (create experiment)
```

**Setup Steps (Quick):**
1. Sign up at posthog.com (5 min)
2. Create project "Varyant Demo" (2 min)
3. Get API keys (1 min)
4. Run seeding script (10 min)
5. Verify data in dashboard (5 min)

**Data Seeding (Keep Simple):**
```typescript
// Generate ~10k events (not 100k - demo doesn't need scale)
// Seed over 30 days (realistic timeframe)
// Events: page_view, hero_view, cta_click, signup_started, signup_completed
// Keep it simple - don't need perfect statistical distribution
```

**What to Skip:**
- ❌ Complex cohort definitions
- ❌ Custom event properties (just device, browser, country)
- ❌ Real-time ingestion (batch is fine)
- ❌ Data warehouse integration
- ❌ Session replay
- ❌ Advanced analytics features

---

### Linear

**Role in Demo:** Show ticket creation automation

**What We Use:**
- GraphQL API (create issues)
- That's it - no updates, no queries needed for demo

**Demo-Specific Approach:**
```typescript
// Just create tickets - don't worry about updating them
createLinearIssue({
  title: "[EXP] Mobile CTA Test",
  description: "...",
  teamId: "...",
  priority: 2
})
// ↑ This is the only operation we need

// Don't need:
// - Updating issues
// - Querying issue status
// - Webhooks
// - Comments
// - Attachments
```

**API Used:**
```graphql
mutation CreateIssue {
  issueCreate(input: {...}) {
    issue { id, identifier, url }
  }
}
```

**Setup Steps (Quick):**
1. Create Linear workspace or use existing (2 min)
2. Generate API key (1 min)
3. Create "Experiments" project (1 min)
4. Note team ID and project ID (1 min)
5. Test API call (5 min)

**What to Skip:**
- ❌ Issue updates
- ❌ Status tracking
- ❌ Comments/threads
- ❌ File attachments
- ❌ Webhooks
- ❌ Advanced filtering

---

### GitHub

**Role in Demo:** Automate PR creation (impressive visual)

**What We Use:**
- Actions API (trigger workflow)
- Contents API (read file - optional)
- GitHub Action workflow (creates PR)

**Demo-Specific Approach:**
```typescript
// Trigger pre-built workflow - keep it simple
triggerGitHubAction({
  workflow: 'create-experiment-pr.yml',
  inputs: { code: '...', experimentId: '...' }
})
// ↑ Workflow does the heavy lifting

// Don't need:
// - Complex Git operations
// - Branch protection rules
// - Code reviews
// - Merge automation
```

**Workflow (Keep Simple):**
```yaml
# Just create branch, commit, open PR
# Don't worry about:
# - Running tests
# - Building artifacts
# - Deployments (Vercel auto-deploys)
# - Notifications (nice-to-have)
```

**Setup Steps (Quick):**
1. Create repo for landing page (5 min)
2. Add workflow file (10 min)
3. Generate PAT with repo scope (2 min)
4. Test workflow trigger (5 min)

**What to Skip:**
- ❌ Running CI/CD
- ❌ Automated merges
- ❌ Branch protection
- ❌ Code review bots
- ❌ Complex Git operations

---

### Web Search

**Role in Demo:** Show agent researching (impressive!)

**What We Use:**
- Brave Search API (AI SDK has built-in support)
- Simple queries only

**Demo-Specific Approach:**
```typescript
// Just basic search - results don't need to be perfect
webSearch({
  query: "mobile CTA button best practices UX",
  count: 5
})
// ↑ This is enough to show research capability

// Don't need:
// - Advanced search operators
// - Image search
// - Multiple providers
// - Result ranking
```

**Setup Steps (Quick):**
1. Get Brave Search API key (2 min, free tier)
2. Test a query (2 min)
3. Done

**What to Skip:**
- ❌ Multiple search providers
- ❌ Result caching
- ❌ Advanced filtering
- ❌ Image/video search
- ❌ Custom ranking

---

### Integration Summary (MVP Mindset)

| Service | What We Actually Need | What We Skip |
|---------|----------------------|--------------|
| **PostHog** | Query events, create feature flags | Real-time, cohorts, advanced analytics |
| **Linear** | Create issues | Updates, comments, webhooks |
| **GitHub** | Trigger Actions, create PRs | Complex Git, CI/CD, auto-merge |
| **Web Search** | Basic queries | Advanced operators, caching |

**Demo Philosophy:**
> "We're showing the integration pattern, not building a production system. Simple implementations that work are better than complex implementations that break during the demo."

---

## 5. Demo Flow

### Demo Structure (40 minutes)

**Philosophy for Demo:**
- ✅ Show breadth (many tools) over depth (perfect execution)
- ✅ Emphasize agent reasoning (visible tool calls)
- ✅ Make approvals meaningful (not just clicking)
- ✅ Keep energy high (don't get stuck on errors)
- ✅ Have backup plan (screenshots if APIs fail)

---

### Part 1: Introduction (3 mins)

**Goal:** Set context - this is about AI SDK, not about analytics

**Script:**
```
[Show title slide]

"Today I'm going to show you how to build AI-powered products using
Vercel's AI SDK. Not just chatbots - actual product features with AI.

The example we'll use is an experimentation platform, but the patterns
apply to any product. The key thing I want you to see is how the AI SDK
makes complex agentic behavior simple to implement.

[Switch to dashboard]

This is Varyant - a simple analytics dashboard with an AI copilot.
The data is from PostHog, a real analytics platform.

[Point to metrics]
We're tracking a landing page. 50k events over 30 days.
Our CTA conversion rate is 7.9%.

The interesting part isn't the dashboard - it's the AI agent.
Let me show you."
```

**Key Points to Emphasize:**
- This is about AI SDK features
- Demo project, not production app
- Focus on agent capabilities

---

### Part 2: AI Analysis & Research (12 mins)

**Goal:** Show tool calling, streaming, web search, agent reasoning

**Demo Script:** [See full conversation in previous version]

**Key Moments to Highlight:**

**After first PostHog query:**
> "Notice the streaming response - the agent is thinking out loud.
> Each tool call appears as it happens. This is AI SDK's streaming feature."

**After web search:**
> "The agent didn't just use our data - it went to the web and researched
> UX best practices. It's combining our analytics with industry knowledge.
> This is what makes it intelligent, not just a tool executor."

**After showing the analysis:**
> "Look at this reasoning. It's citing sources, showing calculations,
> estimating revenue impact. This is what agents do - they chain together
> multiple tools to reach a conclusion."

---

### Part 3: Create Experiment (5 mins)

**Goal:** Show approval flow (needsApproval feature)

**Demo Script:** [See conversation in previous version]

**Key Moments to Highlight:**

**When approval modal appears:**
> "This approval is built into the tool definition with `needsApproval: true`.
> The agent knows it can't just create experiments - it needs human confirmation.
> This is crucial for production AI systems. Not everything should be automatic."

**After approval:**
> "The agent just created a real feature flag in PostHog. If we opened
> PostHog right now, we'd see it there. These are real integrations."

---

### Part 4: Create Linear Ticket (3 mins)

**Goal:** Show multi-service orchestration

**Demo Script:** [See conversation in previous version]

**Key Moment to Highlight:**
> "The agent is orchestrating between multiple services. It created something
> in PostHog, now it's creating a ticket in Linear, and soon it'll open a PR
> in GitHub. This is agentic behavior - planning across multiple steps."

---

### Part 5: Generate Code (5 mins)

**Goal:** Show code generation (impressive for technical audience)

**Demo Script:** [See conversation in previous version]

**Key Moments to Highlight:**

**When code appears:**
> "This is real TypeScript code. Not pseudocode. It uses PostHog's SDK,
> includes device detection, and would actually work if you deployed it.
> The agent generated this from understanding our requirements."

**Show the code:**
> "Look at the quality - it's type-safe, follows React best practices,
> includes comments. This is production-ready code from a conversation."

---

### Part 6: Create PR (5 mins)

**Goal:** Show GitHub integration, automation

**Demo Script:** [See conversation in previous version]

**Key Moment to Highlight:**
> "We just triggered a GitHub Action that's creating a real PR right now.
> The agent orchestrated this entire workflow - from analyzing data, to
> researching solutions, to creating tickets, to opening PRs. All through
> conversation."

---

### Part 7: Analyze Past Results (Optional, 5 mins)

**Goal:** Show data analysis capabilities

**If time allows, show analysis of past experiment**

**Key Moment to Highlight:**
> "The agent can also help you understand results. It's calculating
> statistical significance, breaking down by segments, and explaining
> why a variant won. This is data science automation."

---

### Demo Timing Summary

| Section | Duration | Primary SDK Feature Shown |
|---------|----------|---------------------------|
| Intro | 3 min | Context setting |
| Analysis | 12 min | Tool calling + streaming + reasoning |
| Create Experiment | 5 min | needsApproval + tool calling |
| Create Ticket | 3 min | Multi-service orchestration |
| Generate Code | 5 min | Structured outputs + code generation |
| Create PR | 5 min | GitHub integration + automation |
| Past Results | 5 min (optional) | Data analysis |
| **Total** | **38-43 min** | **Leaves time for Q&A** |

---

### Backup Plan (If Things Break)

**Have Ready:**
1. Screenshots of each step
2. Screen recording of full successful run
3. Can switch to screenshots and narrate

**If a specific API fails:**
- PostHog: "Let me show you what this would return" [show screenshot]
- Linear: "This would create a ticket like this" [show screenshot]
- GitHub: "And this triggers a workflow that opens a PR" [show screenshot]

**Acceptable Failures:**
- One tool call timing out → retry or show screenshot
- Slow API response → fill time by explaining what's happening
- Styling glitch → ignore it, not the point

**Non-Acceptable Failures:**
- Chat interface not working → need backup recording
- All APIs down → need backup recording
- AI model unavailable → need backup recording

---

## 6. AI Agent Tools

### Tool Design Philosophy (For Demo)

**Goals:**
1. ✅ Show variety (breadth over depth)
2. ✅ Keep simple (don't over-engineer)
3. ✅ Make reliable (demo needs to work)
4. ✅ Show patterns (so audience can learn)

**Tool Categories:**
- **Data Query** (PostHog) - 3-4 tools
- **Research** (Web search) - 2 tools
- **Experiment Management** (PostHog) - 2-3 tools
- **Integration** (Linear, GitHub) - 2-3 tools
- **Code Generation** - 1-2 tools

**Total: ~10-12 tools** (enough to show capability, not so many we can't test them all)

---

### PostHog Tools (Data Query)

```typescript
queryPostHog: tool({
  description: `Query events and metrics from PostHog.
  Use this to understand user behavior and conversion rates.

  Examples:
  - How many users clicked the CTA in the last 30 days?
  - What's the conversion rate by device type?
  - Show me the funnel from page_view to signup_completed`,

  inputSchema: z.object({
    event: z.string().describe('Event name (e.g., "cta_click")'),
    dateRange: z.string().default('30d').describe('Time period (e.g., "7d", "30d")'),
    breakdownBy: z.string().optional().describe('Property to group by (e.g., "device", "browser")'),
    filters: z.record(z.any()).optional().describe('Additional filters'),
  }),

  execute: async ({ event, dateRange, breakdownBy, filters }) => {
    // Keep simple - just call PostHog API
    const response = await fetch(`${POSTHOG_API}/projects/${PROJECT_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${POSTHOG_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        kind: 'EventsQuery',
        select: ['*'],
        event,
        after: calculateDate(dateRange),
        // ... simplified query
      }),
    });

    const data = await response.json();

    // Return simplified result
    return {
      event,
      count: data.results.length,
      // ... basic stats
    };
  }
})

// Similar tools:
// - queryPostHogFunnel
// - listPostHogExperiments
// - getPostHogExperimentResults
```

**MVP Approach:**
- ✅ Basic queries only (don't need complex filters)
- ✅ Return simple objects (don't need perfect data structures)
- ✅ Cache API calls if possible (avoid rate limits)
- ❌ Don't need: real-time, complex joins, custom metrics

---

### Research Tools (Web Search)

```typescript
webSearch: tool({
  description: `Search the web for information about UX patterns, best practices,
  case studies, and industry benchmarks. Use this to research before making
  recommendations.

  Examples:
  - What are mobile CTA button best practices?
  - Find case studies about button color A/B tests
  - Research high-converting landing page patterns`,

  inputSchema: z.object({
    query: z.string().describe('Search query'),
    count: z.number().default(5).describe('Number of results (1-10)'),
  }),

  execute: async ({ query, count }) => {
    // AI SDK has built-in web search
    // Or use Brave Search API directly

    const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${query}&count=${count}`, {
      headers: {
        'X-Subscription-Token': BRAVE_API_KEY,
      },
    });

    const data = await response.json();

    // Return simplified results
    return {
      query,
      results: data.web.results.slice(0, count).map(r => ({
        title: r.title,
        url: r.url,
        snippet: r.description,
      })),
    };
  }
})

// Optional second tool:
// - webFetch (get full article content)
```

**MVP Approach:**
- ✅ Use AI SDK's built-in web_search if possible
- ✅ Basic queries are fine (don't need advanced operators)
- ✅ First 5 results are enough
- ❌ Don't need: ranking, caching, image search

---

### Experiment Management Tools

```typescript
createPostHogExperiment: tool({
  description: `Create a new A/B test experiment in PostHog.
  This creates a feature flag with multiple variants.

  Use this after analyzing data and getting user approval.`,

  inputSchema: z.object({
    name: z.string().describe('Experiment name'),
    key: z.string().describe('Feature flag key (kebab-case)'),
    variants: z.array(z.object({
      key: z.string(),
      name: z.string(),
    })).describe('List of variants to test'),
    targetEvent: z.string().describe('Success metric to track'),
  }),

  needsApproval: true, // ← This is the key SDK feature!

  execute: async ({ name, key, variants, targetEvent }) => {
    // Create feature flag in PostHog
    const response = await fetch(`${POSTHOG_API}/projects/${PROJECT_ID}/feature_flags/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${POSTHOG_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        key,
        filters: {
          groups: [{ rollout_percentage: 100 }],
          multivariate: {
            variants: variants.map((v, i) => ({
              key: v.key,
              name: v.name,
              rollout_percentage: Math.floor(100 / variants.length),
            })),
          },
        },
        active: true,
      }),
    });

    const data = await response.json();

    return {
      success: true,
      experimentId: data.id,
      url: `${POSTHOG_HOST}/feature_flags/${data.id}`,
    };
  }
})
```

**MVP Approach:**
- ✅ Simple 50/50 splits (don't need complex traffic allocation)
- ✅ Active immediately (don't need scheduling)
- ✅ All users (don't need targeting filters)
- ❌ Don't need: advanced filters, custom rollout, multiple metrics

---

### Integration Tools (Linear, GitHub)

```typescript
createLinearIssue: tool({
  description: `Create a ticket in Linear for implementation.
  Use this after creating an experiment to notify the engineering team.`,

  inputSchema: z.object({
    title: z.string(),
    description: z.string(),
    priority: z.number().min(0).max(4).default(2),
    labels: z.array(z.string()).optional(),
  }),

  needsApproval: true, // ← Another approval point

  execute: async ({ title, description, priority, labels }) => {
    // Linear uses GraphQL
    const query = `
      mutation CreateIssue($input: IssueCreateInput!) {
        issueCreate(input: $input) {
          issue {
            id
            identifier
            url
          }
        }
      }
    `;

    const response = await fetch('https://api.linear.app/graphql', {
      method: 'POST',
      headers: {
        'Authorization': LINEAR_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          input: {
            title,
            description,
            teamId: LINEAR_TEAM_ID,
            priority,
            labelIds: labels, // (would need to map label names to IDs)
          },
        },
      }),
    });

    const data = await response.json();

    return {
      success: true,
      issueId: data.data.issueCreate.issue.identifier,
      url: data.data.issueCreate.issue.url,
    };
  }
})

triggerGitHubAction: tool({
  description: `Trigger a GitHub Action workflow to create a pull request.
  Use this to deploy the generated code.`,

  inputSchema: z.object({
    workflow: z.string().default('create-experiment-pr.yml'),
    inputs: z.object({
      experiment_id: z.string(),
      linear_ticket: z.string(),
      component_code: z.string(),
      experiment_name: z.string(),
    }),
  }),

  needsApproval: true, // ← Third approval point

  execute: async ({ workflow, inputs }) => {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${workflow}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: 'main',
          inputs,
        }),
      }
    );

    // GitHub Action returns 204 No Content
    if (response.status === 204) {
      return {
        success: true,
        message: 'Workflow triggered successfully',
        // Note: Can't get run URL immediately, would need to poll
      };
    }

    throw new Error('Failed to trigger workflow');
  }
})
```

**MVP Approach:**
- ✅ Basic operations only (create, not update)
- ✅ Hard-coded values where appropriate (team ID, project ID)
- ✅ Minimal error handling (just throw on failure)
- ❌ Don't need: retries, webhooks, status updates

---

### Code Generation Tools

```typescript
generateExperimentCode: tool({
  description: `Generate React/TypeScript code for experiment variants.
  Creates a component that uses PostHog feature flags.`,

  inputSchema: z.object({
    experimentId: z.string(),
    componentName: z.string(),
    variants: z.array(z.object({
      name: z.string(),
      config: z.record(z.any()), // e.g., { buttonColor: '#f97316' }
    })),
  }),

  execute: async ({ experimentId, componentName, variants }) => {
    // For MVP: Use template literals (don't need complex AST manipulation)
    const code = `'use client';

import { useFeatureFlagVariantKey } from 'posthog-js/react';
import { usePostHog } from 'posthog-js/react';

export function ${componentName}() {
  const posthog = usePostHog();
  const variant = useFeatureFlagVariantKey('${experimentId}');

  // Variant configs
  const configs = {
${variants.map(v => `    '${v.name}': ${JSON.stringify(v.config, null, 4)}`).join(',\n')}
  };

  const config = configs[variant] || configs.control;

  return (
    <button
      style={{ backgroundColor: config.buttonColor }}
      onClick={() => posthog.capture('cta_click', { variant })}
    >
      Get Started
    </button>
  );
}`;

    return {
      success: true,
      code,
      language: 'typescript',
      filename: `${componentName}.tsx`,
    };
  }
})
```

**MVP Approach:**
- ✅ Template-based generation (simple, reliable)
- ✅ Basic TypeScript (don't need perfect types)
- ✅ Inline styles (simpler than CSS modules)
- ❌ Don't need: AST parsing, linting, formatting

---

### Tool Testing Strategy (MVP)

**For demo reliability:**

1. **Manual Testing:**
   - Test each tool individually
   - Test tool chains (query → analyze → suggest)
   - Test approval flows

2. **Error Handling:**
   - Wrap all API calls in try/catch
   - Return error messages (don't crash)
   - Have fallback responses

3. **Rate Limits:**
   - Cache PostHog queries (same query = cached result)
   - Limit web searches (max 5 per session)
   - Don't spam APIs during testing

4. **Backup Plan:**
   - If tool fails during demo, have screenshots
   - Can show "what would have happened"
   - Keep moving, don't debug live

---

### Tool Summary (10 Tools Total)

| Tool | Type | Approval? | Purpose |
|------|------|-----------|---------|
| `queryPostHog` | Data | No | Get metrics/events |
| `queryPostHogFunnel` | Data | No | Analyze funnels |
| `listPostHogExperiments` | Data | No | Show past experiments |
| `getPostHogExperimentResults` | Data | No | Analyze results |
| `webSearch` | Research | No | Find UX patterns |
| `createPostHogExperiment` | Action | **Yes** | Create experiment |
| `createLinearIssue` | Action | **Yes** | Create ticket |
| `triggerGitHubAction` | Action | **Yes** | Open PR |
| `generateExperimentCode` | Generation | No | Create React code |
| `analyzeSegments` | Analysis | No | Segment breakdown |

**3 approval gates** - just enough to show the feature without being annoying.

---

## 7. UI Components

### UI Philosophy (For Demo)

**Goals:**
1. ✅ Looks professional (not amateur)
2. ✅ Shows AI activity clearly (visible tool calls)
3. ✅ Works on projector (high contrast)
4. ✅ Fast to build (use shadcn)

**Not Goals:**
- ❌ Pixel-perfect design
- ❌ Mobile optimization (demo on desktop)
- ❌ Accessibility (demo only)
- ❌ Dark mode (if time allows, nice to have)

---

### Component Structure (Simplified)

```
/app
├── dashboard/page.tsx          ← Main dashboard
│   └── Components:
│       ├── MetricsOverview     (3-4 stat cards)
│       ├── ConversionChart     (simple line chart)
│       ├── EventsTable        (basic table)
│       └── ChatButton         (floating button)
│
└── components/
    ├── chat/
    │   ├── ChatInterface.tsx   ← Expandable chat UI
    │   ├── ChatMessage.tsx     ← Renders messages
    │   ├── ToolCallCard.tsx    ← Shows tool execution
    │   ├── ApprovalModal.tsx   ← Approval UI
    │   └── CodeDiffModal.tsx   ← Shows generated code
    │
    └── ui/                     ← shadcn components
        ├── button.tsx
        ├── card.tsx
        ├── modal.tsx
        ├── badge.tsx
        └── ... (use what you need)
```

---

### Chat Interface (The Star Component)

**Requirements:**
- Streaming text (word by word)
- Tool calls visible (expand/collapse)
- Code blocks with syntax highlighting
- Approval modals
- Loading states

**Implementation Shortcuts:**
```typescript
// Use AI SDK's useChat hook - does 90% of work
import { useChat } from 'ai/react';

const { messages, input, handleSubmit, isLoading } = useChat({
  api: '/api/chat',
  // That's it - streaming and tool calling are built-in
});
```

**Visual Design (Simple):**
- Floating button (bottom-right, sparkle icon ✨)
- Expands to chat window (600px wide, 700px tall)
- Dark background (looks professional)
- User messages: right-aligned, blue
- Agent messages: left-aligned, gray
- Tool cards: inline, collapsible

**Don't Need:**
- Multiple chat sessions
- Chat history persistence
- Edit messages
- Regenerate responses
- Export chat

---

### Tool Call Visualization

**Goal:** Make tool execution visible and interesting

**Design Pattern:**
```
┌────────────────────────────────────┐
│ 🔍 Query PostHog                   │  ← Icon + tool name
│ ────────────────────────────────  │
│ Event: cta_click                   │  ← Input params
│ Range: 30 days                     │
│ ────────────────────────────────  │
│ ✅ Complete (0.8s)                 │  ← Status
│ [Expand for details ▼]            │  ← Collapsible
└────────────────────────────────────┘

[If expanded:]
┌────────────────────────────────────┐
│ 🔍 Query PostHog                   │
│ ────────────────────────────────  │
│ Event: cta_click                   │
│ Range: 30 days                     │
│ ────────────────────────────────  │
│ Results:                           │
│ • 187 events                       │
│ • 2,347 total views                │
│ • 7.9% conversion rate             │
│                                    │
│ Breakdown by device:               │
│ • Mobile: 5.2%                     │
│ • Desktop: 10.1%                   │
│ [Collapse ▲]                       │
└────────────────────────────────────┘
```

**Implementation:**
```typescript
// Keep simple - just render tool results nicely
<ToolCallCard tool={toolInvocation}>
  {toolInvocation.state === 'result' && (
    <div className="results">
      {formatToolResult(toolInvocation.result)}
    </div>
  )}
</ToolCallCard>
```

**Color Coding:**
- Query tools: Blue border
- Action tools (with approval): Orange border
- Research tools: Green border
- Error state: Red border

---

### Approval Modal (Key UX)

**Goal:** Make approvals feel meaningful, not annoying

**Design Pattern:**
```
┌──────────────────────────────────────────┐
│ 🧪 Create Experiment                     │
│ ──────────────────────────────────────  │
│                                          │
│ You're about to:                         │
│ • Create feature flag in PostHog         │
│ • Start tracking on mobile users         │
│ • Split traffic 50/50                    │
│                                          │
│ Details:                                 │
│ Name: Mobile CTA Color Test              │
│ Variants: Blue vs Orange                 │
│ Target: ~5,000 mobile users              │
│                                          │
│ Risk: Low (non-destructive test)         │
│                                          │
│        [Cancel]    [✅ Approve]          │
└──────────────────────────────────────────┘
```

**Implementation Tips:**
```typescript
// AI SDK handles approval flow
// Just render the modal when tool.needsApproval is true

if (tool.needsApproval && !tool.approved) {
  return <ApprovalModal
    tool={tool}
    onApprove={() => approveTool(tool.id)}
    onReject={() => rejectTool(tool.id)}
  />;
}
```

**Don't Need:**
- Complex validation
- Multi-step approval
- Approval history
- Approval delegation

---

### Dashboard (Supporting Cast)

**Goal:** Look professional, provide context

**Minimum Components:**
1. **Metrics Cards** (3-4 cards)
   - Total events
   - Conversion rate
   - Active users
   - (Keep numbers static if needed)

2. **Simple Chart** (1 chart)
   - Conversion rate over time
   - Use Recharts (easy)
   - Can use dummy data if PostHog API is slow

3. **Events Table** (optional)
   - Shows recent events
   - Use TanStack Table
   - Can limit to 10 rows

**Implementation Shortcuts:**
```typescript
// Can use static data for visual appeal
const DEMO_DATA = {
  totalEvents: 50243,
  conversionRate: 7.9,
  activeUsers: 8420,
  // ... etc
};

// Only fetch real data for what agent queries
// Rest can be static for demo
```

---

### Landing Page (Experiment Subject)

**Goal:** Simple, clean, testable

**Live URL:** https://taxpal-zeta.vercel.app/ (current experiment subject)

**Requirements:**
- Hero section with CTA
- PostHog tracking
- Feature flag integration
- Nothing else needed

**Implementation:**
```typescript
// Keep it minimal
export default function Hero() {
  const variant = useFeatureFlagVariantKey('mobile-cta-test');
  const posthog = usePostHog();

  const buttonColor = variant === 'orange' ? '#f97316' : '#3b82f6';

  return (
    <section>
      <h1>Build Better Products</h1>
      <button
        style={{ backgroundColor: buttonColor }}
        onClick={() => posthog.capture('cta_click')}
      >
        Get Started
      </button>
    </section>
  );
}
```

**Don't Need:**
- Full landing page (just hero)
- Multiple pages
- Forms
- Complex interactions
- SEO optimization

---

### UI Component Summary

| Component | Complexity | Why It's Needed |
|-----------|-----------|-----------------|
| ChatInterface | Medium | Core demo interaction |
| ToolCallCard | Low | Shows AI activity |
| ApprovalModal | Low | Shows safety gates |
| CodeDiffModal | Low | Shows generated code |
| Dashboard | Low | Provides context |
| MetricsCards | Very Low | Visual appeal |
| ConversionChart | Low | Visual appeal |
| Hero (landing) | Very Low | Experiment subject |

**Total: ~8 components** (manageable for MVP)

---

## 8. Setup Requirements

### Time Investment Estimate

**Total Setup Time:** ~3-4 hours

| Task | Time | Priority |
|------|------|----------|
| Create accounts | 30 min | High |
| Get API keys | 15 min | High |
| Seed PostHog data | 45 min | High |
| Test all APIs | 60 min | High |
| Configure environment | 15 min | High |
| Deploy to Vercel | 15 min | Medium |

---

### Accounts & API Keys

**What You Need:**

| Service | Purpose | Free Tier? | Time to Setup |
|---------|---------|------------|---------------|
| **PostHog** | Analytics data | ✅ Yes (1M events/month) | 10 min |
| **Linear** | Ticket creation | ✅ Yes | 5 min |
| **GitHub** | Code + automation | ✅ Yes | 2 min (if have account) |
| **Anthropic** | AI model (primary) | ❌ No (~$10-20 for demo) | 5 min |
| **OpenAI** | AI model (fallback) | ❌ No (~$5 for demo) | 5 min |
| **Brave Search** | Web research | ✅ Yes (2k queries/month) | 5 min |
| **Vercel** | Hosting | ✅ Yes | Auto (via GitHub) |

**Total Cost for Demo:** ~$15-25 (mostly AI API usage)

---

### Environment Variables

```bash
# .env.local (for both apps)

# =====================
# AI Models
# =====================
ANTHROPIC_API_KEY=sk-ant-api03-...           # Primary model
OPENAI_API_KEY=sk-...                        # Fallback

# =====================
# PostHog
# =====================
NEXT_PUBLIC_POSTHOG_KEY=phc_...              # Public (client-side)
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
POSTHOG_PERSONAL_API_KEY=phx_...             # Private (server-side)
NEXT_PUBLIC_POSTHOG_PROJECT_ID=12345

# =====================
# Linear
# =====================
LINEAR_API_KEY=lin_api_...                   # From Linear settings
LINEAR_TEAM_ID=...                           # Your team ID

# =====================
# GitHub
# =====================
GITHUB_TOKEN=ghp_...                         # Personal Access Token
GITHUB_REPO=username/landing-page            # Format: owner/repo

# =====================
# Brave Search
# =====================
BRAVE_SEARCH_API_KEY=BSA...                  # From Brave API dashboard

# =====================
# App Config (Optional)
# =====================
NEXT_PUBLIC_APP_URL=https://taxpal-zeta.vercel.app
NODE_ENV=development
```

**Status:** Local `.env.local` is already configured; values are surfaced through `@lib/config/env.ts`.

**Security Notes (Demo Only):**
- ⚠️ Don't commit `.env.local` to Git
- ⚠️ Add to `.gitignore`
- ✅ For demo, it's OK to use personal tokens (not production practice)
- ✅ Vercel secrets are separate (add in Vercel dashboard)

---

### Setup Checklist

**Day Before Demo:**
- [ ] All API keys valid and working
- [ ] PostHog has seeded data (verify in dashboard)
- [ ] Linear workspace accessible
- [ ] GitHub Action tested (can create PRs)
- [ ] Landing page deployed and tracking (`https://taxpal-zeta.vercel.app` live)
- [ ] Analytics platform deployed
- [ ] Chat interface responds to test queries
- [ ] All approval modals render correctly
- [ ] Code generation works
- [ ] Network is stable (test at venue if possible)

**Morning of Demo:**
- [ ] Clear browser cache
- [ ] Log into PostHog (so can show if needed)
- [ ] Log into Linear (so can show ticket created)
- [ ] Log into GitHub (so can show PR)
- [ ] Close all other tabs
- [ ] Disable notifications
- [ ] Charge laptop fully
- [ ] Have backup laptop/phone ready

---

## 9. Implementation Phases

### Overview (3-4 Weeks)

**Week 1:** Foundation (infrastructure, setup)
**Week 2:** Dashboard + PostHog integration
**Week 3:** AI agent + core tools
**Week 4:** Integrations + polish + practice

---

### Week 1: Foundation (Days 1-7)

**Goal:** Get project running, data seeded, APIs tested

#### Day 1-2: Project Setup
```
Tasks:
- [ ] Get boilerplate from you (Next.js + Tailwind + shadcn)
- [ ] Set up monorepo structure (or single repo)
- [ ] Install AI SDK dependencies
- [ ] Configure TypeScript, ESLint
- [ ] Set up Git repository
- [ ] Initial commit

Time: ~4 hours
```

#### Day 3-4: External Services Setup
```
Tasks:
- [ ] Create PostHog account + project
- [ ] Create Linear workspace (or use existing)
- [ ] Generate all API keys
- [ ] Test each API with curl/Postman
- [ ] Document API endpoints needed
- [ ] Set up environment variables

Time: ~3 hours
```

#### Day 5-7: Data Seeding
```
Tasks:
- [ ] Write PostHog seeding script
- [ ] Generate ~10k users
- [ ] Generate ~50k events (realistic distribution)
- [ ] Create 1 past completed experiment
- [ ] Verify data in PostHog dashboard
- [ ] Document seeding process

Time: ~6 hours
```

**Week 1 Deliverable:**
- ✅ Project runs locally
- ✅ PostHog has demo data
- ✅ All APIs tested
- ✅ Environment configured

---

### Week 2: Dashboard (Days 8-14)

**Goal:** Build analytics UI, integrate PostHog

#### Day 8-9: Dashboard Layout
```
Tasks:
- [ ] Create /dashboard page
- [ ] Build metrics card component
- [ ] Add shadcn components needed
- [ ] Basic layout (responsive grid)
- [ ] Placeholder data

Time: ~4 hours
```

#### Day 10-11: PostHog Integration
```
Tasks:
- [ ] Create PostHog API helpers
- [ ] Test query functions
- [ ] Build API routes for data
- [ ] Integrate TanStack Query
- [ ] Display real data in dashboard

Time: ~5 hours
```

#### Day 12-13: Data Visualization
```
Tasks:
- [ ] Add Recharts
- [ ] Create conversion chart
- [ ] Create events table (TanStack Table)
- [ ] Add loading states
- [ ] Add error states

Time: ~4 hours
```

#### Day 14: Polish & Test
```
Tasks:
- [ ] Responsive testing
- [ ] Fix layout issues
- [ ] Add empty states
- [ ] Performance check
- [ ] Deploy to Vercel

Time: ~3 hours
```

**Week 2 Deliverable:**
- ✅ Dashboard shows PostHog data
- ✅ Charts render correctly
- ✅ Deployed to Vercel

---

### Week 3: AI Agent (Days 15-21)

**Goal:** Build AI chat, implement core tools

#### Day 15-16: Chat UI
```
Tasks:
- [ ] Set up AI SDK chat endpoint
- [ ] Create ChatInterface component
- [ ] Add floating chat button
- [ ] Implement expand/collapse
- [ ] Test basic streaming

Time: ~5 hours
```

#### Day 17-18: PostHog Tools
```
Tasks:
- [ ] Implement queryPostHog tool
- [ ] Implement queryPostHogFunnel tool
- [ ] Implement listPostHogExperiments tool
- [ ] Test tool calling
- [ ] Add tool call visualization (ToolCallCard)

Time: ~6 hours
```

#### Day 19: Research Tools
```
Tasks:
- [ ] Integrate Brave Search API
- [ ] Implement webSearch tool
- [ ] Test research queries
- [ ] Add search result visualization

Time: ~3 hours
```

#### Day 20-21: Experiment Tools
```
Tasks:
- [ ] Implement createPostHogExperiment tool
- [ ] Add needsApproval to tool
- [ ] Build ApprovalModal component
- [ ] Test approval flow
- [ ] Verify experiment creation in PostHog

Time: ~5 hours
```

**Week 3 Deliverable:**
- ✅ Chat interface works
- ✅ 4-5 tools implemented
- ✅ Approval flow works
- ✅ Agent can research + create experiments

---

### Week 4: Integrations + Polish (Days 22-28)

**Goal:** Complete integration tools, polish demo

#### Day 22: Linear Integration
```
Tasks:
- [ ] Set up Linear GraphQL client
- [ ] Implement createLinearIssue tool
- [ ] Add approval modal
- [ ] Test ticket creation
- [ ] Verify in Linear workspace

Time: ~3 hours
```

#### Day 23: GitHub Integration
```
Tasks:
- [ ] Create GitHub Action workflow
- [ ] Implement triggerGitHubAction tool
- [ ] Test workflow trigger
- [ ] Verify PR creation
- [ ] Test preview deploy

Time: ~4 hours
```

#### Day 24: Code Generation
```
Tasks:
- [ ] Implement generateExperimentCode tool
- [ ] Create CodeDiffModal component
- [ ] Add syntax highlighting (Prism.js)
- [ ] Test code generation
- [ ] Verify code quality

Time: ~3 hours
```

#### Day 25: Landing Page
```
Tasks:
- [ ] Set up landing page app
- [ ] Add PostHog SDK
- [ ] Implement feature flag logic
- [ ] Add CTA tracking
- [ ] Test variant assignment
- [ ] Deploy to Vercel

Time: ~4 hours
```

#### Day 26-27: Testing & Polish
```
Tasks:
- [ ] Test full workflow end-to-end
- [ ] Fix bugs
- [ ] Improve error handling
- [ ] Refine agent prompts
- [ ] Add loading states
- [ ] Improve UI animations
- [ ] Mobile testing (basic)

Time: ~6 hours
```

#### Day 28: Demo Prep
```
Tasks:
- [ ] Write demo script
- [ ] Practice demo 3x
- [ ] Take screenshots for backup
- [ ] Record screen recording
- [ ] Create slides (5 slides)
- [ ] Time each section
- [ ] Prepare for Q&A

Time: ~4 hours
```

**Week 4 Deliverable:**
- ✅ All integrations working
- ✅ Full workflow tested
- ✅ Demo script ready
- ✅ Backup plan in place

---

### Implementation Priority

**Must Have (P0):**
- ✅ Chat interface with streaming
- ✅ PostHog query tools (2-3 tools)
- ✅ Create experiment with approval
- ✅ Web search tool
- ✅ Code generation
- ✅ Basic dashboard

**Should Have (P1):**
- ✅ Linear integration
- ✅ GitHub integration
- ✅ Tool call visualization
- ✅ Past experiment analysis

**Nice to Have (P2):**
- Landing page with real tracking
- Advanced approval modals
- Segment analysis tool
- Error recovery

**Skip if Time Constrained:**
- Dark mode toggle
- Mobile optimization
- Complex animations
- Advanced error handling
- Unit tests

---

## 10. Demo Script

[See detailed demo script in Section 5]

### Key Reminders for Demo

**Before Starting:**
> "Quick context: This is a demo project to show AI SDK capabilities.
> It's not production-ready, but the integrations are real. The goal is
> to show you how to build AI-powered features in your products."

**Throughout Demo:**
- ✅ Point out AI SDK features explicitly
- ✅ Show tool calls as they happen
- ✅ Explain approval gates
- ✅ Highlight code quality
- ✅ Mention time to build (~3 weeks)

**After Demo:**
> "The key takeaway: AI SDK makes complex agentic behavior relatively
> simple to implement. Tool calling, streaming, approvals - it's all
> built-in. You're writing business logic, not AI plumbing."

**Q&A Prep:**

Common questions:
- **"How long did this take?"** → 3-4 weeks part-time
- **"What's the AI cost?"** → ~$0.10-0.50 per conversation
- **"Is this production-ready?"** → No, it's an MVP demo
- **"What about hallucinations?"** → Tool calling reduces them significantly
- **"Can I use other models?"** → Yes, AI SDK is model-agnostic
- **"Does this work with our stack?"** → Depends, but patterns are portable

---

## Appendix: Project Context Summary

### For AI Assistants Reading This Document

**Project Name:** Varyant

**Type:** Demo/MVP for technical talk

**Purpose:** Showcase Vercel AI SDK capabilities through realistic use case

**Scope:** Minimum viable demo (3-4 weeks development)

**Not Scope:** Production application, comprehensive analytics platform

**Key Constraints:**
- Must work reliably in live demo (45 min)
- Must show AI SDK features clearly
- Must integrate with real external services (PostHog, Linear, GitHub)
- Must be impressive to technical audience
- Does not need production-level quality, testing, or scalability

**Success Metrics:**
- Demo runs smoothly (or backup works)
- Audience understands AI SDK capabilities
- Code examples are clear and educational
- Questions about "how to get started" are answered

**Primary Audience:** SwordHealth engineering team + future viewers

**Context:** Tech talk about building AI-powered products, not about analytics platforms

---

**Document Version:** 2.0
**Last Updated:** December 2024
**Status:** Complete project plan for MVP demo
**Next Step:** Begin implementation Phase 1