import { NextRequest, NextResponse } from "next/server";
import {
  getExperiment,
  getExperimentResults,
} from "@/lib/integrations/posthog";

function getDaysRunning(startDate: string | null | undefined): number {
  if (!startDate) return 0;
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calculateImprovement(
  variant: { count?: number; absolute_exposure?: number },
  control: { count?: number; absolute_exposure?: number }
): number {
  const variantRate =
    variant.absolute_exposure && variant.absolute_exposure > 0
      ? ((variant.count || 0) / variant.absolute_exposure) * 100
      : 0;
  const controlRate =
    control.absolute_exposure && control.absolute_exposure > 0
      ? ((control.count || 0) / control.absolute_exposure) * 100
      : 0;

  if (controlRate === 0) return 0;
  return ((variantRate - controlRate) / controlRate) * 100;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const experimentId = parseInt(id, 10);

    if (isNaN(experimentId)) {
      return NextResponse.json(
        { error: "Invalid experiment ID" },
        { status: 400 }
      );
    }

    // Fetch experiment details
    const experiment = await getExperiment(experimentId);

    // Try to fetch results (may fail if experiment hasn't started)
    let results = null;
    try {
      results = await getExperimentResults(experimentId);
    } catch {
      // Results may not be available for draft experiments
    }

    // Determine status
    let status: "running" | "completed" | "draft" = "draft";
    if (experiment.start_date && !experiment.end_date) {
      status = "running";
    } else if (experiment.end_date) {
      status = "completed";
    }

    // Build variants data
    const flagVariants = experiment.parameters?.feature_flag_variants || [];

    // Convert results.variants array to a lookup map
    const variantResultsMap: Record<
      string,
      { count?: number; absolute_exposure?: number; success_count?: number }
    > = {};
    if (results?.variants) {
      for (const v of results.variants) {
        variantResultsMap[v.key] = v;
      }
    }

    // Find control variant for improvement calculation
    const controlKey =
      flagVariants.find((v) => v.key === "control")?.key ||
      flagVariants[0]?.key;
    const controlData = variantResultsMap[controlKey] || {
      count: 0,
      absolute_exposure: 0,
    };

    const variants = flagVariants.map((v) => {
      const vData = variantResultsMap[v.key] || {
        count: 0,
        absolute_exposure: 0,
      };
      const participants = vData.absolute_exposure || 0;
      const conversions = vData.count || 0;
      const conversionRate =
        participants > 0 ? (conversions / participants) * 100 : 0;
      const improvement =
        v.key === controlKey ? 0 : calculateImprovement(vData, controlData);

      // Calculate significance from probability
      let significance = 0;
      if (results?.significant) {
        significance = 95; // If PostHog says significant, it's >= 95%
      } else if (results?.probability && v.key !== controlKey) {
        // Use the probability that this variant wins as a proxy for significance
        const winProbability = results.probability[v.key] || 0;
        significance = winProbability * 100;
      } else if (participants > 100) {
        // Very rough approximation for demo purposes
        significance = Math.min(90, 30 + participants / 50);
      }

      return {
        key: v.key,
        name: v.name || v.key,
        participants,
        conversions,
        conversionRate,
        improvement,
        significance,
      };
    });

    const totalParticipants = variants.reduce(
      (sum, v) => sum + v.participants,
      0
    );

    return NextResponse.json({
      id: experiment.id,
      name: experiment.name,
      description: experiment.description,
      status,
      startDate: experiment.start_date,
      variants,
      totalParticipants,
      daysRunning: getDaysRunning(experiment.start_date),
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching experiment results:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiment results" },
      { status: 500 }
    );
  }
}
