import { tool, ToolSet } from "ai";
import { z } from "zod";
import {
  getExperiment,
  getExperimentResults,
  listExperiments,
} from "@/lib/integrations/posthog";

/**
 * Calculate derived statistics from experiment results
 */
function calculateExperimentStats(
  variants: { key: string; count: number; absolute_exposure: number; success_count?: number }[],
  probability: Record<string, number>,
  credibleIntervals: Record<string, [number, number]>
) {
  const control = variants.find((v) => v.key === "control");
  const test = variants.find((v) => v.key !== "control");

  if (!control || !test) {
    return null;
  }

  const controlRate = control.success_count
    ? (control.success_count / control.count) * 100
    : (control.count / control.absolute_exposure) * 100;

  const testRate = test.success_count
    ? (test.success_count / test.count) * 100
    : (test.count / test.absolute_exposure) * 100;

  const uplift = controlRate > 0 ? ((testRate - controlRate) / controlRate) * 100 : 0;

  return {
    totalParticipants: control.absolute_exposure + test.absolute_exposure,
    controlParticipants: control.absolute_exposure,
    testParticipants: test.absolute_exposure,
    controlConversions: control.success_count || control.count,
    testConversions: test.success_count || test.count,
    controlRate: controlRate.toFixed(2),
    testRate: testRate.toFixed(2),
    uplift: uplift.toFixed(1),
    probability: {
      control: ((probability?.control || 0) * 100).toFixed(1),
      test: ((probability?.[test.key] || 0) * 100).toFixed(1),
    },
    credibleIntervals: {
      control: credibleIntervals?.control?.map((v) => (v * 100).toFixed(2)) || null,
      test: credibleIntervals?.[test.key]?.map((v) => (v * 100).toFixed(2)) || null,
    },
    trafficSplit: {
      control: ((control.absolute_exposure / (control.absolute_exposure + test.absolute_exposure)) * 100).toFixed(1),
      test: ((test.absolute_exposure / (control.absolute_exposure + test.absolute_exposure)) * 100).toFixed(1),
    },
  };
}

/**
 * Derive recommendation from experiment stats
 */
function deriveRecommendation(
  significant: boolean,
  stats: ReturnType<typeof calculateExperimentStats>,
  daysRunning: number
): "SHIP" | "ITERATE" | "END" | "WAIT" | "INVESTIGATE" {
  if (!stats) return "INVESTIGATE";

  const totalParticipants = stats.totalParticipants;
  const uplift = parseFloat(stats.uplift);
  const testWinProbability = parseFloat(stats.probability.test);

  // Check for Sample Ratio Mismatch
  const trafficDiff = Math.abs(parseFloat(stats.trafficSplit.control) - 50);
  if (trafficDiff > 5) {
    return "INVESTIGATE";
  }

  // Not enough data
  if (totalParticipants < 100) {
    return "WAIT";
  }

  // Clear winner
  if (significant && testWinProbability > 95 && uplift > 0) {
    return "SHIP";
  }

  // Promising but needs more data
  if (testWinProbability > 80 && uplift > 0 && !significant) {
    return daysRunning < 14 ? "WAIT" : "ITERATE";
  }

  // Clear loser
  if (significant && testWinProbability < 5) {
    return "END";
  }

  // No significant difference after sufficient time
  if (daysRunning > 21 && !significant) {
    return "END";
  }

  return "WAIT";
}

/**
 * Analyze tools for experiment analysis
 */
export const analyzeTools = {
  /**
   * List all experiments with summary stats
   */
  listExperimentsForAnalysis: tool({
    description:
      "List all PostHog experiments with their current status. Use this to find experiments to analyze.",
    inputSchema: z.object({
      includeArchived: z.boolean().optional().describe("Include archived experiments"),
    }),
    outputSchema: z.object({
      experiments: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          status: z.enum(["draft", "running", "complete"]),
          featureFlagKey: z.string(),
          startDate: z.string().nullable(),
          endDate: z.string().nullable(),
          daysRunning: z.number().nullable(),
          conclusion: z.string().nullable(),
        })
      ),
      totalCount: z.number(),
    }),
    execute: async ({ includeArchived }) => {
      const experiments = await listExperiments();

      const filtered = includeArchived
        ? experiments
        : experiments.filter((e) => !e.archived && !e.deleted);

      const now = new Date();

      return {
        experiments: filtered.map((exp) => {
          const startDate = exp.start_date ? new Date(exp.start_date) : null;
          const endDate = exp.end_date ? new Date(exp.end_date) : null;

          let status: "draft" | "running" | "complete" = "draft";
          if (startDate && !endDate) status = "running";
          if (endDate) status = "complete";

          const daysRunning = startDate
            ? Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
            : null;

          return {
            id: exp.id,
            name: exp.name,
            status,
            featureFlagKey: exp.feature_flag_key,
            startDate: exp.start_date || null,
            endDate: exp.end_date,
            daysRunning,
            conclusion: exp.conclusion,
          };
        }),
        totalCount: filtered.length,
      };
    },
  }),

  /**
   * Analyze a specific experiment
   */
  analyzeExperiment: tool({
    description: `Analyze a PostHog experiment and provide AI-powered insights with recommendations.

Returns:
- Experiment details and configuration
- Statistical results (conversion rates, significance, confidence intervals)
- Calculated metrics (uplift, sample size, traffic split)
- AI recommendation (SHIP, ITERATE, END, WAIT, INVESTIGATE)

The AI will interpret these results and provide:
- Plain English summary
- Risk assessment
- Actionable next steps`,
    inputSchema: z.object({
      experimentId: z.number().describe("The PostHog experiment ID to analyze"),
    }),
    outputSchema: z.object({
      experiment: z.object({
        id: z.number(),
        name: z.string(),
        description: z.string().nullable(),
        featureFlagKey: z.string(),
        startDate: z.string().nullable(),
        endDate: z.string().nullable(),
        daysRunning: z.number().nullable(),
        variants: z.array(
          z.object({
            key: z.string(),
            name: z.string().nullable(),
          })
        ),
        metrics: z.array(
          z.object({
            type: z.string(),
            event: z.string().nullable(),
          })
        ),
      }),
      results: z.object({
        significant: z.boolean(),
        significanceCode: z.string(),
        variants: z.array(
          z.object({
            key: z.string(),
            participants: z.number(),
            conversions: z.number(),
          })
        ),
        probability: z.record(z.string(), z.number()).nullable(),
      }),
      stats: z
        .object({
          totalParticipants: z.number(),
          controlRate: z.string(),
          testRate: z.string(),
          uplift: z.string(),
          trafficSplit: z.object({
            control: z.string(),
            test: z.string(),
          }),
          probability: z.object({
            control: z.string(),
            test: z.string(),
          }),
        })
        .nullable(),
      recommendation: z.enum(["SHIP", "ITERATE", "END", "WAIT", "INVESTIGATE"]),
      recommendationReason: z.string(),
    }),
    execute: async ({ experimentId }) => {
      // Fetch experiment details
      const experiment = await getExperiment(experimentId);

      // Try to fetch results (may fail if experiment hasn't started)
      let results: Awaited<ReturnType<typeof getExperimentResults>> | null = null;
      try {
        results = await getExperimentResults(experimentId);
      } catch {
        // Results not available yet
      }

      const now = new Date();
      const startDate = experiment.start_date ? new Date(experiment.start_date) : null;
      const daysRunning = startDate
        ? Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      // Calculate stats if we have results
      const stats = results?.variants
        ? calculateExperimentStats(
            results.variants,
            results.probability,
            results.credible_intervals
          )
        : null;

      // Derive recommendation
      const recommendation = results
        ? deriveRecommendation(results.significant, stats, daysRunning || 0)
        : "WAIT";

      // Build recommendation reason
      let recommendationReason = "";
      switch (recommendation) {
        case "SHIP":
          recommendationReason = `Strong positive results with ${stats?.probability.test}% probability that test variant wins. Uplift of ${stats?.uplift}% is statistically significant.`;
          break;
        case "ITERATE":
          recommendationReason = `Promising signal but not conclusive. Consider refining the hypothesis or testing a more pronounced variant.`;
          break;
        case "END":
          recommendationReason = `No significant difference detected after ${daysRunning} days. Consider testing a different approach.`;
          break;
        case "WAIT":
          recommendationReason = `Insufficient data for a confident decision. Continue running to reach statistical significance.`;
          break;
        case "INVESTIGATE":
          recommendationReason = `Anomalies detected in the data (e.g., traffic split imbalance). Review implementation before drawing conclusions.`;
          break;
      }

      return {
        experiment: {
          id: experiment.id,
          name: experiment.name,
          description: experiment.description || null,
          featureFlagKey: experiment.feature_flag_key,
          startDate: experiment.start_date || null,
          endDate: experiment.end_date,
          daysRunning,
          variants:
            experiment.feature_flag?.filters?.multivariate?.variants.map((v) => ({
              key: v.key,
              name: v.name || null,
            })) || [],
          metrics:
            experiment.metrics?.map((m) => ({
              type: m.metric_type,
              event: m.series?.[0]?.event || null,
            })) || [],
        },
        results: {
          significant: results?.significant || false,
          significanceCode: results?.significance_code || "not_enough_data",
          variants:
            results?.variants.map((v) => ({
              key: v.key,
              participants: v.absolute_exposure,
              conversions: v.success_count || v.count,
            })) || [],
          probability: results?.probability || null,
        },
        stats: stats
          ? {
              totalParticipants: stats.totalParticipants,
              controlRate: stats.controlRate,
              testRate: stats.testRate,
              uplift: stats.uplift,
              trafficSplit: stats.trafficSplit,
              probability: stats.probability,
            }
          : null,
        recommendation,
        recommendationReason,
      };
    },
  }),

  /**
   * Show live experiment dashboard with real-time updates
   */
  showLiveExperiment: tool({
    description: `Show a live experiment dashboard with real-time updating metrics.

Use this when:
- User wants to monitor an experiment in real-time
- User asks "show me live results for experiment X"
- User wants to watch metrics update as the experiment runs

The dashboard shows:
- Variant comparison with conversion rates
- Statistical significance progress
- Total participants, improvement, days running
- AI commentary on experiment health
- Auto-refreshes every 10 seconds`,
    inputSchema: z.object({
      experimentId: z.number().describe("The PostHog experiment ID to monitor"),
    }),
    outputSchema: z.object({
      experimentId: z.number(),
      name: z.string(),
      status: z.enum(["draft", "running", "complete"]),
      message: z.string(),
    }),
    execute: async ({ experimentId }) => {
      // Fetch experiment to verify it exists and get its name
      const experiment = await getExperiment(experimentId);

      let status: "draft" | "running" | "complete" = "draft";
      if (experiment.start_date && !experiment.end_date) status = "running";
      if (experiment.end_date) status = "complete";

      return {
        experimentId: experiment.id,
        name: experiment.name,
        status,
        message: `Now showing live dashboard for "${experiment.name}". Metrics will auto-refresh every 10 seconds.`,
      };
    },
  }),
} satisfies ToolSet;
