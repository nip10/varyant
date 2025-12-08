import { env } from "../config/env";

const projectBaseUrl = `${env.NEXT_PUBLIC_POSTHOG_HOST}/api/projects/${env.POSTHOG_PROJECT_ID}`;
const authHeaders = {
  Authorization: `Bearer ${env.POSTHOG_API_KEY}`,
  "Content-Type": "application/json",
};

export type HogQLResponse = {
  results: unknown[];
  types?: Record<string, string>;
};

export const runHogQL = async (
  name: string,
  hogql: string
): Promise<HogQLResponse> => {
  const res = await fetch(`${projectBaseUrl}/query`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      query: {
        kind: "HogQLQuery",
        query: hogql,
      },
      name,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`PostHog query failed: ${res.status} ${message}`);
  }

  return res.json();
};

export const getEventCount = async (event: string, dateRange = "30 DAY") => {
  const query = `
    SELECT
      count()
    FROM events
    WHERE event = '${event}'
      AND timestamp > now() - INTERVAL ${dateRange}
  `;
  console.log("Running query", query);
  return runHogQL("event_count", query);
};

export const listExperiments = async (status?: string) => {
  const url = new URL(`${projectBaseUrl}/experiments`);
  if (status) url.searchParams.set("status", status);

  const res = await fetch(url, {
    headers: authHeaders,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(
      `PostHog experiments fetch failed: ${res.status} ${message}`
    );
  }

  return res.json();
};

export const getExperiment = async (experimentId: string) => {
  const res = await fetch(`${projectBaseUrl}/experiments/${experimentId}`, {
    headers: authHeaders,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(
      `PostHog experiment fetch failed: ${res.status} ${message}`
    );
  }

  return res.json();
};

export type CreateExperimentInput = {
  name: string;
  featureFlagKey: string;
};

export const createExperiment = async (input: CreateExperimentInput) => {
  const payload = {
    name: input.name,
    feature_flag_key: input.featureFlagKey,
    start_date: new Date().toISOString(), // start immediately
    // hardcoded for the demo, time is running out
    metrics: [
      {
        kind: "ExperimentMetric",
        uuid: "42232f3c-b3cb-453c-bb1c-46f42107fd27",
        metric_type: "funnel",
        goal: "increase",
        series: [
          {
            kind: "EventsNode",
            event: "hero_cta_button_clicked",
          },
        ],
      },
    ],
  };
  console.log("Creating experiment", input);
  const res = await fetch(`${projectBaseUrl}/experiments`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(
      `PostHog experiment creation failed: ${res.status} ${message}`
    );
  }

  return res.json();
};

export type PosthogInsightResponse = {
  name: string;
  derived_name: string;
  query: object;
  order: number;
  deleted: boolean;
  dashboards: string[];
  description: string;
  tags: string[];
  favorited: boolean;
  _create_in_folder: string;
};

export const getInsightById = async (
  id: string
): Promise<PosthogInsightResponse> => {
  const res = await fetch(`${projectBaseUrl}/insights/${id}`, {
    headers: authHeaders,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`PostHog insight fetch failed: ${res.status} ${message}`);
  }

  return res.json();
};

export type PosthogInsightListResponse = {
  count: number;
  next: string;
  previous: string;
  results: {
    id: string;
    short_id: string;
    name: string;
    derived_name: string;
    query: object;
    order: number;
    deleted: boolean;
    dashboards: string[];
    dashboard_tiles: string[];
    last_refresh: string;
    cache_target_age: string;
    next_allowed_client_refresh: string;
    result: string;
    hasMore: string;
    columns: string[];
    created_at: string;
    created_by: string;
    description: string;
    updated_at: string;
    tags: string[];
    favorited: boolean;
    last_modified_at: string;
    last_modified_by: string;
    is_sample: boolean;
    effective_restriction_level: string;
    effective_privilege_level: string;
    user_access_level: string;
    timezone: string;
    is_cached: boolean;
    query_status: string;
    hogql: string;
    types: string;
    resolved_date_range: string;
    _create_in_folder: string;
    alerts: string[];
    last_viewed_at: string;
  }[];
};

export const getInsights = async (): Promise<PosthogInsightListResponse> => {
  const res = await fetch(`${projectBaseUrl}/insights?format=json`, {
    headers: authHeaders,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`PostHog insights fetch failed: ${res.status} ${message}`);
  }

  const data = await res.json();
  return data;
};

type CreateFeatureFlagResponse = {
  id: number;
  name: string;
  key: string;
  filters: {
    groups: [
      {
        properties: [];
        rollout_percentage: 100;
        variant: null;
      }
    ];
    multivariate: {
      variants: {
        key: string;
        name: string;
        rollout_percentage: number;
      }[];
    };
    payloads: {};
  };
  deleted: boolean;
  active: boolean;
  created_by: {
    id: number;
    uuid: string;
    distinct_id: string;
    first_name: string;
    last_name: string;
    email: string;
    is_email_verified: boolean;
    hedgehog_config: null;
    role_at_organization: string;
  };
  created_at: string;
  updated_at: string;
  version: number;
  last_modified_by: {
    id: number;
    uuid: string;
    distinct_id: string;
    first_name: string;
    last_name: string;
    email: string;
    is_email_verified: boolean;
    hedgehog_config: null;
    role_at_organization: string;
  };
  is_simple_flag: boolean;
  rollout_percentage: number;
  ensure_experience_continuity: false;
  experiment_set: [];
  surveys: [];
  features: [];
  rollback_conditions: [];
  performed_rollback: boolean;
  can_edit: boolean;
  usage_dashboard: number;
  analytics_dashboards: [];
  has_enriched_analytics: boolean;
  user_access_level: string;
  is_remote_configuration: boolean;
  has_encrypted_payloads: boolean;
  status: string;
  evaluation_runtime: string;
  bucketing_identifier: string;
  last_called_at: null;
  evaluation_tags: [];
  tags: [];
};

export type CreateFeatureFlagInput = {
  featureFlagKey: string;
  numVariants: number;
};

export const createFeatureFlag = async (input: CreateFeatureFlagInput) => {
  const payload = {
    updated_at: null,
    key: input.featureFlagKey,
    name: input.featureFlagKey,
    filters: {
      groups: [
        {
          properties: [],
          rollout_percentage: 100,
          variant: null,
        },
      ],
      multivariate: {
        variants: [
          {
            key: "control",
            name: "Control",
            rollout_percentage: Math.floor(100 / input.numVariants),
          },
          ...Array.from({ length: input.numVariants - 1 }, (_, i) => ({
            key: `variant-${i + 1}`,
            name: `Variant ${i + 1}`,
            rollout_percentage: Math.floor(100 / input.numVariants),
          })),
        ],
      },
      payloads: {},
    },
    deleted: false,
    active: true,
    is_simple_flag: false,
    rollout_percentage: null,
    ensure_experience_continuity: false,
    experiment_set: null,
    features: [],
    rollback_conditions: [],
    surveys: null,
    performed_rollback: false,
    can_edit: true,
    user_access_level: "editor",
    tags: [],
    is_remote_configuration: false,
    has_encrypted_payloads: false,
    status: "ACTIVE",
    version: 0,
    evaluation_runtime: "all",
    evaluation_tags: [],
    _should_create_usage_dashboard: true,
    _create_in_folder: "Unfiled/Feature Flags",
  };
  const res = await fetch(`${projectBaseUrl}/feature_flags`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(
      `PostHog feature flag creation failed: ${res.status} ${message}`
    );
  }

  const data = (await res.json()) as CreateFeatureFlagResponse;
  return { featureFlagKey: data.key };
};
