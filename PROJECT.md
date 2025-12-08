# Varyant - AI-Powered Experimentation Platform
## Complete Project Plan

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
An analytics platform with an embedded AI agent that can:
- Analyze conversion metrics from PostHog
- Research UX best practices via web search
- Suggest data-driven experiments
- Create experiments in PostHog
- Generate Linear tickets for implementation
- Generate React code for variants
- Open GitHub PRs via Actions

### Why This Demo Works
1. **Real integrations** - PostHog, Linear, GitHub (not mocked)
2. **Agent intelligence** - Shows research + reasoning
3. **Approval gates** - Natural and justified
4. **No database needed** - Everything lives in external services
5. **Production-ready** - Actual workflow companies would use

### Target Audience
- Tech leads at SwordHealth
- Engineering teams interested in AI-powered tools
- Developers learning AI SDK

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Varyant Platform                         │
│                                                              │
│  ┌──────────────────┐         ┌──────────────────────┐     │
│  │   Dashboard      │         │   AI Agent           │     │
│  │                  │◄────────┤   "Experiment        │     │
│  │  - Metrics       │         │    Copilot"          │     │
│  │  - Funnels       │         │                      │     │
│  │  - Charts        │         │   Orchestrates:      │     │
│  │                  │         │   - PostHog          │     │
│  └──────────────────┘         │   - Linear           │     │
│                               │   - GitHub           │     │
│                               │   - Web Search       │     │
│                               └──────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                    │                    │
        ┌───────────┴─────────┬──────────┴──────────┬─────────────┐
        ▼                     ▼                      ▼             ▼
┌──────────────┐      ┌─────────────┐      ┌──────────────┐  ┌────────┐
│   PostHog    │      │   Linear    │      │   GitHub     │  │  Web   │
│              │      │             │      │              │  │ Search │
│ - Events     │      │ - Issues    │      │ - Repos      │  │        │
│ - Funnels    │      │ - Projects  │      │ - Actions    │  │ - UX   │
│ - Experiments│      │ - Teams     │      │ - PRs        │  │   Tips │
│ - Feature    │      │             │      │              │  │ - Best │
│   Flags      │      │             │      │              │  │   Practices│
└──────▲───────┘      └─────────────┘      └──────────────┘  └────────┘
       │
       │ posthog-js SDK
       │
┌──────┴────────────┐
│  Landing Page     │
│  (Demo App)       │
│                   │
│  - Hero Section   │
│  - CTA Button     │
│  - Event Tracking │
│  - Variant Logic  │
└───────────────────┘
```

### Data Flow

**Analysis Phase:**
```
User Question
  → AI Agent
  → PostHog API (query metrics)
  → Web Search (research UX patterns)
  → Agent Analysis
  → Suggestion to User
```

**Experiment Creation:**
```
User Approval
  → AI Agent
  → PostHog API (create experiment + feature flag)
  → Linear API (create ticket)
  → Code Generation
  → GitHub API (trigger action → create PR)
  → Preview Deploy (Vercel)
```

---

## 3. Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **State Management:** TanStack Query (for API calls)
- **Tables:** TanStack Table
- **Charts:** Recharts

### AI Layer
- **SDK:** Vercel AI SDK
- **Models:**
  - Primary: Claude Sonnet 4 (Anthropic)
  - Fallback: GPT-4o (OpenAI)
- **Features Used:**
  - Tool calling
  - Streaming responses
  - Multi-step agents (maxSteps)
  - Approval flow (needsApproval)
  - Structured outputs

### Deployment
- **Hosting:** Vercel
- **Analytics Landing Page:** Separate Vercel project
- **CI/CD:** GitHub Actions

### Development
- **Package Manager:** pnpm
- **Monorepo:** Turborepo
- **Linting:** ESLint + Prettier
- **Git:** GitHub

---

## 4. External Integrations

### PostHog
**Purpose:** Analytics platform + Experimentation engine

**What We Use:**
- Events API (query historical data)
- Insights API (funnels, trends)
- Feature Flags API (create experiments)
- Experiments API (manage A/B tests)
- posthog-js SDK (client-side tracking)

**APIs Needed:**
```
GET  /api/projects/{project_id}/events
GET  /api/projects/{project_id}/insights
POST /api/projects/{project_id}/feature_flags
GET  /api/projects/{project_id}/feature_flags
POST /api/projects/{project_id}/query  (for complex queries)
```

**Setup:**
1. Create PostHog account (cloud or self-hosted)
2. Create new project "Varyant Demo"
3. Get API keys:
   - Project API Key (public, for tracking)
   - Personal API Key (private, for queries)
4. Note Project ID

**Data Seeding:**
- Use PostHog's bulk ingestion API
- Seed ~50k events over 30-day period
- Events: `page_view`, `hero_view`, `cta_click`, `signup_started`, `signup_completed`
- Properties: device, browser, country, timestamp
- Create 1 past completed experiment (Hero Copy Test)

---

### Linear
**Purpose:** Project management / ticket creation

**What We Use:**
- Issues API (create tickets)
- Teams API (list teams)
- Projects API (assign to project)

**APIs Needed:**
```
POST /graphql  (Linear uses GraphQL)

mutation CreateIssue {
  issueCreate(input: {
    title: "..."
    description: "..."
    teamId: "..."
    projectId: "..."
    labelIds: [...]
    priority: 2
  }) {
    issue {
      id
      identifier
      url
    }
  }
}
```

**Setup:**
1. Create Linear workspace or use existing
2. Generate API key (Settings → API)
3. Create project "Experiments"
4. Create labels: "experiment", "ai-generated", "frontend"
5. Note Team ID and Project ID

---

### GitHub
**Purpose:** Code repository + automation

**What We Use:**
- Repository API (read files)
- Actions API (trigger workflows)
- Pull Requests API (create PRs)

**APIs Needed:**
```
GET  /repos/{owner}/{repo}/contents/{path}
POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches
POST /repos/{owner}/{repo}/pulls
```

**Setup:**
1. Create repository for landing page
2. Add GitHub Action workflow (create-experiment-pr.yml)
3. Generate Personal Access Token with repo scope
4. Add secrets to repository:
   - `POSTHOG_API_KEY`
   - `LINEAR_API_KEY`

**GitHub Action:**
```yaml
# .github/workflows/create-experiment-pr.yml
name: Create Experiment PR

on:
  workflow_dispatch:
    inputs:
      experiment_id:
        required: true
      linear_ticket:
        required: true
      component_code:
        required: true
      experiment_name:
        required: true

jobs:
  create-pr:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Create experiment branch
        run: |
          git checkout -b exp/${{ inputs.experiment_id }}

      - name: Write code changes
        run: |
          echo "${{ inputs.component_code }}" > app/components/Hero.tsx

      - name: Commit changes
        run: |
          git config user.name "Varyant Bot"
          git config user.email "bot@varyant.dev"
          git add .
          git commit -m "feat: ${{ inputs.experiment_name }}"
          git push origin exp/${{ inputs.experiment_id }}

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          branch: exp/${{ inputs.experiment_id }}
          title: "🧪 [${{ inputs.linear_ticket }}] ${{ inputs.experiment_name }}"
          body: |
            ## Experiment Implementation

            **PostHog Experiment:** [View in PostHog](https://app.posthog.com/experiments/${{ inputs.experiment_id }})
            **Linear Ticket:** [View in Linear](https://linear.app/issue/${{ inputs.linear_ticket }})

            ### Changes
            This PR implements experiment variants for A/B testing.

            ### Testing
            - [ ] Preview deploy shows both variants
            - [ ] PostHog tracking working
            - [ ] No console errors

            ---
            *Generated by Varyant AI*
          labels: experiment,automated
```

---

### Web Search
**Purpose:** Research UX best practices, competitor analysis

**Provider Options:**
1. **Brave Search API** (recommended - AI SDK built-in)
2. **Tavily AI** (search optimized for LLMs)
3. **Google Custom Search** (fallback)

**Setup:**
- Get Brave Search API key (free tier: 2000 queries/month)
- Or use AI SDK's built-in web search tool

**Example Queries:**
- "mobile CTA button best practices UX"
- "button color conversion rate optimization studies"
- "thumb-friendly button sizes mobile design"
- "high contrast CTA examples ecommerce"

---

## 5. Demo Flow

### Part 1: Introduction (3 mins)
**Show the analytics dashboard**
- "This is Varyant - an experimentation platform"
- Show PostHog data: events table, funnel chart
- "We're tracking a landing page with 50k events over 30 days"
- "Our CTA conversion rate is 7.9%"

---

### Part 2: AI Analysis & Research (12 mins)

**Open AI Chat Interface**

```
👤 User: "I want to improve our CTA conversion rate"

🤖 Agent: "Let me analyze your current performance..."

→ Tool: queryPostHog({ event: 'cta_click', timeRange: '30d' })
   Result: 187 clicks, 2,347 views → 7.9% conversion

→ Tool: queryPostHog({ event: 'cta_click', breakdownBy: 'device' })
   Result:
   - Mobile: 5.2% (97/1,867 views)
   - Desktop: 10.1% (90/890 views)
   - Gap: 48% lower on mobile

🤖 Agent: "I found a significant opportunity. Mobile users convert
           48% worse than desktop. Let me research why this happens..."

→ Tool: webSearch({ query: "mobile CTA button conversion best practices" })
   Finds:
   - Baymard Institute: 44px minimum tap target for mobile
   - Nielsen: High-contrast buttons improve mobile conversions 15-20%
   - Google Material: Orange/Red outperform blue on mobile

→ Tool: webSearch({ query: "button color A/B test results case studies" })
   Finds:
   - HubSpot: Red button +21% vs green
   - Performable: Orange button +32.5% vs blue
   - VWO: High-contrast colors win 80% of mobile tests

→ Tool: queryPostHog({
     event: 'hero_view',
     breakdownBy: 'viewport_width',
     filters: { device: 'mobile' }
   })
   Result: 67% are on screens ≤ 390px (iPhone size)

🤖 Agent: "Analysis complete. Here's what I found:

**Problem:** Mobile users struggle with your current CTA
- 48% conversion gap vs desktop (5.2% vs 10.1%)
- 67% of mobile users on small screens (≤390px)

**Research Findings:**
- Industry data shows orange buttons outperform blue by 15-32% on mobile
- High-contrast colors crucial for small screens
- Your current blue (#3b82f6) may lack contrast on mobile

**Recommendation:**
Test a high-contrast orange button (#f97316) vs your current blue.

Expected impact:
- Lift: +15-20% mobile conversion (industry benchmark)
- Revenue: ~$1,400/month additional (at current traffic + 2% signup rate)
- Confidence threshold: 7 days at current volume

Should I create this experiment?"
```

---

### Part 3: Create Experiment (5 mins)

```
👤 User: "Yes, create the experiment"

🤖 Agent: "I'll create the experiment in PostHog. This will:
           - Create feature flag 'mobile-cta-color-test'
           - Split mobile traffic 50/50
           - Track 'cta_click' conversions
           - Run for 7 days minimum

           Approve creation?"

[APPROVAL MODAL APPEARS]
┌──────────────────────────────────────────┐
│ 🧪 Create Experiment                     │
│                                          │
│ Name: Mobile CTA Color Test              │
│ Variants:                                │
│  • Control: Blue (#3b82f6)               │
│  • Variant: Orange (#f97316)             │
│                                          │
│ Target: Mobile users only                │
│ Metric: cta_click                        │
│ Duration: 7 days                         │
│                                          │
│ [❌ Cancel]  [✅ Create Experiment]      │
└──────────────────────────────────────────┘

👤 User: [Clicks "Create Experiment"]

🤖 Agent:
→ Tool: createPostHogExperiment({
     name: "Mobile CTA Color Test",
     key: "mobile-cta-color-test",
     variants: [
       { key: 'control', name: 'Blue Button' },
       { key: 'orange', name: 'Orange Button' }
     ],
     filters: { properties: [{ key: 'device', value: 'mobile' }] }
   })

   Result: ✅ Created successfully
   Experiment ID: exp_7j3k9m
   URL: https://app.posthog.com/experiments/exp_7j3k9m

🤖 Agent: "✅ Experiment created in PostHog!

           Next step: Create implementation ticket in Linear?"
```

---

### Part 4: Create Linear Ticket (3 mins)

```
🤖 Agent: "I'll create a ticket for your engineering team.

**Title:** [EXP] Mobile CTA Color Test
**Description:**
Implement A/B test for mobile CTA button color based on conversion analysis.

**Background:**
- Mobile conversion is 48% lower than desktop (5.2% vs 10.1%)
- Research shows orange buttons outperform blue by 15-32% on mobile
- Expected lift: +15-20% mobile conversions

**Implementation:**
- PostHog experiment: exp_7j3k9m
- Feature flag: mobile-cta-color-test
- Component: app/components/Hero.tsx
- Change: Button color #3b82f6 → #f97316 for mobile users
- Tracking: Ensure cta_click event fires

**Acceptance Criteria:**
- [ ] Variant logic implemented
- [ ] PostHog tracking verified
- [ ] Preview deploy tested on mobile
- [ ] Desktop users unaffected

Approve ticket creation?"

[APPROVAL MODAL]
┌──────────────────────────────────────────┐
│ 📋 Create Linear Ticket                  │
│                                          │
│ Project: Experiments                     │
│ Team: Engineering                        │
│ Priority: Medium                         │
│ Labels: experiment, frontend, mobile     │
│                                          │
│ Estimate: 2 hours                        │
│                                          │
│ [❌ Cancel]  [✅ Create Ticket]          │
└──────────────────────────────────────────┘

👤 User: [Clicks "Create Ticket"]

🤖 Agent:
→ Tool: createLinearIssue({
     title: "[EXP] Mobile CTA Color Test",
     description: "...",
     teamId: "...",
     projectId: "...",
     priority: 2,
     labels: ["experiment", "frontend", "mobile"]
   })

   Result: ✅ Created successfully
   Ticket: SWD-1234
   URL: https://linear.app/sword/issue/SWD-1234

🤖 Agent: "✅ Linear ticket created: SWD-1234

           Next: Generate implementation code?"
```

---

### Part 5: Generate Code (5 mins)

```
👤 User: "Yes, generate the code"

🤖 Agent: "Let me check the current implementation first..."

→ Tool: checkGitHubFile({
     repo: 'landing-page',
     path: 'app/components/Hero.tsx'
   })

   Result: [Shows current code]
   - Uses PostHog SDK ✓
   - Has cta_click tracking ✓
   - TypeScript ✓
   - No conflicts detected ✓

🤖 Agent: "Current code looks good. Generating experiment variant..."

→ Tool: generateExperimentCode({
     experimentId: 'exp_7j3k9m',
     component: 'Hero',
     variants: [
       { name: 'control', config: { buttonColor: '#3b82f6' } },
       { name: 'orange', config: { buttonColor: '#f97316' } }
     ],
     targetDevice: 'mobile'
   })

[CODE DIFF MODAL APPEARS]
┌──────────────────────────────────────────────────────────┐
│ 📝 Generated Code                                         │
│                                                           │
│ app/components/Hero.tsx                                   │
│ ────────────────────────────────────────────────────────│
│  'use client';                                            │
│                                                           │
│  import { useFeatureFlagVariantKey } from 'posthog-js/react';│
│  import { usePostHog } from 'posthog-js/react';          │
│+ import { useDeviceDetect } from '@/hooks/useDeviceDetect';│
│                                                           │
│  export function Hero() {                                 │
│    const posthog = usePostHog();                         │
│+   const variant = useFeatureFlagVariantKey(             │
│+     'mobile-cta-color-test'                             │
│+   );                                                     │
│+   const { isMobile } = useDeviceDetect();               │
│                                                           │
│+   const buttonColor = isMobile && variant === 'orange'  │
│+     ? '#f97316' // Orange variant                       │
│+     : '#3b82f6'; // Blue control                        │
│                                                           │
│    return (                                               │
│      <button                                              │
│-       className="bg-blue-600"                           │
│+       style={{ backgroundColor: buttonColor }}          │
│        onClick={() => posthog.capture('cta_click')}      │
│      >                                                    │
│        Get Started                                        │
│      </button>                                            │
│    );                                                     │
│  }                                                        │
│                                                           │
│ [📋 Copy Code]                                [Close]     │
└──────────────────────────────────────────────────────────┘

🤖 Agent: "Code generated! This implementation:
           - Uses PostHog feature flag API
           - Targets mobile users only
           - Preserves existing click tracking
           - Type-safe with TypeScript

           Ready to create PR?"
```

---

### Part 6: Create PR via GitHub Action (5 mins)

```
👤 User: "Yes, create the PR"

🤖 Agent: "I'll trigger a GitHub Action to:
           1. Create branch: exp/exp_7j3k9m
           2. Commit code changes
           3. Open pull request
           4. Deploy preview to Vercel

           This will notify your team and link to:
           - PostHog experiment
           - Linear ticket SWD-1234

           Approve?"

[APPROVAL MODAL]
┌──────────────────────────────────────────┐
│ 🚀 Deploy Code                           │
│                                          │
│ This will:                               │
│ ✓ Create Git branch                      │
│ ✓ Commit generated code                  │
│ ✓ Open Pull Request                      │
│ ✓ Trigger Vercel preview deploy          │
│ ✓ Notify team in Linear                  │
│                                          │
│ Branch: exp/exp_7j3k9m                   │
│ Files: app/components/Hero.tsx           │
│                                          │
│ ⚠️ This creates a PR that will need      │
│    manual review and merge.              │
│                                          │
│ [❌ Cancel]  [✅ Create PR]               │
└──────────────────────────────────────────┘

👤 User: [Clicks "Create PR"]

🤖 Agent:
→ Tool: triggerGitHubAction({
     workflow: 'create-experiment-pr',
     inputs: {
       experiment_id: 'exp_7j3k9m',
       linear_ticket: 'SWD-1234',
       component_code: '...',
       experiment_name: 'Mobile CTA Color Test'
     }
   })

   Result: ✅ Action triggered
   Run ID: 1234567890
   Status: in_progress

[Wait 30 seconds - show loading animation]

🤖 Agent: "✅ Pull request created!

           PR: #234 - [SWD-1234] Mobile CTA Color Test
           URL: https://github.com/you/landing/pull/234
           Preview: https://landing-pr-234.vercel.app (deploying...)

           Next steps:
           1. Review code in GitHub
           2. Test preview deploy on mobile
           3. Merge when ready
           4. Experiment will start tracking automatically

           🎯 Summary:
           - PostHog experiment: Created ✓
           - Linear ticket: SWD-1234 ✓
           - Pull request: #234 ✓
           - Preview deploy: In progress...

           I'll monitor the experiment and notify you when we have
           statistically significant results (est. 7 days)."
```

---

### Part 7: Analyze Past Experiment (10 mins)

```
👤 User: "Show me results from past experiments"

🤖 Agent:
→ Tool: listPostHogExperiments({ status: 'complete' })

   Result: Found 1 completed experiment

🤖 Agent: "You have 1 completed experiment:

**Hero Copy Test**
- Status: Completed (Dec 1-7, 2024)
- Variants: 'Join Today' vs 'Get Started Free'
- Result: Variant won with 95.8% confidence
- Not yet rolled out

Would you like me to analyze the results?"

👤 User: "Yes, analyze it"

🤖 Agent:
→ Tool: getPostHogExperimentResults({
     experimentId: 'hero-copy-test'
   })
→ Tool: queryPostHog({
     event: 'cta_click',
     breakdownBy: '$feature/hero-copy-test',
     dateRange: 'Dec 1-7'
   })

🤖 Agent: "Let me break down the results..."

→ Tool: analyzeSegments({
     experimentId: 'hero-copy-test',
     segmentBy: ['device', 'user_type']
   })

[RESULTS VISUALIZATION APPEARS IN CHAT]
┌──────────────────────────────────────────────────────┐
│ 📊 Hero Copy Test Results                            │
│                                                       │
│ Overall Performance:                                  │
│ ├─ Control: "Join Today"                             │
│ │  └─ 102/1,247 clicks (8.2%)                        │
│ └─ Variant: "Get Started Free"                       │
│    └─ 121/1,247 clicks (9.7%)                        │
│                                                       │
│ 📈 Lift: +18.3% (1.5pp absolute)                     │
│ ✅ Confidence: 95.8% (statistically significant)     │
│                                                       │
│ By Device:                                            │
│ ├─ Mobile:   +22% lift (5.1% → 6.2%)                │
│ └─ Desktop:  +15% lift (10.1% → 11.6%)              │
│                                                       │
│ By User Type:                                         │
│ ├─ New:       +31% lift (6.8% → 8.9%)               │
│ └─ Returning: +8% lift (11.2% → 12.1%)              │
│                                                       │
│ [View Full Report in PostHog →]                      │
└──────────────────────────────────────────────────────┘

🤖 Agent: "Excellent results! Here's my analysis:

**Winner: 'Get Started Free' variant**

**Why it won:**
1. **'Free' reduces friction** - New users responded strongly
   (+31% lift) to the emphasis on zero cost

2. **'Get Started' is action-oriented** - More direct than
   'Join Today' which is vague

3. **Compound effect** - Both elements (Free + Get Started)
   worked together

**Segment Insights:**
- Mobile users benefited most (+22%) - likely because they're
  more cautious about commitments on mobile

- New visitors loved it (+31%) - 'Free' addresses their main
  objection: "Will this cost money?"

- Returning users saw smaller gains (+8%) - they already
  understand your value prop

**Revenue Impact:**
- Current: 187 clicks/day × 2% conversion × $120 LTV = $450/day
- With rollout: 221 clicks/day × 2% × $120 = $530/day
- **Additional: $2,400/month**

**Recommendation:**
Roll this out to 100% of users immediately. The results are
statistically significant and consistent across all segments.

Should I generate the rollout code?"
```

---

## 6. AI Agent Tools

### PostHog Tools

```typescript
queryPostHog: tool({
  description: "Query events and metrics from PostHog",
  inputSchema: z.object({
    event: z.string(),
    dateRange: z.string().default('30d'),
    breakdownBy: z.string().optional(),
    filters: z.record(z.any()).optional(),
  }),
  execute: async ({ event, dateRange, breakdownBy, filters }) => {
    // Call PostHog API
    // Return: event counts, conversion rates, breakdowns
  }
})

queryPostHogFunnel: tool({
  description: "Analyze conversion funnel",
  inputSchema: z.object({
    events: z.array(z.string()),
    dateRange: z.string().default('30d'),
  }),
  execute: async ({ events, dateRange }) => {
    // Call PostHog Insights API
    // Return: step-by-step conversion rates
  }
})

createPostHogExperiment: tool({
  description: "Create experiment with feature flag",
  inputSchema: z.object({
    name: z.string(),
    key: z.string(),
    variants: z.array(z.object({
      key: z.string(),
      name: z.string(),
    })),
    targetEvent: z.string(),
    filters: z.object({}).optional(),
  }),
  needsApproval: true,
  execute: async (data) => {
    // Create feature flag in PostHog
    // Return: experiment ID, URL
  }
})

getPostHogExperimentResults: tool({
  description: "Get results for completed experiment",
  inputSchema: z.object({
    experimentId: z.string(),
  }),
  execute: async ({ experimentId }) => {
    // Query PostHog for experiment data
    // Calculate: conversions, lift, confidence
    // Return: detailed results
  }
})

listPostHogExperiments: tool({
  description: "List experiments by status",
  inputSchema: z.object({
    status: z.enum(['draft', 'running', 'complete']).optional(),
  }),
  execute: async ({ status }) => {
    // List feature flags from PostHog
    // Filter by status
    // Return: array of experiments
  }
})
```

### Linear Tools

```typescript
createLinearIssue: tool({
  description: "Create ticket in Linear",
  inputSchema: z.object({
    title: z.string(),
    description: z.string(),
    teamId: z.string(),
    projectId: z.string().optional(),
    priority: z.number().min(0).max(4).default(2),
    labels: z.array(z.string()).optional(),
    estimate: z.number().optional(),
  }),
  needsApproval: true,
  execute: async (data) => {
    // Call Linear GraphQL API
    // Create issue
    // Return: issue ID, identifier, URL
  }
})

updateLinearIssue: tool({
  description: "Update Linear ticket status/details",
  inputSchema: z.object({
    issueId: z.string(),
    status: z.string().optional(),
    comment: z.string().optional(),
  }),
  execute: async (data) => {
    // Update issue via GraphQL
    // Return: updated issue
  }
})
```

### GitHub Tools

```typescript
checkGitHubFile: tool({
  description: "Read current file from GitHub",
  inputSchema: z.object({
    repo: z.string(),
    path: z.string(),
    branch: z.string().default('main'),
  }),
  execute: async ({ repo, path, branch }) => {
    // GET /repos/{owner}/{repo}/contents/{path}
    // Return: file content, sha
  }
})

triggerGitHubAction: tool({
  description: "Trigger GitHub Action workflow",
  inputSchema: z.object({
    repo: z.string(),
    workflow: z.string(),
    inputs: z.record(z.any()),
  }),
  needsApproval: true,
  execute: async ({ repo, workflow, inputs }) => {
    // POST /repos/{owner}/{repo}/actions/workflows/{workflow}/dispatches
    // Return: run ID, status URL
  }
})
```

### Research Tools

```typescript
webSearch: tool({
  description: "Search web for UX patterns, best practices, case studies",
  inputSchema: z.object({
    query: z.string(),
    count: z.number().default(5),
  }),
  execute: async ({ query, count }) => {
    // Use Brave Search API or AI SDK web_search
    // Return: titles, snippets, URLs
  }
})

webFetch: tool({
  description: "Fetch and read full article",
  inputSchema: z.object({
    url: z.string(),
  }),
  execute: async ({ url }) => {
    // Fetch URL content
    // Extract main text
    // Return: title, content, summary
  }
})
```

### Analysis Tools

```typescript
analyzeSegments: tool({
  description: "Break down experiment results by segments",
  inputSchema: z.object({
    experimentId: z.string(),
    segmentBy: z.array(z.enum(['device', 'user_type', 'country', 'browser'])),
  }),
  execute: async ({ experimentId, segmentBy }) => {
    // Query PostHog with breakdown
    // Calculate lift per segment
    // Return: segment analysis
  }
})

calculateStatisticalSignificance: tool({
  description: "Calculate confidence level for experiment",
  inputSchema: z.object({
    controlConversions: z.number(),
    controlExposures: z.number(),
    variantConversions: z.number(),
    variantExposures: z.number(),
  }),
  execute: async (data) => {
    // Z-test for proportions
    // Return: confidence level, p-value, significant boolean
  }
})
```

### Code Generation Tools

```typescript
generateExperimentCode: tool({
  description: "Generate React component code with variants",
  inputSchema: z.object({
    experimentId: z.string(),
    component: z.string(),
    variants: z.array(z.object({
      name: z.string(),
      config: z.record(z.any()),
    })),
    targetDevice: z.enum(['all', 'mobile', 'desktop']).optional(),
  }),
  execute: async (data) => {
    // Generate TypeScript React code
    // Include PostHog SDK usage
    // Include device detection if needed
    // Return: code string
  }
})

generateRolloutCode: tool({
  description: "Generate code to rollout winning variant",
  inputSchema: z.object({
    experimentId: z.string(),
    winningVariant: z.string(),
  }),
  execute: async (data) => {
    // Get experiment details
    // Generate code without feature flag logic
    // Hard-code winning variant
    // Return: simplified code
  }
})
```

---

## 7. UI Components

### Analytics Dashboard

**Components Needed:**

```
/dashboard
├── MetricsOverview
│   ├── TotalEvents (card)
│   ├── ConversionRate (card)
│   ├── UniqueUsers (card)
│   └── TrendChart (recharts)
│
├── FunnelChart
│   └── VerticalFunnel (recharts)
│
├── EventsTable
│   └── TanStackTable
│       ├── Columns: Event, User, Device, Timestamp
│       ├── Filtering
│       └── Sorting
│
└── ActiveExperiments
    └── ExperimentCard[]
        ├── Name
        ├── Status badge
        ├── Variants
        └── Progress bar
```

**Key Features:**
- Real-time data from PostHog
- Responsive design (mobile-friendly)
- Dark mode
- Loading states
- Error boundaries

---

### AI Chat Interface

**Components Needed:**

```
/chat
├── ChatInterface
│   ├── ChatHeader
│   │   ├── Avatar (✨ sparkles)
│   │   └── Title "Experiment Copilot"
│   │
│   ├── MessageList
│   │   └── ChatMessage[]
│   │       ├── UserMessage (right aligned, blue)
│   │       ├── AssistantMessage (left aligned, dark)
│   │       ├── ToolCallCard (collapsible)
│   │       └── CodeBlock (syntax highlighted)
│   │
│   ├── ApprovalModal
│   │   ├── ExperimentApproval
│   │   ├── LinearTicketApproval
│   │   └── GitHubActionApproval
│   │
│   └── ChatInput
│       ├── TextArea (auto-resize)
│       ├── SendButton
│       └── SuggestedPrompts (chips)
```

**Key Features:**
- Streaming responses (word by word)
- Tool calls expand/collapse
- Code syntax highlighting (Prism.js)
- Approval modals with details
- Markdown rendering
- Copy code button
- Loading states
- Error handling

---

### Tool Call Visualizations

**ToolCallCard Component:**

```typescript
// Visual representation based on tool type

queryPostHog:
┌────────────────────────────────┐
│ 📊 Query PostHog              │
│ ─────────────────────────────│
│ Event: cta_click              │
│ Range: Last 30 days           │
│ ─────────────────────────────│
│ Results:                      │
│ • 187 events                  │
│ • 7.9% conversion rate        │
│ [Expand for details ▼]        │
└────────────────────────────────┘

webSearch:
┌────────────────────────────────┐
│ 🔍 Web Search                 │
│ ─────────────────────────────│
│ Query: mobile CTA best        │
│        practices              │
│ ─────────────────────────────│
│ Found 5 results:              │
│ 1. Baymard Institute: 44px... │
│ 2. Nielsen: High-contrast...  │
│ [Expand for full articles ▼]  │
└────────────────────────────────┘

createPostHogExperiment:
┌────────────────────────────────┐
│ 🧪 Create Experiment          │
│ ─────────────────────────────│
│ Status: ✅ Created            │
│ ID: exp_7j3k9m                │
│ URL: app.posthog.com/exp/...  │
│ [View in PostHog →]           │
└────────────────────────────────┘
```

---

### Approval Modals

**Design Pattern:**
- Full-screen overlay with backdrop blur
- Centered modal (max-width: 600px)
- Clear title with icon
- Detailed information
- Risk indicators (if applicable)
- Two-button choice: Cancel (subtle) + Approve (prominent)

**Example:**

```
┌──────────────────────────────────────────┐
│ 🧪 Create Experiment                     │
│ ──────────────────────────────────────  │
│                                          │
│ Name: Mobile CTA Color Test              │
│                                          │
│ Variants:                                │
│  • Control: Blue button (#3b82f6)        │
│  • Variant: Orange button (#f97316)      │
│                                          │
│ Configuration:                           │
│  • Target: Mobile users only             │
│  • Metric: cta_click                     │
│  • Duration: 7 days                      │
│  • Traffic: 50/50 split                  │
│                                          │
│ Impact:                                  │
│  • Affects: ~5,000 users                 │
│  • Risk: Low (non-destructive)           │
│                                          │
│ This will create a feature flag in       │
│ PostHog and start tracking immediately.  │
│                                          │
│        [Cancel]    [✅ Create]            │
└──────────────────────────────────────────┘
```

---

### Landing Page (Demo App)

**Components:**

```
/landing
├── Hero
│   ├── Headline
│   ├── Subheadline
│   └── CTAButton (variant-aware)
│       ├── useFeatureFlag('experiment-key')
│       ├── Dynamic color based on variant
│       └── onClick tracking
│
├── Features (static content)
├── Testimonials (static content)
└── Footer (static content)
```

**Key Requirements:**
- PostHog SDK initialized
- Feature flag evaluation
- Event tracking on CTA click
- Device detection
- Clean, professional design (use template)

---

## 8. Setup Requirements

### Accounts & API Keys

| Service | Purpose | Keys Needed | Cost |
|---------|---------|-------------|------|
| **PostHog** | Analytics + Experiments | Project API Key, Personal API Key | Free tier (1M events/month) |
| **Linear** | Ticket management | API Key | Free tier |
| **GitHub** | Code repository | Personal Access Token | Free |
| **Vercel** | Hosting + deployment | API Token (auto) | Free tier |
| **OpenAI** | AI model | API Key | ~$5-10 for demo |
| **Anthropic** | AI model (primary) | API Key | ~$10-20 for demo |
| **Brave Search** | Web research | API Key | Free tier (2k/month) |

### Environment Variables

```bash
# AI Models
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
POSTHOG_PERSONAL_API_KEY=phx_...
NEXT_PUBLIC_POSTHOG_PROJECT_ID=12345

# Linear
LINEAR_API_KEY=lin_api_...
LINEAR_TEAM_ID=...
LINEAR_PROJECT_ID=...

# GitHub
GITHUB_TOKEN=ghp_...
GITHUB_REPO=username/landing-page

# Brave Search
BRAVE_SEARCH_API_KEY=BSA...

# App Config
NEXT_PUBLIC_APP_URL=https://varyant.vercel.app
```

---

### Repository Structure

```
varyant/
├── apps/
│   ├── web/                    # Analytics platform
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── chat/route.ts
│   │   │   │   └── posthog/
│   │   │   │       └── [...endpoints]/route.ts
│   │   │   ├── dashboard/page.tsx
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   ├── dashboard/
│   │   │   └── ui/ (shadcn)
│   │   ├── lib/
│   │   │   ├── ai/
│   │   │   │   ├── tools.ts
│   │   │   │   └── prompts.ts
│   │   │   ├── posthog/
│   │   │   │   └── queries.ts
│   │   │   └── integrations/
│   │   │       ├── linear.ts
│   │   │       └── github.ts
│   │   └── package.json
│   │
│   └── landing/                # Demo landing page
│       ├── app/
│       │   ├── page.tsx
│       │   └── layout.tsx
│       ├── components/
│       │   └── Hero.tsx
│       ├── lib/
│       │   └── posthog.ts
│       └── package.json
│
├── packages/
│   └── config/
│       ├── eslint/
│       ├── typescript/
│       └── tailwind/
│
├── scripts/
│   └── seed-posthog.ts        # Data seeding script
│
├── .github/
│   └── workflows/
│       └── create-experiment-pr.yml
│
├── package.json                # Root
├── turbo.json
└── README.md
```

---

## 9. Implementation Phases

### Phase 1: Setup & Infrastructure (Week 1)

**Day 1-2: Project Setup**
- [ ] Create Turborepo monorepo
- [ ] Set up Next.js apps (web + landing)
- [ ] Install dependencies (AI SDK, shadcn, etc.)
- [ ] Configure Tailwind + TypeScript
- [ ] Set up ESLint + Prettier

**Day 3-4: External Services**
- [ ] Create PostHog project
- [ ] Set up Linear workspace
- [ ] Create GitHub repositories
- [ ] Get all API keys
- [ ] Configure environment variables

**Day 5-7: Data Seeding**
- [ ] Write PostHog seeding script
- [ ] Generate 50k events (realistic distribution)
- [ ] Create past experiment data
- [ ] Verify data in PostHog dashboard
- [ ] Test PostHog API queries

---

### Phase 2: Analytics Dashboard (Week 2)

**Day 1-2: Dashboard Layout**
- [ ] Build dashboard page structure
- [ ] Create metrics overview cards
- [ ] Implement responsive layout
- [ ] Add dark mode

**Day 3-4: Data Visualization**
- [ ] Build funnel chart (Recharts)
- [ ] Create events table (TanStack Table)
- [ ] Add trend charts
- [ ] Implement filtering/sorting

**Day 5-6: PostHog Integration**
- [ ] Create PostHog query helpers
- [ ] Build API routes for data fetching
- [ ] Integrate TanStack Query
- [ ] Add loading states

**Day 7: Polish**
- [ ] Error boundaries
- [ ] Empty states
- [ ] Responsive testing
- [ ] Performance optimization

---

### Phase 3: AI Agent (Week 3)

**Day 1-2: Basic Chat**
- [ ] Set up AI SDK chat endpoint
- [ ] Create chat UI components
- [ ] Implement streaming responses
- [ ] Add message history

**Day 3-4: PostHog Tools**
- [ ] Implement queryPostHog tool
- [ ] Implement queryPostHogFunnel tool
- [ ] Implement listPostHogExperiments tool
- [ ] Implement getPostHogExperimentResults tool
- [ ] Test tool calling

**Day 5: Research Tools**
- [ ] Integrate web search (Brave API)
- [ ] Implement webFetch tool
- [ ] Test research queries

**Day 6-7: Experiment Tools**
- [ ] Implement createPostHogExperiment tool
- [ ] Add approval modal UI
- [ ] Test experiment creation flow
- [ ] Verify feature flags in PostHog

---

### Phase 4: Integrations (Week 4)

**Day 1-2: Linear Integration**
- [ ] Set up Linear GraphQL client
- [ ] Implement createLinearIssue tool
- [ ] Build approval modal
- [ ] Test ticket creation

**Day 3-4: GitHub Integration**
- [ ] Implement checkGitHubFile tool
- [ ] Implement triggerGitHubAction tool
- [ ] Create GitHub Action workflow
- [ ] Test PR creation flow

**Day 5: Code Generation**
- [ ] Build generateExperimentCode tool
- [ ] Create code diff modal
- [ ] Add syntax highlighting
- [ ] Test code generation

**Day 6-7: End-to-End Testing**
- [ ] Test full workflow
- [ ] Fix bugs
- [ ] Refine prompts
- [ ] Performance testing

---

### Phase 5: Landing Page (Week 5)

**Day 1-2: Template Integration**
- [ ] Download/purchase landing page template
- [ ] Integrate with Next.js
- [ ] Add PostHog SDK
- [ ] Implement tracking

**Day 3-4: Experiment Support**
- [ ] Build useFeatureFlag hook
- [ ] Implement variant logic in Hero
- [ ] Add device detection
- [ ] Test variant assignment

**Day 5-6: Polish**
- [ ] Mobile optimization
- [ ] Performance optimization
- [ ] SEO (if needed)
- [ ] Preview testing

**Day 7: Deploy**
- [ ] Deploy to Vercel
- [ ] Test production environment
- [ ] Verify PostHog tracking
- [ ] Test feature flags

---

### Phase 6: Demo Prep (Week 6)

**Day 1-2: Agent Tuning**
- [ ] Refine system prompts
- [ ] Test edge cases
- [ ] Improve tool reliability
- [ ] Add error handling

**Day 3-4: UI Polish**
- [ ] Fix any UI bugs
- [ ] Improve animations
- [ ] Optimize loading states
- [ ] Mobile testing

**Day 5-6: Demo Script**
- [ ] Write detailed demo script
- [ ] Practice demo flow
- [ ] Time each section
- [ ] Prepare backups (screenshots, videos)

**Day 7: Final Testing**
- [ ] Full walkthrough
- [ ] Test all approval flows
- [ ] Verify all integrations
- [ ] Backup database state

---

## 10. Demo Script

### Pre-Demo Checklist

**Technical:**
- [ ] PostHog has seeded data
- [ ] Past experiment exists and shows results
- [ ] All API keys are valid
- [ ] Landing page is deployed
- [ ] Chat interface is responsive
- [ ] GitHub Action workflow is tested
- [ ] Linear workspace is set up

**Backup Plan:**
- [ ] Screenshots of each step
- [ ] Screen recording of full flow
- [ ] Fallback to screenshots if APIs fail

**Presentation:**
- [ ] Slides for intro (5 slides max)
- [ ] Browser tabs pre-arranged
- [ ] PostHog dashboard bookmarked
- [ ] Linear workspace bookmarked
- [ ] GitHub repo bookmarked

---

### Slide Deck (5 slides)

**Slide 1: Title**
```
Varyant
AI-Powered Experimentation Platform

Building AI into Products
with AI SDK

Diogo Cardoso - SwordHealth
December 2024
```

**Slide 2: The Problem**
```
Manual Experimentation is Slow

❌ Data analysis takes hours
❌ Experiment setup is tedious
❌ Implementation requires coordination
❌ Results analysis is manual
❌ No research or context

💡 What if AI could do all of this?
```

**Slide 3: The Solution**
```
Varyant: AI Experiment Copilot

✅ Analyzes your data automatically
✅ Researches UX best practices
✅ Suggests experiments with reasoning
✅ Creates tickets in Linear
✅ Generates implementation code
✅ Opens PRs in GitHub

All through conversation.
```

**Slide 4: Tech Stack**
```
Built With:
• Next.js 15 + TypeScript
• Vercel AI SDK (Claude Sonnet 4)
• PostHog (Analytics)
• Linear (Project Management)
• GitHub Actions (Deployment)

AI SDK Features:
• Tool calling
• Streaming
• Agents (maxSteps)
• Approval flows
```

**Slide 5: Live Demo**
```
Let's build an experiment together.

[Switch to live demo]
```

---

### Demo Timing (Total: 40 mins)

| Section | Time | Content |
|---------|------|---------|
| Intro | 5 min | Slides + dashboard walkthrough |
| Analysis | 10 min | User asks question → Agent researches |
| Create Experiment | 5 min | PostHog experiment creation |
| Create Ticket | 3 min | Linear ticket creation |
| Generate Code | 5 min | Code generation + diff view |
| Create PR | 5 min | GitHub Action trigger + PR |
| Past Results | 5 min | Analyze completed experiment |
| Q&A | 2 min | Wrap up |

---

### Demo Script (Detailed)

[See Section 5: Demo Flow above for full conversational script]

**Key Talking Points During Demo:**

**After Agent Research:**
> "Notice how the agent didn't just query our data - it went to the web and researched actual UX studies. It's combining our analytics with industry knowledge."

**After Experiment Creation:**
> "This approval modal is crucial. The agent can't just create experiments without human oversight. This is using AI SDK's `needsApproval` feature on tools."

**After Showing Code:**
> "This is real TypeScript code, not pseudocode. It uses PostHog's feature flag SDK and includes proper device detection. The agent generated this from understanding our requirements."

**After PR Creation:**
> "The agent just orchestrated between three different services - PostHog, Linear, and GitHub - all through natural conversation. This is agentic AI in action."

**After Results Analysis:**
> "The statistical analysis here is real - confidence intervals, segment breakdowns, revenue projections. This is the kind of analysis that would take a data analyst hours to put together."

**Closing:**
> "What we just saw:
> - Agent used 10+ tool calls
> - Integrated with 3 external APIs
> - Generated production-ready code
> - Required 3 human approvals
> - All through natural conversation
>
> This is what adding AI to a product looks like with AI SDK."

---

## Appendix: Quick Reference

### Key URLs

```
PostHog:     https://app.posthog.com/project/{id}
Linear:      https://linear.app/sword
GitHub:      https://github.com/{user}/{repo}
Landing:     https://landing-{user}.vercel.app
Analytics:   https://varyant.vercel.app

PostHog API: https://app.posthog.com/api
Linear API:  https://api.linear.app/graphql
GitHub API:  https://api.github.com
```

### Common Issues

**PostHog API rate limits:**
- Personal API: 600 requests/minute
- Project API: Unlimited for most operations
- Solution: Add caching layer if needed

**Linear GraphQL errors:**
- Requires Bearer token in header
- Check workspace/team IDs match
- Use Linear's API playground for testing

**GitHub Action not triggering:**
- Check PAT has `repo` and `workflow` scopes
- Verify workflow file is on default branch
- Check Actions are enabled in repo settings

**Feature flag not working:**
- Ensure PostHog SDK initialized
- Check feature flag is active in PostHog
- Clear localStorage and test fresh

---

## Next Steps

1. **Review this plan** - Make sure all sections are clear
2. **Get boilerplate from you** - Next.js + Tailwind + shadcn setup
3. **Create external accounts** - PostHog, Linear, GitHub
4. **Start Phase 1** - Infrastructure setup
5. **Iterate on agent prompts** - Most important part

---

**Document Version:** 1.0
**Last Updated:** December 2024
**Project Name:** Varyant
**Demo Duration:** 45 minutes
**Target Date:** [Your talk date]