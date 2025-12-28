# Varyant Feature Ideas

> Brainstorming document for next-level demo features

## Overview

These features aim to make the Varyant demo stand out with innovative, "wow factor" capabilities that showcase the power of AI-driven experimentation.

## Available Tools & Resources

| Tool | Capabilities | Docs |
|------|--------------|------|
| **AI SDK** | Streaming, attachments, multi-modal, useChat, useCompletion | ai-sdk.dev |
| **AI Elements** | Pre-built UI components for AI apps | ai-sdk.dev/elements |
| **PostHog MCP** | Experiments, feature flags, insights, queries | Built-in |
| **Firecrawl** | Website screenshots, scraping, markdown extraction | Built-in |
| **Linear** | Issue creation, updates | Built-in |
| **GitHub** | Workflow triggers | Built-in |

---

## Feature Ideas

### Tier 1: High Wow Factor

| # | Feature | Description | Spec |
|---|---------|-------------|------|
| 1 | **Voice Input** | Talk to copilot using Web Speech API | [spec](./features/01-voice-input.md) |
| 2 | **Screenshot → Experiment** | Paste/upload screenshot, AI suggests A/B tests | [spec](./features/02-screenshot-experiment.md) |
| 3 | **Competitor Intelligence** | Analyze competitor sites, suggest experiments | [spec](./features/03-competitor-intelligence.md) |
| 4 | **Live Experiment Dashboard** | Real-time streaming experiment results | [spec](./features/04-live-dashboard.md) |

### Tier 2: Medium Effort, High Impact

| # | Feature | Description | Spec |
|---|---------|-------------|------|
| 5 | **Natural Language Analytics** | Ask questions, get charts/answers | [spec](./features/05-nl-analytics.md) |
| 6 | **AI Experiment Analyst** | AI interprets results, suggests next steps | [spec](./features/06-ai-analyst.md) |
| 7 | **Multi-modal Input** | Drag & drop images into chat | [spec](./features/07-multi-modal.md) |
| 8 | **Experiment Templates** | Pre-built experiment configurations | [spec](./features/08-templates.md) |

### Tier 3: Polish & Delight

| # | Feature | Description | Spec |
|---|---------|-------------|------|
| 9 | **Celebration Animations** | Confetti on experiment wins | [spec](./features/09-polish.md) |
| 10 | **Shareable Cards** | Export experiment results as images | [spec](./features/09-polish.md) |
| 11 | **Command Palette** | Cmd+P spotlight for power users | [spec](./features/09-polish.md) |

---

## Priority Matrix

| Priority | Features | Effort | Rationale |
|----------|----------|--------|-----------|
| **P0** | Multi-modal Input (#7) | Medium | Foundation for Screenshot → Experiment; enables image paste/drop |
| **P0** | Voice Input (#1) | Low | High wow factor, uses browser APIs, no dependencies |
| **P0** | Confetti Celebrations (#9) | Low | Instant delight, 3KB library, triggers on experiment wins |
| **P1** | Screenshot → Experiment (#2) | Medium | Killer feature for demos; depends on Multi-modal |
| **P1** | Natural Language Analytics (#5) | Medium | "Ask anything" is compelling; HogQL translation is key |
| **P1** | Experiment Templates (#8) | Low | Mostly data + one UI component; instant value |
| **P2** | Command Palette (#11) | Medium | Power user feature; nice polish but not essential |
| **P2** | AI Experiment Analyst (#6) | Medium | Valuable but requires statistical logic + complex prompts |
| **P2** | Competitor Intelligence (#3) | Medium | Builds on existing crawl tool; great for sales demos |
| **P2** | Shareable Cards (#10) | Medium | Utility feature; good for social proof |
| **P3** | Live Dashboard (#4) | High | Complex real-time UI; needs polling + state management |

---

## Implementation Order

Based on dependencies and effort/impact ratio:

### Sprint 1: Foundation (P0) ✅ COMPLETED
1. **Multi-modal Input** ✅ - Drop/paste images into chat
   - `useAttachments` hook with compression
   - `DropZone` wrapper component
   - `AttachmentPreviewInline` component
   - Paste handler in textarea
   - File upload button

2. **Voice Input** ✅ - Web Speech API integration
   - `useVoiceInput` hook with silence detection
   - Voice button with visual feedback (pulsing, wave animation)
   - Auto-submit after speech
   - Keyboard shortcut (Cmd+Shift+V)

3. **Confetti Celebrations** ✅ - Quick win, high delight
   - `useConfetti` hook with celebrate/celebrateSmall/celebrateFromElement
   - Triggers on experiment creation success

### Sprint 2: Core Features (P1) ✅ COMPLETED
4. **Screenshot → Experiment** ✅ - Paste UI, get A/B test ideas
   - Uses Sprint 1 multi-modal input
   - AI analyzes images and suggests A/B tests
   - Integrated with experiment creation tools

5. **Natural Language Analytics** ✅ - "How many signups last week?"
   - `queryPosthogAnalytics` tool with HogQL execution
   - `AnalyticsChart` component (line, bar, pie, number, table)
   - `PosthogQueryResult` component with SQL toggle
   - Smart chart type inference from data

6. **Experiment Templates** ✅ - Pre-built test configurations
   - `lib/templates/` with 12 battle-tested templates
   - `TemplateBrowser` and `TemplateDetail` components
   - 4 AI tools: list, get, apply, suggest templates
   - `/template` slash command integration

### Sprint 3: Power Features (P2) ✅ COMPLETED
7. **Command Palette** ✅ - Cmd+K quick access
   - Global keyboard shortcut (Cmd+K)
   - Navigation commands (Home, Copilot, Dashboard)
   - Quick actions (Create Experiment, Flag, Ticket)
   - Analytics shortcuts
   - Popular templates quick access

8. **AI Experiment Analyst** ✅ - Interpret results, recommend actions
   - `analyzeExperiment` tool with statistical analysis
   - `listExperimentsForAnalysis` tool
   - `ExperimentAnalysisResult` component
   - Recommendations: SHIP, ITERATE, END, WAIT, INVESTIGATE
   - Traffic split analysis and SRM detection

9. **Competitor Intelligence** ✅ - Analyze competitor sites
   - `analyzeCompetitor` tool with focus areas
   - Side-by-side comparison mode
   - `CompetitorAnalysisResult` component with tabs
   - Screenshot + insights + experiment suggestions

### Sprint 4: Polish (P2-P3) ✅ COMPLETED
10. **Shareable Cards** ✅ - Export results as images
11. **Live Dashboard** ✅ - Real-time experiment streaming

---

## Dependency Graph

```
Multi-modal Input (#7)
    └── Screenshot → Experiment (#2)
    └── Competitor Intelligence (#3) [also uses Firecrawl]

Voice Input (#1) ─── standalone

Natural Language Analytics (#5)
    └── AI Experiment Analyst (#6) [uses similar patterns]

Experiment Templates (#8) ─── standalone

Confetti (#9) ─── standalone (triggers from Analyst)

Live Dashboard (#4) ─── standalone (complex)

Command Palette (#11) ─── standalone (references all features)

Shareable Cards (#10) ─── standalone
```

---

## Effort Estimates

| Feature | Effort | Components | Dependencies |
|---------|--------|------------|--------------|
| Voice Input | ~2h | 1 hook, 1 button | Web Speech API |
| Multi-modal | ~4h | 2 hooks, 3 components | AI SDK parts |
| Screenshot → Exp | ~3h | 1 tool, prompt tuning | Multi-modal |
| Competitor Intel | ~3h | 1 tool, 1 component | Firecrawl |
| Live Dashboard | ~6h | 3 components, polling | React Query |
| NL Analytics | ~4h | 1 tool, chart components | Recharts |
| AI Analyst | ~4h | 1 tool, prompts, stats | PostHog MCP |
| Templates | ~3h | Data + 1 browser component | — |
| Confetti | ~1h | 1 hook | canvas-confetti |
| Shareable Cards | ~3h | 1 component | html2canvas |
| Command Palette | ~2h | 1 component | cmdk |

**Total: ~35 hours**

---

## Demo Script Ideas

### "The Full Experience" (5 min)
1. Open copilot, use voice: "Show me signup trends"
2. Chart appears with NL Analytics
3. Paste screenshot: "Suggest tests for this"
4. AI suggests 3 experiments
5. Select one, create experiment → confetti!
6. Show live dashboard with results

### "Competitor Analysis" (3 min)
1. "Analyze notion.so and suggest experiments"
2. Screenshot + analysis appears
3. Pick a test, create experiment
4. Create Linear ticket for implementation

### "Quick Win Templates" (2 min)
1. Open command palette (Cmd+P)
2. Select "CTA Color Test" template
3. Customize for pricing page
4. Experiment created in PostHog

---

## Notes

- Check AI SDK docs for built-in support (attachments, streaming, etc.)
- Leverage existing integrations (PostHog MCP, Firecrawl)
- Focus on demo impact over production readiness
- All effort estimates assume existing codebase patterns
- Consider feature flags for gradual rollout

---

## Completion Log

### 2025-12-26 - Sprint 1 Complete

**Multi-modal Input:**
- Created `lib/hooks/use-attachments.ts` - File management with compression
- Created `components/ai-elements/drop-zone.tsx` - Drag & drop wrapper
- Created `components/ai-elements/attachment-preview.tsx` - Thumbnail previews
- Integrated paste handler in `PromptInputTextarea`
- Added image upload button to copilot input

**Voice Input:**
- Created `lib/hooks/use-voice-input.ts` - Web Speech API with silence detection
- Created `components/ai-elements/voice-input-button.tsx` - Visual feedback button
- Integrated into copilot with auto-submit and keyboard shortcut

**Confetti Celebrations:**
- Created `lib/hooks/use-confetti.ts` - Multiple celebration styles
- Integrated into `PosthogExperimentResult` - Triggers on creation success

**Files Created:**
- `lib/hooks/use-attachments.ts`
- `lib/hooks/use-confetti.ts`
- `lib/hooks/use-voice-input.ts`
- `components/ai-elements/drop-zone.tsx`
- `components/ai-elements/attachment-preview.tsx`
- `components/ai-elements/voice-input-button.tsx`

**Next:** Sprint 2 - Screenshot → Experiment, NL Analytics, Templates

### 2025-12-26 - Sprint 2 Complete

**Screenshot → Experiment:**
- Leverages Sprint 1 multi-modal input
- AI vision analyzes pasted images
- Suggests A/B tests based on UI analysis
- Integrates with experiment creation workflow

**Natural Language Analytics:**
- Created `lib/ai/tools/posthog.ts` - `queryPosthogAnalytics` tool
- Created `components/tool-results/analytics-chart.tsx` - Recharts visualizations
- Created `components/tool-results/posthog-query-result.tsx` - Result UI with SQL toggle
- Added to tool registry with skeleton loader

**Experiment Templates:**
- Created `lib/templates/types.ts` - Template type definitions
- Created `lib/templates/library.ts` - 12 battle-tested templates
- Created `components/copilot/template-browser.tsx` - Search & filter UI
- Created `lib/ai/tools/templates.ts` - 4 AI tools
- Added `/template` slash command

**Files Created:**
- `lib/templates/types.ts`
- `lib/templates/library.ts`
- `lib/templates/index.ts`
- `lib/ai/tools/templates.ts`
- `components/tool-results/analytics-chart.tsx`
- `components/tool-results/posthog-query-result.tsx`
- `components/copilot/template-browser.tsx`
- `components/copilot/index.ts`
- `components/ai-elements/slash-commands.tsx`

**Next:** Sprint 3 - Command Palette, AI Experiment Analyst, Competitor Intelligence

### 2025-12-26 - Sprint 3 Complete

**Command Palette:**
- Created `components/command-palette.tsx` - Global Cmd+K access
- Navigation: Home, Copilot, Dashboard
- Quick actions: Create Experiment, Feature Flag, Linear Ticket
- Analytics: View Insights, Query Analytics, Analyze Experiments
- Research: Capture Screenshot, Analyze Competitor
- Popular templates quick access
- Integrated in root layout

**AI Experiment Analyst:**
- Added `getExperiment` and `getExperimentResults` to PostHog integration
- Created `lib/ai/tools/analyze.ts` with `analyzeExperiment` and `listExperimentsForAnalysis`
- Created `components/tool-results/experiment-analysis.tsx`
- Statistical analysis: conversion rates, uplift, significance
- Recommendations: SHIP, ITERATE, END, WAIT, INVESTIGATE
- Traffic split analysis and SRM detection

**Competitor Intelligence:**
- Added `analyzeCompetitor` tool to firecrawl tools
- Created `components/tool-results/competitor-analysis.tsx`
- Side-by-side screenshot comparison
- Tabbed UI: Screenshots, Insights, Test Ideas
- Focus areas: pricing, CTA, hero, social-proof, navigation, forms, messaging

**Files Created:**
- `components/command-palette.tsx`
- `lib/ai/tools/analyze.ts`
- `components/tool-results/experiment-analysis.tsx`
- `components/tool-results/competitor-analysis.tsx`
- `components/ui/tabs.tsx` (via shadcn)

**Next:** Sprint 4 - Shareable Cards, Live Dashboard

### 2025-12-26 - Sprint 4 Complete

**Shareable Cards:**
- Created `components/shareable-card.tsx` - Export results as images
- Uses html2canvas for PNG export and clipboard copy
- Multiple card types: experiment-win, insight, milestone, comparison
- Gradient backgrounds and styled layouts
- Helper functions for creating card data from experiments/insights

**Live Dashboard:**
- Installed `@tanstack/react-query` for data polling
- Created `lib/providers/query-provider.tsx` - QueryClient provider
- Created `lib/hooks/use-live-experiment.ts` - Polling hook with 10s interval
- Created `app/api/experiments/[id]/results/route.ts` - API endpoint for results
- Created `components/tool-results/live-experiment-dashboard.tsx`
- Variant comparison cards with conversion rates
- Significance progress bar with 95% threshold marker
- Metrics: total participants, improvement, days running
- AI commentary based on experiment state
- Pause/resume auto-refresh controls
- Added `showLiveExperiment` tool to analyze.ts

**Files Created:**
- `components/shareable-card.tsx`
- `lib/providers/query-provider.tsx`
- `lib/hooks/use-live-experiment.ts`
- `app/api/experiments/[id]/results/route.ts`
- `components/tool-results/live-experiment-dashboard.tsx`

**Files Modified:**
- `app/layout.tsx` - Added QueryProvider
- `lib/ai/tools/analyze.ts` - Added showLiveExperiment tool
- `components/tool-results/index.tsx` - Added LiveDashboard registry entry
- `components/tool-results/types.ts` - Added tool-showLiveExperiment type

---

## All Sprints Complete!

All planned features have been implemented:
- Sprint 1: Multi-modal Input, Voice Input, Confetti
- Sprint 2: Screenshot → Experiment, NL Analytics, Templates
- Sprint 3: Command Palette, AI Experiment Analyst, Competitor Intelligence
- Sprint 4: Shareable Cards, Live Dashboard
