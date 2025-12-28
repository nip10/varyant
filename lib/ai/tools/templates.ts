import { tool, ToolSet } from "ai";
import { z } from "zod";
import {
  experimentTemplates,
  getTemplateById,
  getTemplatesByCategory,
  searchTemplates,
  getQuickWinTemplates,
  type ExperimentTemplate,
  type TemplateCategory,
  type TemplateCustomizations,
} from "@/lib/templates";
import { createFeatureFlag, createExperiment } from "@/lib/integrations/posthog";

/**
 * Generate a unique feature flag key from template
 */
function generateFeatureFlagKey(template: ExperimentTemplate, customName?: string): string {
  const baseName = customName || template.name;
  const slug = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const timestamp = Date.now().toString(36);
  return `exp-${slug}-${timestamp}`;
}

/**
 * Template tools for the Varyant copilot
 */
export const templateTools = {
  /**
   * List all available experiment templates
   */
  listExperimentTemplates: tool({
    description:
      "List all available experiment templates. Returns templates that can be used to quickly set up A/B tests based on proven patterns.",
    inputSchema: z.object({
      category: z
        .enum(["conversion", "engagement", "pricing", "retention"])
        .optional()
        .describe("Filter templates by category"),
      search: z
        .string()
        .optional()
        .describe("Search query to filter templates by name, description, or tags"),
      quickWinsOnly: z
        .boolean()
        .optional()
        .describe("If true, only return quick-win templates (easy difficulty)"),
    }),
    outputSchema: z.object({
      templates: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          category: z.enum(["conversion", "engagement", "pricing", "retention"]),
          description: z.string(),
          duration: z.string(),
          minimumSampleSize: z.number(),
          difficulty: z.enum(["easy", "medium", "hard"]).optional(),
          tags: z.array(z.string()),
          hasExamples: z.boolean(),
        })
      ),
      totalCount: z.number(),
    }),
    execute: async ({ category, search, quickWinsOnly }) => {
      let templates: ExperimentTemplate[];

      if (quickWinsOnly) {
        templates = getQuickWinTemplates();
      } else if (category) {
        templates = getTemplatesByCategory(category as TemplateCategory);
      } else if (search) {
        templates = searchTemplates(search);
      } else {
        templates = experimentTemplates;
      }

      // Apply additional search filter if both category and search provided
      if (category && search) {
        templates = templates.filter(
          (t) =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase()) ||
            t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
        );
      }

      return {
        templates: templates.map((t) => ({
          id: t.id,
          name: t.name,
          category: t.category,
          description: t.description,
          duration: t.duration,
          minimumSampleSize: t.minimumSampleSize,
          difficulty: t.difficulty,
          tags: t.tags,
          hasExamples: Boolean(t.examples && t.examples.length > 0),
        })),
        totalCount: templates.length,
      };
    },
  }),

  /**
   * Get detailed information about a specific template
   */
  getExperimentTemplate: tool({
    description:
      "Get detailed information about a specific experiment template including hypothesis, variants, metrics, and success stories.",
    inputSchema: z.object({
      templateId: z.string().describe("The ID of the template to retrieve"),
    }),
    outputSchema: z.object({
      template: z
        .object({
          id: z.string(),
          name: z.string(),
          category: z.enum(["conversion", "engagement", "pricing", "retention"]),
          description: z.string(),
          hypothesis: z.string(),
          primaryMetric: z.string(),
          secondaryMetrics: z.array(z.string()),
          variants: z.object({
            control: z.object({
              name: z.string(),
              description: z.string(),
            }),
            test: z.object({
              name: z.string(),
              description: z.string(),
            }),
          }),
          targetAudience: z.string().optional(),
          duration: z.string(),
          minimumSampleSize: z.number(),
          tags: z.array(z.string()),
          difficulty: z.enum(["easy", "medium", "hard"]).optional(),
          suggestedPages: z.array(z.string()).optional(),
          examples: z
            .array(
              z.object({
                company: z.string(),
                result: z.string(),
                year: z.number().optional(),
              })
            )
            .optional(),
        })
        .nullable(),
      found: z.boolean(),
    }),
    execute: async ({ templateId }) => {
      const template = getTemplateById(templateId);

      if (!template) {
        return {
          template: null,
          found: false,
        };
      }

      return {
        template: {
          id: template.id,
          name: template.name,
          category: template.category,
          description: template.description,
          hypothesis: template.hypothesis,
          primaryMetric: template.primaryMetric,
          secondaryMetrics: template.secondaryMetrics,
          variants: template.variants,
          targetAudience: template.targetAudience,
          duration: template.duration,
          minimumSampleSize: template.minimumSampleSize,
          tags: template.tags,
          difficulty: template.difficulty,
          suggestedPages: template.suggestedPages,
          examples: template.examples?.map((e) => ({
            company: e.company,
            result: e.result,
            year: e.year,
          })),
        },
        found: true,
      };
    },
  }),

  /**
   * Apply a template to create a new experiment
   */
  applyExperimentTemplate: tool({
    description:
      "Apply a pre-built experiment template to create a new A/B test in PostHog. This will create the feature flag and experiment based on the template configuration.",
    inputSchema: z.object({
      templateId: z.string().describe("The ID of the template to apply"),
      customizations: z
        .object({
          name: z
            .string()
            .optional()
            .describe("Custom experiment name (overrides template name)"),
          hypothesis: z
            .string()
            .optional()
            .describe("Custom hypothesis (overrides template hypothesis)"),
          targetPage: z.string().optional().describe("Target page/URL for the experiment"),
          controlVariantName: z
            .string()
            .optional()
            .describe("Custom name for the control variant"),
          testVariantName: z.string().optional().describe("Custom name for the test variant"),
        })
        .optional()
        .describe("Optional customizations to apply to the template"),
      linearTicketId: z
        .string()
        .optional()
        .describe("Optional Linear ticket ID to link to the experiment"),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      templateId: z.string(),
      templateName: z.string(),
      featureFlagKey: z.string(),
      experimentId: z.number().optional(),
      experimentName: z.string().optional(),
      error: z.string().optional(),
      nextSteps: z.array(z.string()),
    }),
    execute: async ({ templateId, customizations, linearTicketId }) => {
      const template = getTemplateById(templateId);

      if (!template) {
        return {
          success: false,
          templateId,
          templateName: "Unknown",
          featureFlagKey: "",
          error: `Template "${templateId}" not found`,
          nextSteps: ["Try listing available templates with listExperimentTemplates"],
        };
      }

      const experimentName = customizations?.name || template.name;
      const featureFlagKey = generateFeatureFlagKey(template, customizations?.name);

      try {
        // Step 1: Create the feature flag
        const featureFlag = await createFeatureFlag({
          featureFlagKey,
          numVariants: 2, // Control + Test
        });

        // Step 2: Create the experiment
        const experiment = await createExperiment({
          name: experimentName,
          featureFlagKey,
          linearTicketId,
          implementationEffort: template.difficulty === "hard" ? "high" : "low",
        });

        // Build next steps based on template
        const nextSteps: string[] = [];

        if (template.suggestedPages && template.suggestedPages.length > 0) {
          nextSteps.push(
            `Consider implementing on: ${template.suggestedPages.join(", ")}`
          );
        }

        nextSteps.push(
          `Expected duration: ${template.duration}`,
          `Minimum sample size: ${template.minimumSampleSize.toLocaleString()} users`,
          `Primary metric to track: ${template.primaryMetric}`
        );

        if (template.examples && template.examples.length > 0) {
          nextSteps.push(
            `Similar test at ${template.examples[0].company}: ${template.examples[0].result}`
          );
        }

        return {
          success: true,
          templateId: template.id,
          templateName: template.name,
          featureFlagKey,
          experimentId: experiment.id,
          experimentName: experiment.name,
          nextSteps,
        };
      } catch (error) {
        return {
          success: false,
          templateId: template.id,
          templateName: template.name,
          featureFlagKey,
          error: error instanceof Error ? error.message : "Failed to create experiment",
          nextSteps: [
            "Check that PostHog API credentials are configured",
            "Verify the feature flag key is unique",
            "Try again or create the experiment manually",
          ],
        };
      }
    },
    needsApproval: true,
  }),

  /**
   * Suggest templates based on user goal
   */
  suggestExperimentTemplates: tool({
    description:
      "Suggest experiment templates based on a user's goal or problem. Uses semantic matching to find the most relevant templates.",
    inputSchema: z.object({
      goal: z
        .string()
        .describe(
          "The user's goal or problem, e.g., 'increase signups', 'reduce churn', 'improve pricing page'"
        ),
      limit: z
        .number()
        .optional()
        .default(3)
        .describe("Maximum number of templates to suggest"),
    }),
    outputSchema: z.object({
      suggestions: z.array(
        z.object({
          templateId: z.string(),
          templateName: z.string(),
          category: z.enum(["conversion", "engagement", "pricing", "retention"]),
          relevanceReason: z.string(),
          exampleResult: z.string().optional(),
        })
      ),
    }),
    execute: async ({ goal, limit }) => {
      const normalizedGoal = goal.toLowerCase();

      // Keyword to category/template mapping
      const keywordMappings: Record<string, string[]> = {
        // Conversion keywords
        signup: ["form-length", "social-proof", "cta-color"],
        "sign up": ["form-length", "social-proof", "cta-color"],
        conversion: ["cta-color", "headline-copy", "social-proof", "form-length"],
        cta: ["cta-color", "urgency-scarcity"],
        button: ["cta-color"],
        form: ["form-length"],
        landing: ["headline-copy", "social-proof"],
        headline: ["headline-copy"],
        copy: ["headline-copy"],
        trust: ["social-proof"],
        testimonial: ["social-proof"],
        urgency: ["urgency-scarcity"],
        scarcity: ["urgency-scarcity"],

        // Engagement keywords
        onboarding: ["onboarding-steps"],
        activation: ["onboarding-steps", "gamification-elements"],
        engagement: ["notification-timing", "gamification-elements"],
        notification: ["notification-timing"],
        push: ["notification-timing"],
        progress: ["gamification-elements"],
        gamification: ["gamification-elements"],

        // Pricing keywords
        pricing: ["pricing-anchor", "annual-discount", "free-trial-length"],
        price: ["pricing-anchor", "annual-discount"],
        revenue: ["pricing-anchor", "annual-discount"],
        tier: ["pricing-anchor"],
        discount: ["annual-discount"],
        annual: ["annual-discount"],
        trial: ["free-trial-length"],
        freemium: ["free-trial-length"],

        // Retention keywords
        churn: ["reactivation-email", "cancellation-flow"],
        retention: ["reactivation-email", "cancellation-flow", "weekly-digest"],
        reactivation: ["reactivation-email"],
        "win-back": ["reactivation-email"],
        cancel: ["cancellation-flow"],
        digest: ["weekly-digest"],
        email: ["reactivation-email", "weekly-digest"],
      };

      // Find matching template IDs
      const matchedIds = new Set<string>();
      const matchReasons: Record<string, string> = {};

      for (const [keyword, templateIds] of Object.entries(keywordMappings)) {
        if (normalizedGoal.includes(keyword)) {
          for (const id of templateIds) {
            matchedIds.add(id);
            if (!matchReasons[id]) {
              matchReasons[id] = `Matches your goal "${goal}" (keyword: ${keyword})`;
            }
          }
        }
      }

      // If no keyword matches, fall back to search
      if (matchedIds.size === 0) {
        const searchResults = searchTemplates(goal);
        for (const template of searchResults.slice(0, limit)) {
          matchedIds.add(template.id);
          matchReasons[template.id] = `Related to "${goal}" based on template content`;
        }
      }

      // Build suggestions
      const suggestions = Array.from(matchedIds)
        .slice(0, limit)
        .map((id) => {
          const template = getTemplateById(id);
          if (!template) return null;

          return {
            templateId: template.id,
            templateName: template.name,
            category: template.category,
            relevanceReason: matchReasons[id] || `Relevant to ${goal}`,
            exampleResult: template.examples?.[0]
              ? `${template.examples[0].company}: ${template.examples[0].result}`
              : undefined,
          };
        })
        .filter((s): s is NonNullable<typeof s> => s !== null);

      return { suggestions };
    },
  }),
} satisfies ToolSet;
