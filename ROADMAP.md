# Varyant Product Roadmap

> Living document tracking UX/feature improvements for the Varyant AI experimentation copilot.

## Overview

**Goal**: Transform Varyant from a functional demo into a polished, intuitive AI copilot experience.

**Core Principle**: Every tool interaction should feel native and contextual, not like raw API responses.

---

## Progress Tracker

### P0 - Critical (Do First)

- [x] **Tool-Specific Result Components** ✅ COMPLETED
  - [x] `PosthogInsightsResult` - Cards with metrics, mini visualizations
  - [x] `PosthogExperimentResult` - Experiment card with status, variants, link
  - [x] `PosthogFeatureFlagResult` - Flag card with key, variants, copy button
  - [x] `LinearIssueResult` - Issue card with status, priority, assignee
  - [x] `GithubWorkflowResult` - Workflow status card with run link
  - [x] `WebsiteScreenshotResult` - Image with expandable preview
  - [x] Tool registry pattern for component dispatch

- [x] **Tool-Specific Approval Cards** ✅ COMPLETED
  - [x] `PosthogFeatureFlagApproval` - Human-readable flag preview with variants
  - [x] `PosthogExperimentApproval` - Experiment summary with effort indicator
  - [x] `LinearIssueApproval` - Issue preview card with priority
  - [x] `LinearIssueUpdateApproval` - Status change preview
  - [x] `GithubWorkflowApproval` - Workflow action preview
  - [x] `WebsiteScreenshotApproval` - URL preview with formats

### P1 - High Priority

- [x] **Tool Definition Improvements** ✅ COMPLETED
  - [x] `createPostHogFeatureFlag` - Return full API response (id, variants, active status)
  - [x] `createPostHogExperiment` - Add `outputSchema`, use `linearTicketId` and `implementationEffort` inputs
  - [x] `crawlWebsite` - Return all requested formats, not just screenshot
  - [x] `triggerFeatureDevelopment` - Return repo info, workflow run URL

- [x] **Remove Hardcoded Values** ✅ COMPLETED
  - [x] PostHog URLs - Support EU (`eu.posthog.com`) and self-hosted instances via env
  - [x] Feature flag link - Link to specific flag (`/feature_flags/{id}`) not list
  - [x] Experiment status - Read actual status from output, not hardcoded "Draft"
  - [x] GitHub workflow - Use actual branch from input/output, link to workflow run
  - [x] Experiment metrics - Make metrics configurable (description includes metadata)

- [x] **Enhanced Empty State** ✅ COMPLETED
  - [x] Capabilities overview section (6 capabilities with icons)
  - [x] Suggested prompt buttons (5 clickable examples)
  - [x] Auto-send support via URL query params

- [x] **Better Loading States** ✅ COMPLETED
  - [x] Tool-specific loading messages
  - [x] Skeleton loaders matching output shape (6 tool-specific skeletons)
  - [x] Added to tool registry pattern

- [x] **Client Component Refactor** ✅ COMPLETED
  - [x] Extract `MessageRenderer` component
  - [x] Extract `ToolPartRenderer` component
  - [x] Reduced `client.tsx` from ~387 to ~246 lines (36% reduction)

### P2 - Medium Priority

- [x] **Dashboard Improvements** ✅ COMPLETED
  - [x] Active experiments section with status
  - [x] Recent activity feed (last 5 experiments)
  - [x] Quick action buttons (new experiment, new flag, view insights)
  - [ ] ~~Conversion funnel visualization~~ (skipped - not critical for demo)

- [ ] ~~**Conversation Persistence**~~ SKIPPED
  - Skipped - requires database management, not needed for demo

- [x] **Type Safety Improvements** ✅ COMPLETED
  - [x] Replace `any` types in PostHog integration (20+ types fixed)
  - [x] Shared types between tools and result components
  - [x] Proper output typing for all tools

### P3 - Nice to Have

- [x] **Quick Actions** ✅ COMPLETED
  - [x] Suggestion pills above input (contextual - changes based on conversation)
  - [x] Slash command support (`/experiment`, `/flag`, `/insights`, `/ticket`, `/screenshot`)
  - [x] Keyboard shortcuts (`Cmd+K` focus, `Cmd+Enter` submit, `Escape` clear)

- [x] **Polish** ✅ COMPLETED
  - [x] Mobile responsiveness audit (grids stack, touch-friendly)
  - [x] Dark mode refinements (all components)
  - [x] Animation/transition improvements (messages, tools, suggestions)
  - [x] Error state designs (tool errors, chat errors with retry)

---

## Technical Architecture

### Tool Result Registry

```
components/
└── tool-results/
    ├── index.ts                    # Registry & types
    ├── posthog-insights.tsx
    ├── posthog-experiment.tsx
    ├── posthog-feature-flag.tsx
    ├── linear-issue.tsx
    ├── github-workflow.tsx
    └── website-screenshot.tsx
```

### Registry Pattern

```typescript
// components/tool-results/index.ts
export const toolResultRegistry = {
  'tool-queryPosthogInsights': {
    ResultComponent: PosthogInsightsResult,
    ApprovalComponent: PosthogInsightsApproval,
    loadingText: "Querying your analytics...",
    icon: BarChart2,
  },
  // ... other tools
}
```

### Component Interface

```typescript
interface ToolResultProps<T = unknown> {
  input: T;
  output: unknown;
  state: ToolUIPart['state'];
  errorText?: string;
}

interface ToolApprovalProps<T = unknown> {
  input: T;
  onApprove: () => void;
  onReject: () => void;
}
```

---

## Design Guidelines

### Tool Result Cards

- **Consistent structure**: Icon + Title + Status badge + Content
- **Actionable**: Include relevant links (View in PostHog, Open in Linear)
- **Scannable**: Key info visible without expanding
- **Branded**: Match the source platform's visual language subtly

### Approval Cards

- **Clear intent**: What will happen if approved
- **Human readable**: No raw JSON, translate to plain English
- **Reversible info**: Show what can/cannot be undone
- **Prominent actions**: Clear Approve/Reject buttons

### Loading States

- **Contextual**: Tell user what's happening
- **Skeleton shape**: Match expected output structure
- **Non-blocking**: User can still scroll/read previous messages

---

## Files to Create/Modify

### New Files ✅ CREATED
- `components/tool-results/types.ts` - Shared types for all tool components
- `components/tool-results/index.tsx` - Registry and exports
- `components/tool-results/posthog-insights.tsx` - Result + Approval
- `components/tool-results/posthog-experiment.tsx` - Result + Approval
- `components/tool-results/posthog-feature-flag.tsx` - Result + Approval
- `components/tool-results/linear-issue.tsx` - Result + Update Result + Approvals
- `components/tool-results/github-workflow.tsx` - Result + Approval
- `components/tool-results/website-screenshot.tsx` - Result + Approval

### Modified ✅ UPDATED
- `app/copilot/client.tsx` - Now uses registry pattern with custom components

---

## Notes & Decisions

### 2025-12-26 - P3 Complete - Full Polish
- **Slash Commands**: 5 commands with filtering, keyboard nav, and dropdown UI
- **Keyboard Shortcuts**: `Cmd+K` focus, `Cmd+Enter` submit, `Escape` clear
- **Mobile**: Responsive grids, touch-friendly targets
- **Dark Mode**: All components now have proper dark variants
- **Animations**: Messages fade/slide in, suggestions have hover effects
- **Error States**: Tool errors and chat errors with retry buttons

### 2025-12-26 - P1/P2 Complete - Major UX Overhaul
- **Enhanced Empty State**: New `CopilotEmptyState` component with 6 capabilities overview and 5 clickable prompt suggestions
- **Skeleton Loaders**: Created 6 tool-specific skeleton components that match actual output shapes
- **Client Refactor**: Extracted `MessageRenderer` and `ToolPartRenderer` - reduced client.tsx by 36%
- **Dashboard**: Added active experiments, recent activity, quick action buttons linking to copilot
- **Query Params**: Copilot now accepts `?prompt=` and auto-sends on load
- **Type Safety**: Fixed 20+ `any` types in PostHog integration with proper interfaces

### 2025-12-26 - P1 Tool Improvements Complete
- **PostHog Integration**: `createFeatureFlag` now returns full response (id, key, name, active, filters with variants)
- **PostHog Integration**: `createExperiment` now uses linearTicketId and implementationEffort in description, returns full response
- **GitHub Integration**: Now returns repo, ref, and workflowUrl for actionable links
- **Firecrawl Tool**: Returns all requested formats (markdown, html, links, metadata) not just screenshot
- **UI Components**: All PostHog URLs now use `NEXT_PUBLIC_POSTHOG_HOST` env variable
- **UI Components**: Feature flag links to specific flag, not list
- **UI Components**: Experiment status is dynamic (Draft/Running/Completed based on dates)
- **UI Components**: Linear ticket ID is now clickable
- **UI Components**: GitHub workflow uses dynamic branch and workflow URL

### 2025-12-26 - P0 Implementation Complete
- Implemented all 7 tool result components with polished UI
- Created approval components for each tool with human-readable previews
- Built registry pattern in `components/tool-results/index.tsx`
- Refactored `client.tsx` to use registry - cleaner, more maintainable
- Each tool now has: icon, color, loading text, result component, approval component
- Build passes, ready for testing

### 2024-12-26 - Initial Planning
- Prioritized tool-specific components as P0 (highest impact on UX)
- Decided on registry pattern for extensibility
- Conversation persistence moved to P2 (good to have but not critical for demo)

---

## Completion Summary

**All planned items completed!** 🎉

| Priority | Completed | Skipped |
|----------|-----------|---------|
| P0 | 2/2 | 0 |
| P1 | 5/5 | 0 |
| P2 | 2/3 | 1 (Conversation Persistence - by choice) |
| P3 | 2/2 | 0 |

**Total: 11 features implemented in one session.**
