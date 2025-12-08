import "dotenv/config";
import { randomUUID } from "crypto";
import { PostHog } from "posthog-node";
import fs from "fs";

type SeedConfig = {
  users: number;
  minEventsPerUser: number;
  maxEventsPerUser: number;
  daysBack: number;
  confirm: boolean;
  dryRun: boolean;
};

const args = new Set(process.argv.slice(2));

const config: SeedConfig = {
  users: Number(process.env.SEED_USERS ?? 1000),
  minEventsPerUser: 5,
  maxEventsPerUser: 12,
  daysBack: 15,
  confirm: args.has("--confirm"),
  dryRun: args.has("--dry-run"),
};

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!config.confirm && !config.dryRun) {
  console.error(
    "Add --confirm to run or --dry-run to preview. Example: yarn seed:posthog --confirm"
  );
  process.exit(1);
}

if (!POSTHOG_KEY || !POSTHOG_HOST) {
  console.error(
    "Missing NEXT_PUBLIC_POSTHOG_KEY or NEXT_PUBLIC_POSTHOG_HOST for PostHog ingestion."
  );
  process.exit(1);
}

const client = new PostHog(POSTHOG_KEY, {
  host: POSTHOG_HOST,
  flushAt: 20,
  flushInterval: 1000,
});

const plans = ["starter", "small_business", "enterprise"];
const devices = ["desktop", "mobile", "tablet"];
const countries = ["US", "CA", "GB", "DE", "IN", "BR", "AU", "ES"];
const pages = [
  "/",
  "/pricing",
  "/signup",
  "/dashboard",
  "/features/analytics",
  "/blog/ai-copilot",
];

const pick = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

const randomTimestamp = (daysBack: number) => {
  const now = Date.now();
  const delta = Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000);
  // bias slightly toward recent (square the delta fraction)
  const recentBias = Math.sqrt(delta / (daysBack * 24 * 60 * 60 * 1000));
  const adjusted = Math.floor(recentBias * daysBack * 24 * 60 * 60 * 1000);
  return new Date(now - adjusted);
};

const buildUserProps = () => ({
  plan: pick(plans),
  device: pick(devices),
  country: pick(countries),
  demo_seed: true,
});

type EventName =
  | "$pageview"
  | "signup"
  | "checkout"
  | "hero_cta_button_clicked";

type CapturedEvent = {
  name: EventName;
  ts: Date;
  props: Record<string, unknown>;
};

const generateEventsForUser = (
  props: Record<string, unknown>
): CapturedEvent[] => {
  const events: CapturedEvent[] = [];
  const eventCount =
    config.minEventsPerUser +
    Math.floor(
      Math.random() * (config.maxEventsPerUser - config.minEventsPerUser + 1)
    );

  const baseTime = randomTimestamp(config.daysBack);

  const pushEvent = (
    name: EventName,
    offsetMinutes: number,
    extra: Record<string, unknown> = {}
  ) => {
    const ts = new Date(baseTime.getTime() + offsetMinutes * 60 * 1000);
    events.push({ name, ts, props: { ...props, ...extra } });
  };

  pushEvent("$pageview", 0, { url: pick(pages) });

  let offset = 5;

  const clickedHeroCta = Math.random() < 0.55;
  if (clickedHeroCta) {
    pushEvent("hero_cta_button_clicked", offset, {
      page: "/",
      cta_label: "Get started",
    });
    offset += 2;
  }

  const signedUp = Math.random() < 0.65;
  if (signedUp) {
    pushEvent("signup", offset);
    offset += 5;
  }

  const checkedOut = signedUp && Math.random() < 0.4;
  if (checkedOut) {
    pushEvent("checkout", offset, {
      subscription_tier: props.plan ?? pick(plans),
    });
    offset += 5;
  }

  // Add filler events up to eventCount to vary volume
  while (events.length < eventCount) {
    pushEvent("$pageview", offset, { url: pick(pages) });
    offset += 3;
  }

  return events;
};

const buildSeedPlan = () => {
  const summary = {
    users: config.users,
    events: 0,
    byEvent: {} as Record<string, number>,
  };

  const users: {
    distinctId: string;
    properties: Record<string, unknown>;
    events: {
      name: EventName;
      timestamp: string;
      properties: Record<string, unknown>;
    }[];
  }[] = [];

  for (let i = 0; i < config.users; i += 1) {
    const distinctId = `demo_user_${i}_${randomUUID().slice(0, 8)}`;
    const properties = buildUserProps();

    const events = generateEventsForUser(properties).map((evt) => {
      summary.events += 1;
      summary.byEvent[evt.name] = (summary.byEvent[evt.name] ?? 0) + 1;
      return {
        name: evt.name,
        timestamp: evt.ts.toISOString(),
        properties: evt.props,
      };
    });

    users.push({
      distinctId,
      properties,
      events,
    });
  }

  return { config, summary, users };
};

const main = async () => {
  const plan = buildSeedPlan();

  if (config.dryRun) {
    console.log("Dry run: generated seed plan written to posthog-seed.json");
    fs.writeFileSync("posthog-seed.json", JSON.stringify(plan, null, 2));
    process.exit(0);
  }

  console.log(
    `Seeding PostHog with ${plan.summary.users} users and ~${plan.summary.events} events...`
  );

  for (const user of plan.users) {
    client.identify({
      distinctId: user.distinctId,
      properties: user.properties,
    });

    for (const evt of user.events) {
      client.capture({
        distinctId: user.distinctId,
        event: evt.name,
        timestamp: new Date(evt.timestamp),
        properties: evt.properties,
      });
    }
  }

  await client.flush();
  await client.shutdown();

  console.log("Done seeding PostHog.");
  console.table(plan.summary.byEvent);
  console.log(`Total events: ${plan.summary.events}`);
};

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
