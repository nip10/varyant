import { env } from "../config/env";

const projectBaseUrl = `${env.NEXT_PUBLIC_POSTHOG_HOST}/api/projects/${env.POSTHOG_PROJECT_ID}`;
const authHeaders = {
  Authorization: `Bearer ${env.POSTHOG_API_KEY}`,
  "Content-Type": "application/json",
};

/**
 * Escapes a string value for safe use in HogQL queries.
 * Prevents SQL injection by escaping special characters.
 */
function escapeHogQLString(value: string): string {
  return value
    .replace(/\\/g, "\\\\") // Escape backslashes first
    .replace(/'/g, "''"); // Escape single quotes by doubling
}

/**
 * Valid interval units for HogQL date range queries.
 */
const VALID_INTERVAL_UNITS = [
  "SECOND",
  "MINUTE",
  "HOUR",
  "DAY",
  "WEEK",
  "MONTH",
  "QUARTER",
  "YEAR",
] as const;

/**
 * Validates and sanitizes a date range string for HogQL INTERVAL.
 * Expected format: "N UNIT" where N is a positive integer and UNIT is a valid interval.
 * @throws Error if the format is invalid
 */
function validateDateRange(dateRange: string): string {
  const match = dateRange.trim().match(/^(\d+)\s+([A-Z]+)$/i);
  if (!match) {
    throw new Error(
      `Invalid date range format: "${dateRange}". Expected format: "N UNIT" (e.g., "30 DAY")`
    );
  }

  const [, amount, unit] = match;
  const upperUnit = unit.toUpperCase();

  if (!VALID_INTERVAL_UNITS.includes(upperUnit as (typeof VALID_INTERVAL_UNITS)[number])) {
    throw new Error(
      `Invalid interval unit: "${unit}". Valid units: ${VALID_INTERVAL_UNITS.join(", ")}`
    );
  }

  const numAmount = parseInt(amount, 10);
  if (numAmount <= 0 || numAmount > 365) {
    throw new Error(`Invalid interval amount: ${amount}. Must be between 1 and 365.`);
  }

  return `${numAmount} ${upperUnit}`;
}

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
  const safeEvent = escapeHogQLString(event);
  const safeDateRange = validateDateRange(dateRange);

  const query = `
    SELECT
      count()
    FROM events
    WHERE event = '${safeEvent}'
      AND timestamp > now() - INTERVAL ${safeDateRange}
  `;
  return runHogQL("event_count", query);
};

export interface PosthogExperimentListResponse {
  count: number;
  next: any;
  previous: any;
  results: Result[];
}

export interface Result {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date: any;
  feature_flag_key: string;
  feature_flag: FeatureFlag;
  holdout: any;
  holdout_id: any;
  exposure_cohort: any;
  parameters: Parameters;
  secondary_metrics: any[];
  saved_metrics: any[];
  saved_metrics_ids: any;
  filters: Filters2;
  archived: boolean;
  deleted: boolean;
  created_by: CreatedBy;
  created_at: string;
  updated_at: string;
  type: string;
  exposure_criteria: ExposureCriteria;
  metrics: Metric[];
  metrics_secondary: any[];
  stats_config: StatsConfig;
  conclusion: any;
  conclusion_comment: any;
  primary_metrics_ordered_uuids?: string[];
  secondary_metrics_ordered_uuids: any;
  user_access_level: string;
}

export interface FeatureFlag {
  id: number;
  team_id: number;
  name: string;
  key: string;
  filters: Filters;
  deleted: boolean;
  active: boolean;
  ensure_experience_continuity: boolean;
  has_encrypted_payloads: boolean;
  version: number;
  evaluation_runtime: string;
  bucketing_identifier: string;
  evaluation_tags: any[];
}

export interface Filters {
  groups: Group[];
  payloads?: Payloads;
  multivariate: Multivariate;
  holdout_groups: any;
  aggregation_group_type_index: any;
}

export interface Group {
  variant: any;
  properties: any[];
  rollout_percentage: number;
}

export interface Payloads {}

export interface Multivariate {
  variants: Variant[];
}

export interface Variant {
  key: string;
  name?: string;
  rollout_percentage: number;
}

export interface Parameters {
  feature_flag_variants?: FeatureFlagVariant[];
}

export interface FeatureFlagVariant {
  key: string;
  rollout_percentage: number;
  name?: string;
}

export interface Filters2 {}

export interface CreatedBy {
  id: number;
  uuid: string;
  distinct_id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_email_verified: boolean;
  hedgehog_config: any;
  role_at_organization: string;
}

export interface ExposureCriteria {
  filterTestAccounts?: boolean;
}

export interface Metric {
  goal: string;
  kind: string;
  uuid: string;
  series: Series[];
  fingerprint: string;
  metric_type: string;
}

export interface Series {
  kind: string;
  event: string;
}

export interface StatsConfig {
  method: string;
  timeseries?: boolean;
}

export const listExperiments = async () => {
  const res = await fetch(`${projectBaseUrl}/experiments`, {
    headers: authHeaders,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(
      `PostHog experiments fetch failed: ${res.status} ${message}`
    );
  }

  const data = (await res.json()) as PosthogExperimentListResponse;
  return data.results;
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
