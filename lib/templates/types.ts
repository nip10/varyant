/**
 * Template Types for Experiment Templates
 *
 * These types define the structure for pre-built A/B test configurations
 * that users can quickly deploy through the Varyant copilot.
 */

/**
 * Template categories for organizing experiment templates
 */
export type TemplateCategory = 'conversion' | 'engagement' | 'pricing' | 'retention';

/**
 * A real-world example of a company that ran a similar experiment
 */
export interface TemplateExample {
  /** Company name */
  company: string;
  /** Result description (e.g., "+21% CTR with red vs green CTA") */
  result: string;
  /** Source URL if available */
  source?: string;
  /** Year the study was conducted */
  year?: number;
}

/**
 * Variant configuration for the template
 */
export interface TemplateVariant {
  /** Display name for this variant */
  name: string;
  /** Description of what this variant tests */
  description: string;
}

/**
 * Complete experiment template structure
 */
export interface ExperimentTemplate {
  /** Unique identifier for the template (e.g., "cta-color") */
  id: string;
  /** Human-readable template name */
  name: string;
  /** Category for filtering and organization */
  category: TemplateCategory;
  /** Brief description of what this template tests */
  description: string;
  /** The hypothesis being tested */
  hypothesis: string;
  /** Primary metric to track */
  primaryMetric: string;
  /** Additional metrics to monitor */
  secondaryMetrics: string[];
  /** Control and test variant configurations */
  variants: {
    control: TemplateVariant;
    test: TemplateVariant;
  };
  /** Optional target audience description */
  targetAudience?: string;
  /** Recommended experiment duration (e.g., "2-4 weeks") */
  duration: string;
  /** Minimum sample size needed for statistical significance */
  minimumSampleSize: number;
  /** Tags for search and filtering */
  tags: string[];
  /** Real-world examples from companies that ran similar tests */
  examples?: TemplateExample[];
  /** Implementation difficulty level */
  difficulty?: 'easy' | 'medium' | 'hard';
  /** Suggested pages or areas to test */
  suggestedPages?: string[];
}

/**
 * Customizations that can be applied when using a template
 */
export interface TemplateCustomizations {
  /** Custom experiment name (overrides template name) */
  name?: string;
  /** Custom hypothesis (overrides template hypothesis) */
  hypothesis?: string;
  /** Target page/URL for the experiment */
  targetPage?: string;
  /** Custom variant names/descriptions */
  variants?: {
    control?: string;
    test?: string;
  };
  /** Custom primary metric */
  primaryMetric?: string;
  /** Custom secondary metrics */
  secondaryMetrics?: string[];
}

/**
 * Result of applying a template
 */
export interface TemplateApplicationResult {
  /** Whether the template was successfully applied */
  success: boolean;
  /** The template that was used */
  template: ExperimentTemplate;
  /** Customizations that were applied */
  customizations?: TemplateCustomizations;
  /** The generated feature flag key */
  featureFlagKey: string;
  /** ID of the created experiment (if created) */
  experimentId?: number;
  /** Any error message if application failed */
  error?: string;
}

/**
 * Category metadata for UI display
 */
export interface CategoryInfo {
  /** Category identifier */
  id: TemplateCategory;
  /** Display name */
  name: string;
  /** Description of this category */
  description: string;
  /** Color class for theming */
  colorClass: string;
  /** Background color class */
  bgClass: string;
}

/**
 * Category information for UI display
 */
export const CATEGORY_INFO: Record<TemplateCategory, CategoryInfo> = {
  conversion: {
    id: 'conversion',
    name: 'Conversion',
    description: 'CTAs, forms, landing pages, checkout',
    colorClass: 'text-green-600 dark:text-green-400',
    bgClass: 'bg-green-50 dark:bg-green-950/30',
  },
  engagement: {
    id: 'engagement',
    name: 'Engagement',
    description: 'Onboarding, notifications, features',
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-50 dark:bg-blue-950/30',
  },
  pricing: {
    id: 'pricing',
    name: 'Pricing',
    description: 'Tiers, discounts, anchoring, trials',
    colorClass: 'text-purple-600 dark:text-purple-400',
    bgClass: 'bg-purple-50 dark:bg-purple-950/30',
  },
  retention: {
    id: 'retention',
    name: 'Retention',
    description: 'Emails, win-back, loyalty',
    colorClass: 'text-orange-600 dark:text-orange-400',
    bgClass: 'bg-orange-50 dark:bg-orange-950/30',
  },
};
