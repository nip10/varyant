"use client";

import { useQuery } from "@tanstack/react-query";

export interface ExperimentVariant {
  key: string;
  name: string;
  participants: number;
  conversions: number;
  conversionRate: number;
  improvement: number;
  significance: number;
}

export interface LiveExperimentResults {
  id: number;
  name: string;
  description?: string;
  status: "running" | "completed" | "draft";
  startDate?: string;
  variants: ExperimentVariant[];
  totalParticipants: number;
  daysRunning: number;
  lastUpdated: string;
}

interface UseLiveExperimentOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useLiveExperiment(
  experimentId: number,
  options: UseLiveExperimentOptions = {}
) {
  const { enabled = true, refetchInterval = 10000 } = options;

  return useQuery({
    queryKey: ["experiment", experimentId, "live"],
    queryFn: async (): Promise<LiveExperimentResults> => {
      const response = await fetch(`/api/experiments/${experimentId}/results`);
      if (!response.ok) {
        throw new Error("Failed to fetch experiment results");
      }
      return response.json();
    },
    refetchInterval: enabled ? refetchInterval : false,
    enabled,
  });
}
