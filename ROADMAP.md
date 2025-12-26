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

- [ ] **Enhanced Empty State**
  - [ ] Capabilities overview section
  - [ ] Suggested prompt buttons (4-6 examples)
  - [ ] Quick-start guide

- [ ] **Better Loading States**
  - [ ] Tool-specific loading messages
  - [ ] Skeleton loaders matching output shape
  - [ ] Progress indicators for multi-step operations

- [ ] **Client Component Refactor**
  - [ ] Extract `MessageRenderer` component
  - [ ] Extract `ToolRenderer` with registry dispatch
  - [ ] Extract `ApprovalRenderer` component
  - [ ] Reduce `client.tsx` complexity

### P2 - Medium Priority

- [ ] **Dashboard Improvements**
  - [ ] Active experiments section with status
  - [ ] Recent copilot actions feed
  - [ ] Quick action buttons (new experiment, new flag)
  - [ ] Conversion funnel visualization

- [ ] **Conversation Persistence**
  - [ ] Store conversations in Supabase
  - [ ] Conversation list in sidebar
  - [ ] Resume past conversations
  - [ ] Delete/archive conversations

- [ ] **Type Safety Improvements**
  - [ ] Replace `any` types in PostHog integration
  - [ ] Shared types between tools and result components
  - [ ] Proper output typing for all tools

### P3 - Nice to Have

- [ ] **Quick Actions**
  - [ ] Slash command support (`/experiment`, `/flag`)
  - [ ] Quick action toolbar in input
  - [ ] Keyboard shortcuts

- [ ] **Polish**
  - [ ] Mobile responsiveness audit
  - [ ] Dark mode refinements
  - [ ] Animation/transition improvements
  - [ ] Error state designs

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

### Still To Do
- `components/ai-elements/conversation.tsx` - Enhanced empty state
- `lib/integrations/posthog.ts` - Better types (replace `any`)

---

## Notes & Decisions

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

## Questions to Resolve

1. ~~Should approvals be inline or modal?~~ → TBD
2. Dashboard AI integration scope → TBD
3. Target: polished demo or real product? → TBD
