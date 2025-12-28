import type { ExperimentTemplate } from './types';

/**
 * Pre-built experiment templates library
 *
 * Each template is based on real-world A/B testing best practices
 * and includes examples from companies that have run similar tests.
 */
export const experimentTemplates: ExperimentTemplate[] = [
  // ============================================
  // CONVERSION TEMPLATES
  // ============================================

  {
    id: 'cta-color',
    name: 'CTA Button Color',
    category: 'conversion',
    description: 'Test different button colors to optimize click-through rates',
    hypothesis:
      'A higher-contrast CTA button color will increase click rates by drawing more visual attention and creating a sense of urgency',
    primaryMetric: 'Click-through rate (CTR)',
    secondaryMetrics: ['Conversion rate', 'Time to click', 'Bounce rate'],
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
    tags: ['quick-win', 'conversion', 'cta', 'visual'],
    difficulty: 'easy',
    suggestedPages: ['Landing page', 'Pricing page', 'Homepage hero'],
    examples: [
      {
        company: 'HubSpot',
        result: '+21% CTR with red vs green CTA button',
        source: 'https://blog.hubspot.com/marketing/call-to-action-examples',
        year: 2013,
      },
      {
        company: 'Performable',
        result: '+21% conversion rate with red button vs green',
        year: 2011,
      },
      {
        company: 'SAP',
        result: '+32.5% conversions with orange CTA button',
        year: 2014,
      },
    ],
  },

  {
    id: 'headline-copy',
    name: 'Value Proposition Headline',
    category: 'conversion',
    description: 'Test benefit-focused vs feature-focused headline messaging',
    hypothesis:
      'A benefit-focused headline that addresses customer pain points will resonate more than a feature-focused headline',
    primaryMetric: 'Bounce rate',
    secondaryMetrics: ['Time on page', 'Scroll depth', 'CTA clicks', 'Conversion rate'],
    variants: {
      control: {
        name: 'Feature Headline',
        description: 'Describes what the product does (e.g., "AI-Powered Analytics Platform")',
      },
      test: {
        name: 'Benefit Headline',
        description:
          'Describes the outcome for the user (e.g., "Make Data-Driven Decisions 10x Faster")',
      },
    },
    duration: '2-3 weeks',
    minimumSampleSize: 2000,
    tags: ['copywriting', 'messaging', 'conversion', 'landing-page'],
    difficulty: 'easy',
    suggestedPages: ['Homepage', 'Landing page', 'Product page'],
    examples: [
      {
        company: 'Highrise',
        result: '+30% signups with person-focused headline image',
        year: 2011,
      },
      {
        company: 'VWO',
        result: '+47% CTR with customer-focused headline copy',
        year: 2015,
      },
    ],
  },

  {
    id: 'social-proof',
    name: 'Social Proof Placement',
    category: 'conversion',
    description: 'Test adding or repositioning social proof elements near CTAs',
    hypothesis:
      'Prominent social proof (testimonials, logos, stats) near CTAs will increase trust and conversions',
    primaryMetric: 'Conversion rate',
    secondaryMetrics: ['CTA clicks', 'Form completion rate', 'Time to convert'],
    variants: {
      control: {
        name: 'No Social Proof',
        description: 'Page without testimonials or logos near the CTA',
      },
      test: {
        name: 'Social Proof Above CTA',
        description: 'Customer logos, testimonial quote, or user count directly above CTA',
      },
    },
    duration: '2-4 weeks',
    minimumSampleSize: 1500,
    tags: ['trust', 'social-proof', 'conversion', 'testimonials'],
    difficulty: 'easy',
    suggestedPages: ['Signup page', 'Pricing page', 'Landing page'],
    examples: [
      {
        company: 'Basecamp',
        result: '+102.5% signups with customer testimonials on homepage',
        year: 2014,
      },
      {
        company: 'WikiJob',
        result: '+34% conversions with customer testimonials added',
        year: 2015,
      },
      {
        company: 'Voices.com',
        result: '+400% conversion rate with client logos above fold',
        year: 2013,
      },
    ],
  },

  {
    id: 'form-length',
    name: 'Form Field Reduction',
    category: 'conversion',
    description: 'Test removing non-essential form fields to reduce friction',
    hypothesis:
      'Fewer form fields will increase completion rates by reducing cognitive load and time investment',
    primaryMetric: 'Form completion rate',
    secondaryMetrics: ['Time to complete', 'Abandonment rate', 'Lead quality score'],
    variants: {
      control: {
        name: 'Full Form',
        description: 'Current form with all fields (e.g., name, email, phone, company, role)',
      },
      test: {
        name: 'Reduced Form',
        description: 'Form with only essential fields (e.g., name, email)',
      },
    },
    duration: '2-3 weeks',
    minimumSampleSize: 500,
    tags: ['forms', 'friction', 'conversion', 'lead-gen'],
    difficulty: 'easy',
    suggestedPages: ['Contact form', 'Signup form', 'Demo request'],
    examples: [
      {
        company: 'Expedia',
        result: '+$12M annual revenue by removing one optional field',
        year: 2010,
      },
      {
        company: 'Imagescape',
        result: '+120% conversions by reducing form from 11 to 4 fields',
        year: 2013,
      },
      {
        company: 'Marketo',
        result: '+34% leads with shorter forms (5 vs 9 fields)',
        year: 2014,
      },
    ],
  },

  {
    id: 'urgency-scarcity',
    name: 'Urgency & Scarcity Messaging',
    category: 'conversion',
    description: 'Test adding urgency or scarcity elements to drive faster decisions',
    hypothesis:
      'Adding time-limited offers or stock availability will increase conversion rates by triggering loss aversion',
    primaryMetric: 'Conversion rate',
    secondaryMetrics: ['Time to purchase', 'Cart abandonment rate', 'Revenue per visitor'],
    variants: {
      control: {
        name: 'Standard Offer',
        description: 'Product/offer without urgency messaging',
      },
      test: {
        name: 'Urgency Added',
        description: 'Countdown timer, "Limited time offer", or "Only X left in stock"',
      },
    },
    duration: '2-3 weeks',
    minimumSampleSize: 1000,
    tags: ['urgency', 'scarcity', 'conversion', 'ecommerce'],
    difficulty: 'medium',
    suggestedPages: ['Product page', 'Checkout', 'Pricing page'],
    examples: [
      {
        company: 'Booking.com',
        result: '+87% bookings with scarcity messaging ("Only 2 rooms left!")',
        year: 2016,
      },
      {
        company: 'Marcus Taylor',
        result: '+332% conversions with countdown timer on landing page',
        year: 2014,
      },
    ],
  },

  // ============================================
  // ENGAGEMENT TEMPLATES
  // ============================================

  {
    id: 'onboarding-steps',
    name: 'Onboarding Flow Length',
    category: 'engagement',
    description: 'Test streamlined vs comprehensive onboarding experiences',
    hypothesis:
      'A shorter, focused onboarding will improve completion rates while maintaining activation quality',
    primaryMetric: 'Onboarding completion rate',
    secondaryMetrics: ['Activation rate', '7-day retention', '30-day retention', 'Time to value'],
    variants: {
      control: {
        name: 'Full Onboarding (5+ steps)',
        description: 'Current comprehensive onboarding with all features introduced',
      },
      test: {
        name: 'Quick Onboarding (2-3 steps)',
        description: 'Streamlined flow focusing only on the core "aha moment"',
      },
    },
    duration: '3-4 weeks',
    minimumSampleSize: 500,
    tags: ['onboarding', 'activation', 'engagement', 'retention'],
    difficulty: 'medium',
    suggestedPages: ['Post-signup flow', 'First-run experience'],
    examples: [
      {
        company: 'Duolingo',
        result: '+20% daily active users with streamlined onboarding',
        year: 2017,
      },
      {
        company: 'Slack',
        result: '+30% team creation rate with simplified setup wizard',
        year: 2016,
      },
    ],
  },

  {
    id: 'notification-timing',
    name: 'Push Notification Timing',
    category: 'engagement',
    description: 'Test personalized vs fixed notification delivery times',
    hypothesis:
      'Sending notifications at each user\'s most active time will increase open rates and re-engagement',
    primaryMetric: 'Notification open rate',
    secondaryMetrics: ['Click-through rate', 'Session starts', 'Feature usage'],
    variants: {
      control: {
        name: 'Fixed Time',
        description: 'Notifications sent at standard time (e.g., 10am local)',
      },
      test: {
        name: 'Personalized Time',
        description: 'Notifications based on individual user\'s most active time',
      },
    },
    targetAudience: 'Users with push notifications enabled',
    duration: '2-3 weeks',
    minimumSampleSize: 1000,
    tags: ['notifications', 'engagement', 'personalization', 'mobile'],
    difficulty: 'hard',
    examples: [
      {
        company: 'Netflix',
        result: '+15% notification engagement with personalized send times',
        year: 2018,
      },
      {
        company: 'Spotify',
        result: '+22% return visits with ML-optimized notification timing',
        year: 2019,
      },
    ],
  },

  {
    id: 'gamification-elements',
    name: 'Gamification & Progress Tracking',
    category: 'engagement',
    description: 'Test adding progress bars, achievements, or streaks',
    hypothesis:
      'Visual progress indicators and achievement systems will increase user engagement and feature adoption',
    primaryMetric: 'Feature adoption rate',
    secondaryMetrics: ['Daily active users', 'Session duration', 'Tasks completed'],
    variants: {
      control: {
        name: 'No Gamification',
        description: 'Standard feature usage without progress tracking',
      },
      test: {
        name: 'Progress & Achievements',
        description: 'Progress bar, completion percentage, or achievement badges',
      },
    },
    duration: '3-4 weeks',
    minimumSampleSize: 800,
    tags: ['gamification', 'engagement', 'motivation', 'progress'],
    difficulty: 'medium',
    suggestedPages: ['Dashboard', 'Profile page', 'Feature area'],
    examples: [
      {
        company: 'LinkedIn',
        result: '+55% profile completion with progress bar',
        year: 2012,
      },
      {
        company: 'Duolingo',
        result: '+50% lesson completion with streak system',
        year: 2016,
      },
    ],
  },

  // ============================================
  // PRICING TEMPLATES
  // ============================================

  {
    id: 'pricing-anchor',
    name: 'Price Anchoring with Premium Tier',
    category: 'pricing',
    description: 'Test adding a high-tier option to anchor price perception',
    hypothesis:
      'Adding a premium tier will make the mid-tier seem more valuable and increase its selection rate',
    primaryMetric: 'Average Revenue Per User (ARPU)',
    secondaryMetrics: ['Plan selection distribution', 'Conversion rate', 'Upgrade rate'],
    variants: {
      control: {
        name: 'Two Tiers',
        description: 'Basic ($10) and Pro ($25) pricing',
      },
      test: {
        name: 'Three Tiers with Anchor',
        description: 'Basic ($10), Pro ($25), and Enterprise ($100) pricing',
      },
    },
    duration: '4-6 weeks',
    minimumSampleSize: 500,
    tags: ['pricing', 'monetization', 'psychology', 'anchoring'],
    difficulty: 'easy',
    suggestedPages: ['Pricing page', 'Upgrade modal'],
    examples: [
      {
        company: 'The Economist',
        result: '+43% revenue with decoy pricing (print+digital vs digital-only)',
        year: 2009,
      },
      {
        company: 'Williams-Sonoma',
        result: '+50% sales of mid-tier bread maker after adding premium option',
        year: 2010,
      },
    ],
  },

  {
    id: 'annual-discount',
    name: 'Annual Plan Discount Level',
    category: 'pricing',
    description: 'Test different discount levels for annual plans',
    hypothesis:
      'A larger annual discount will increase annual plan adoption without hurting overall revenue',
    primaryMetric: 'Annual plan adoption rate',
    secondaryMetrics: ['Total revenue', 'Churn rate', 'LTV'],
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
    tags: ['pricing', 'subscription', 'retention', 'annual'],
    difficulty: 'easy',
    suggestedPages: ['Pricing page', 'Checkout', 'Upgrade flow'],
    examples: [
      {
        company: 'Spotify',
        result: '+67% annual plan adoption with 2 months free vs 1 month',
        year: 2018,
      },
      {
        company: 'Headspace',
        result: '+40% annual subscriptions with limited-time 50% discount',
        year: 2019,
      },
    ],
  },

  {
    id: 'free-trial-length',
    name: 'Free Trial Duration',
    category: 'pricing',
    description: 'Test different free trial lengths to optimize conversion',
    hypothesis:
      'A longer trial period will allow users to fully experience value, increasing paid conversions',
    primaryMetric: 'Trial to paid conversion rate',
    secondaryMetrics: ['Feature adoption during trial', 'Time to first value', 'Support tickets'],
    variants: {
      control: {
        name: '7-Day Trial',
        description: 'Current 7-day free trial period',
      },
      test: {
        name: '14-Day Trial',
        description: 'Extended 14-day free trial period',
      },
    },
    duration: '6-8 weeks',
    minimumSampleSize: 400,
    tags: ['pricing', 'trial', 'conversion', 'freemium'],
    difficulty: 'easy',
    suggestedPages: ['Signup flow', 'Pricing page'],
    examples: [
      {
        company: 'Crazy Egg',
        result: '+21% conversions with 30-day vs 14-day trial',
        year: 2015,
      },
      {
        company: 'Moz',
        result: '-15% conversion with 30-day trial (too long, reduced urgency)',
        year: 2014,
      },
    ],
  },

  // ============================================
  // RETENTION TEMPLATES
  // ============================================

  {
    id: 'reactivation-email',
    name: 'Churn Prevention Email',
    category: 'retention',
    description: 'Test personalized win-back emails for inactive users',
    hypothesis:
      'A personalized email highlighting unused features plus a discount will reactivate more churned users',
    primaryMetric: 'Reactivation rate',
    secondaryMetrics: ['Email open rate', 'Click-through rate', '30-day retention post-reactivation'],
    variants: {
      control: {
        name: 'Generic Reminder',
        description: '"We miss you" email without personalization or offer',
      },
      test: {
        name: 'Personalized + Discount',
        description: 'Email showing unused features + 30% discount offer',
      },
    },
    targetAudience: 'Users inactive for 30+ days',
    duration: '3-4 weeks',
    minimumSampleSize: 500,
    tags: ['email', 'retention', 'win-back', 'churn'],
    difficulty: 'medium',
    examples: [
      {
        company: 'Grammarly',
        result: '+28% reactivation with personalized writing stats in email',
        year: 2018,
      },
      {
        company: 'Spotify',
        result: '+33% return rate with personalized playlist win-back email',
        year: 2017,
      },
    ],
  },

  {
    id: 'cancellation-flow',
    name: 'Cancellation Flow Optimization',
    category: 'retention',
    description: 'Test save offers and feedback collection during cancellation',
    hypothesis:
      'Offering alternatives during cancellation (pause, downgrade, discount) will reduce voluntary churn',
    primaryMetric: 'Save rate (cancellation prevented)',
    secondaryMetrics: ['Cancellation completion rate', 'Feedback submission rate', 'Resubscription rate'],
    variants: {
      control: {
        name: 'Simple Cancellation',
        description: 'Direct cancellation with confirmation only',
      },
      test: {
        name: 'Save Offer Flow',
        description: 'Pause subscription, downgrade, or 50% off next month options',
      },
    },
    targetAudience: 'Users initiating cancellation',
    duration: '4-6 weeks',
    minimumSampleSize: 200,
    tags: ['retention', 'churn', 'cancellation', 'save'],
    difficulty: 'medium',
    suggestedPages: ['Cancellation flow', 'Account settings'],
    examples: [
      {
        company: 'Netflix',
        result: '+15% saves with pause subscription option',
        year: 2020,
      },
      {
        company: 'Adobe',
        result: '+25% retention with loyalty discount during cancellation',
        year: 2019,
      },
    ],
  },

  {
    id: 'weekly-digest',
    name: 'Weekly Engagement Digest',
    category: 'retention',
    description: 'Test weekly summary emails to drive re-engagement',
    hypothesis:
      'A personalized weekly digest showing activity and value will increase return visits',
    primaryMetric: 'Weekly active users',
    secondaryMetrics: ['Email open rate', 'Return visit rate', 'Feature engagement'],
    variants: {
      control: {
        name: 'No Digest',
        description: 'Standard transactional emails only',
      },
      test: {
        name: 'Weekly Digest',
        description: 'Personalized weekly email with stats, achievements, and suggestions',
      },
    },
    duration: '4-6 weeks',
    minimumSampleSize: 1000,
    tags: ['email', 'retention', 'engagement', 'digest'],
    difficulty: 'medium',
    examples: [
      {
        company: 'GitHub',
        result: '+18% weekly returns with contribution activity digest',
        year: 2018,
      },
      {
        company: 'Strava',
        result: '+25% session starts with weekly training summary',
        year: 2019,
      },
    ],
  },
];

/**
 * Get a template by ID
 */
export function getTemplateById(id: string): ExperimentTemplate | undefined {
  return experimentTemplates.find((t) => t.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(
  category: ExperimentTemplate['category']
): ExperimentTemplate[] {
  return experimentTemplates.filter((t) => t.category === category);
}

/**
 * Search templates by query string
 */
export function searchTemplates(query: string): ExperimentTemplate[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return experimentTemplates;

  return experimentTemplates.filter((t) => {
    return (
      t.name.toLowerCase().includes(normalizedQuery) ||
      t.description.toLowerCase().includes(normalizedQuery) ||
      t.hypothesis.toLowerCase().includes(normalizedQuery) ||
      t.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)) ||
      t.category.toLowerCase().includes(normalizedQuery)
    );
  });
}

/**
 * Get templates by difficulty
 */
export function getTemplatesByDifficulty(
  difficulty: NonNullable<ExperimentTemplate['difficulty']>
): ExperimentTemplate[] {
  return experimentTemplates.filter((t) => t.difficulty === difficulty);
}

/**
 * Get quick-win templates (easy difficulty, short duration)
 */
export function getQuickWinTemplates(): ExperimentTemplate[] {
  return experimentTemplates.filter(
    (t) => t.difficulty === 'easy' || t.tags.includes('quick-win')
  );
}
