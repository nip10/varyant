# Feature: Experiment Templates

> Pre-built experiment configurations for common testing patterns

## Overview

Provide a library of battle-tested A/B test templates that users can quickly deploy. Each template includes hypothesis, metrics, variants, and implementation guidance.

## User Story

As a growth marketer, I want to quickly set up proven experiment types so that I don't have to reinvent the wheel for common tests.

## Technical Approach

### Template Data Structure

```typescript
// lib/templates/types.ts
interface ExperimentTemplate {
  id: string;
  name: string;
  category: 'conversion' | 'engagement' | 'retention' | 'pricing';
  description: string;
  hypothesis: string;
  primaryMetric: string;
  secondaryMetrics: string[];
  variants: {
    control: {
      name: string;
      description: string;
    };
    test: {
      name: string;
      description: string;
    };
  };
  targetAudience?: string;
  duration: string; // e.g., "2-4 weeks"
  minimumSampleSize: number;
  tags: string[];
  examples?: {
    company: string;
    result: string;
  }[];
}
```

### Template Library

```typescript
// lib/templates/library.ts
export const experimentTemplates: ExperimentTemplate[] = [
  // Conversion Templates
  {
    id: 'cta-color',
    name: 'CTA Button Color',
    category: 'conversion',
    description: 'Test different button colors to optimize click-through rates',
    hypothesis: 'A higher-contrast CTA button color will increase click rates by drawing more attention',
    primaryMetric: 'Click-through rate (CTR)',
    secondaryMetrics: ['Conversion rate', 'Time to click'],
    variants: {
      control: {
        name: 'Current Button',
        description: 'Existing button color and style',
      },
      test: {
        name: 'High Contrast Button',
        description: 'Button with contrasting color (e.g., orange/red on blue background)',
      },
    },
    duration: '1-2 weeks',
    minimumSampleSize: 1000,
    tags: ['quick-win', 'conversion', 'cta'],
    examples: [
      { company: 'HubSpot', result: '+21% CTR with red vs green CTA' },
      { company: 'Performable', result: '+21% conversion with red button' },
    ],
  },
  {
    id: 'headline-copy',
    name: 'Value Proposition Headline',
    category: 'conversion',
    description: 'Test different headline messaging to improve engagement',
    hypothesis: 'A benefit-focused headline will resonate more than a feature-focused one',
    primaryMetric: 'Bounce rate',
    secondaryMetrics: ['Time on page', 'Scroll depth', 'CTA clicks'],
    variants: {
      control: {
        name: 'Feature Headline',
        description: 'Describes what the product does',
      },
      test: {
        name: 'Benefit Headline',
        description: 'Describes the outcome for the user',
      },
    },
    duration: '2-3 weeks',
    minimumSampleSize: 2000,
    tags: ['copywriting', 'messaging', 'conversion'],
  },
  {
    id: 'social-proof',
    name: 'Social Proof Placement',
    category: 'conversion',
    description: 'Test adding or repositioning social proof elements',
    hypothesis: 'Prominent social proof near CTAs will increase trust and conversions',
    primaryMetric: 'Conversion rate',
    secondaryMetrics: ['CTA clicks', 'Form completion'],
    variants: {
      control: {
        name: 'No Social Proof',
        description: 'Page without testimonials/logos near CTA',
      },
      test: {
        name: 'Social Proof Above CTA',
        description: 'Customer logos and testimonial directly above CTA',
      },
    },
    duration: '2-4 weeks',
    minimumSampleSize: 1500,
    tags: ['trust', 'social-proof', 'conversion'],
    examples: [
      { company: 'Basecamp', result: '+102.5% signups with testimonials' },
    ],
  },
  {
    id: 'form-length',
    name: 'Form Field Reduction',
    category: 'conversion',
    description: 'Test removing form fields to reduce friction',
    hypothesis: 'Fewer form fields will increase completion rates',
    primaryMetric: 'Form completion rate',
    secondaryMetrics: ['Time to complete', 'Abandonment rate'],
    variants: {
      control: {
        name: 'Full Form',
        description: 'Current form with all fields',
      },
      test: {
        name: 'Reduced Form',
        description: 'Form with non-essential fields removed',
      },
    },
    duration: '2-3 weeks',
    minimumSampleSize: 500,
    tags: ['forms', 'friction', 'conversion'],
    examples: [
      { company: 'Expedia', result: '+$12M revenue by removing one field' },
    ],
  },

  // Engagement Templates
  {
    id: 'onboarding-steps',
    name: 'Onboarding Flow Length',
    category: 'engagement',
    description: 'Test different onboarding flow lengths',
    hypothesis: 'A shorter onboarding will improve completion while maintaining activation',
    primaryMetric: 'Onboarding completion rate',
    secondaryMetrics: ['Activation rate', '7-day retention'],
    variants: {
      control: {
        name: 'Full Onboarding (5 steps)',
        description: 'Current comprehensive onboarding flow',
      },
      test: {
        name: 'Quick Onboarding (2 steps)',
        description: 'Streamlined essentials-only onboarding',
      },
    },
    duration: '3-4 weeks',
    minimumSampleSize: 500,
    tags: ['onboarding', 'activation', 'engagement'],
  },
  {
    id: 'notification-timing',
    name: 'Push Notification Timing',
    category: 'engagement',
    description: 'Test optimal timing for engagement notifications',
    hypothesis: 'Personalized timing based on user activity will increase open rates',
    primaryMetric: 'Notification open rate',
    secondaryMetrics: ['Click-through rate', 'Session starts'],
    variants: {
      control: {
        name: 'Fixed Time',
        description: 'Notifications sent at standard time (e.g., 10am)',
      },
      test: {
        name: 'Personalized Time',
        description: 'Notifications based on user\'s most active time',
      },
    },
    duration: '2-3 weeks',
    minimumSampleSize: 1000,
    tags: ['notifications', 'engagement', 'personalization'],
  },

  // Pricing Templates
  {
    id: 'pricing-anchor',
    name: 'Price Anchoring',
    category: 'pricing',
    description: 'Test adding a high-tier option to anchor perception',
    hypothesis: 'A premium tier will make the mid-tier seem more valuable',
    primaryMetric: 'Average Revenue Per User (ARPU)',
    secondaryMetrics: ['Plan selection distribution', 'Conversion rate'],
    variants: {
      control: {
        name: 'Two Tiers',
        description: 'Basic and Pro pricing',
      },
      test: {
        name: 'Three Tiers',
        description: 'Basic, Pro, and Enterprise pricing',
      },
    },
    duration: '4-6 weeks',
    minimumSampleSize: 500,
    tags: ['pricing', 'monetization', 'psychology'],
    examples: [
      { company: 'The Economist', result: '+43% revenue with decoy pricing' },
    ],
  },
  {
    id: 'annual-discount',
    name: 'Annual Plan Discount',
    category: 'pricing',
    description: 'Test different annual plan discount levels',
    hypothesis: 'Increasing annual discount will boost annual plan adoption without hurting revenue',
    primaryMetric: 'Annual plan adoption rate',
    secondaryMetrics: ['Total revenue', 'Churn rate'],
    variants: {
      control: {
        name: '16% Discount (2 months free)',
        description: 'Current annual plan discount',
      },
      test: {
        name: '25% Discount (3 months free)',
        description: 'Increased annual plan discount',
      },
    },
    duration: '4-8 weeks',
    minimumSampleSize: 300,
    tags: ['pricing', 'subscription', 'retention'],
  },

  // Retention Templates
  {
    id: 'reactivation-email',
    name: 'Churn Prevention Email',
    category: 'retention',
    description: 'Test email copy and offers for inactive users',
    hypothesis: 'A personalized win-back offer will reactivate churned users',
    primaryMetric: 'Reactivation rate',
    secondaryMetrics: ['Email open rate', '30-day retention post-reactivation'],
    variants: {
      control: {
        name: 'Generic Reminder',
        description: '"We miss you" email without offer',
      },
      test: {
        name: 'Personalized + Discount',
        description: 'Shows unused features + 30% discount offer',
      },
    },
    targetAudience: 'Users inactive for 30+ days',
    duration: '3-4 weeks',
    minimumSampleSize: 500,
    tags: ['email', 'retention', 'win-back'],
  },
];
```

### Template Browser Component

```tsx
// components/copilot/template-browser.tsx
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { experimentTemplates, type ExperimentTemplate } from '@/lib/templates';
import {
  BeakerIcon, SearchIcon, ArrowRightIcon,
  TrendingUpIcon, UsersIcon, DollarSignIcon, RepeatIcon
} from 'lucide-react';

const categoryIcons = {
  conversion: TrendingUpIcon,
  engagement: UsersIcon,
  pricing: DollarSignIcon,
  retention: RepeatIcon,
};

const categoryColors = {
  conversion: 'text-green-500 bg-green-50 dark:bg-green-950/20',
  engagement: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20',
  pricing: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20',
  retention: 'text-orange-500 bg-orange-50 dark:bg-orange-950/20',
};

interface TemplateBrowserProps {
  onSelect: (template: ExperimentTemplate) => void;
}

export function TemplateBrowser({ onSelect }: TemplateBrowserProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const filtered = experimentTemplates.filter(t => {
    const matchesSearch = !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !category || t.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 flex-wrap">
        {['conversion', 'engagement', 'pricing', 'retention'].map((cat) => {
          const Icon = categoryIcons[cat];
          return (
            <Button
              key={cat}
              variant={category === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(category === cat ? null : cat)}
              className="gap-1.5"
            >
              <Icon className="size-3.5" />
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          );
        })}
      </div>

      {/* Template Grid */}
      <div className="grid gap-3">
        {filtered.map((template) => {
          const Icon = categoryIcons[template.category];
          return (
            <Card
              key={template.id}
              className="p-4 cursor-pointer hover:border-primary transition-colors group"
              onClick={() => onSelect(template)}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${categoryColors[template.category]}`}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{template.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {template.duration}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.description}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {template.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <ArrowRightIcon className="size-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
```

### Template Application Tool

```typescript
// lib/ai/tools/apply-template.ts
export const applyTemplateTool = createTool({
  name: "applyExperimentTemplate",
  description: "Create an experiment using a pre-built template",
  parameters: z.object({
    templateId: z.string().describe("Template ID from the library"),
    customizations: z.object({
      name: z.string().optional().describe("Custom experiment name"),
      hypothesis: z.string().optional().describe("Custom hypothesis"),
      targetPage: z.string().optional().describe("Page/URL to test on"),
      variants: z.object({
        control: z.string().optional(),
        test: z.string().optional(),
      }).optional(),
    }).optional(),
  }),
  execute: async ({ templateId, customizations }) => {
    const template = experimentTemplates.find(t => t.id === templateId);
    if (!template) throw new Error(`Template ${templateId} not found`);

    // Merge template with customizations
    const experimentConfig = {
      name: customizations?.name || template.name,
      description: template.description,
      hypothesis: customizations?.hypothesis || template.hypothesis,
      feature_flag_key: `experiment-${templateId}-${Date.now()}`,
      primary_metric: template.primaryMetric,
      secondary_metrics: template.secondaryMetrics,
      variants: [
        { key: 'control', name: customizations?.variants?.control || template.variants.control.name },
        { key: 'test', name: customizations?.variants?.test || template.variants.test.name },
      ],
      minimum_sample_size: template.minimumSampleSize,
    };

    // Create experiment via PostHog MCP
    const experiment = await posthog.createExperiment(experimentConfig);

    return {
      experiment,
      template,
      customizations,
    };
  },
});
```

## UX Flow

### Slash Command
1. User types `/template` or `/experiment template`
2. Template browser appears inline
3. User searches or filters by category
4. Clicks template to select
5. AI confirms and asks for customizations
6. Experiment created in PostHog

### Conversational
1. User: "I want to run a CTA color test"
2. AI: "I found a template for that. The CTA Button Color test has worked well for companies like HubSpot (+21% CTR). Want me to set it up?"
3. User: "Yes, for the pricing page"
4. AI: Creates experiment with customization

## Demo Script

1. **User**: "Show me experiment templates"
2. **Browser**: Grid of templates appears
3. **User**: Clicks "Social Proof Placement"
4. **AI**: "Great choice! This test typically runs 2-4 weeks and needs ~1,500 participants. Basecamp saw +102.5% signups with this pattern. Where do you want to test it?"
5. **User**: "On the signup page"
6. **AI**: Creates experiment, shows confirmation

## Implementation Checklist

- [ ] Create template data structure
- [ ] Build template library (10+ templates)
- [ ] Create `TemplateBrowser` component
- [ ] Add `/template` slash command
- [ ] Create `applyExperimentTemplate` tool
- [ ] Add customization flow
- [ ] Show success stories/examples
- [ ] Add template suggestions based on context

## Template Categories

- **Conversion**: CTAs, forms, landing pages, checkout
- **Engagement**: Onboarding, notifications, features
- **Pricing**: Tiers, discounts, anchoring, trials
- **Retention**: Emails, win-back, loyalty

## Dependencies

- PostHog MCP (existing)
- Template data (static JSON)

## Estimated Effort

**Low-Medium** - Mostly data entry + one UI component.

## Related Features

- AI Experiment Analyst (Feature #6)
- Competitor Intelligence (Feature #3)
