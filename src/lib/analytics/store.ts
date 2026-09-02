import { promises as fs } from "fs";
import path from "path";

export type SiteEventKind = "pageview" | "click";

export type SiteEvent = {
  id: string;
  kind: SiteEventKind;
  path: string;
  label: string;
  at: string;
};

export type LocalAccount = {
  username: string;
  role: "user" | "admin";
  createdAt: string;
  lastSeen: string;
};

type AnalyticsFile = {
  events: SiteEvent[];
  accounts: LocalAccount[];
};

const FILE = path.join(process.cwd(), "data", "site-analytics.json");
const MAX_EVENTS = 4000;

const empty: AnalyticsFile = { events: [], accounts: [] };

async function readStore(): Promise<AnalyticsFile> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<AnalyticsFile>;
    return {
      events: Array.isArray(parsed.events) ? parsed.events : [],
      accounts: Array.isArray(parsed.accounts) ? parsed.accounts : [],
    };
  } catch {
    return empty;
  }
}

async function writeStore(data: AnalyticsFile) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function recordSiteEvent(input: { kind: SiteEventKind; path: string; label?: string }) {
  const pathName = input.path.slice(0, 180) || "/";
  if (pathName.startsWith("/admin") || pathName.startsWith("/login") || pathName.startsWith("/dashboard")) {
    return;
  }
  const store = await readStore();
  store.events.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    kind: input.kind,
    path: pathName,
    label: (input.label ?? "").slice(0, 120),
    at: new Date().toISOString(),
  });
  store.events = store.events.slice(0, MAX_EVENTS);
  await writeStore(store);
}

export async function recordLocalAccount(username: string, role: "user" | "admin") {
  const store = await readStore();
  const now = new Date().toISOString();
  const existing = store.accounts.find((account) => account.username === username);
  if (existing) {
    existing.role = role;
    existing.lastSeen = now;
  } else {
    store.accounts.unshift({ username, role, createdAt: now, lastSeen: now });
  }
  await writeStore(store);
}

export async function loadAnalytics() {
  const store = await readStore();
  const now = Date.now();
  const dayMs = 1000 * 60 * 60 * 24;
  const days = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(now - (13 - index) * dayMs);
    const key = date.toISOString().slice(0, 10);
    const views = store.events.filter(
      (event) => event.kind === "pageview" && event.at.slice(0, 10) === key,
    ).length;
    const clicks = store.events.filter(
      (event) => event.kind === "click" && event.at.slice(0, 10) === key,
    ).length;
    return {
      key,
      label: date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      views,
      clicks,
    };
  });

  const last7 = now - 7 * dayMs;
  const recent = store.events.filter((event) => new Date(event.at).getTime() >= last7);

  const byPath = new Map<string, number>();
  for (const event of store.events.filter((item) => item.kind === "pageview")) {
    byPath.set(event.path, (byPath.get(event.path) ?? 0) + 1);
  }

  return {
    events: store.events,
    clicks: store.events.filter((event) => event.kind === "click"),
    accounts: store.accounts,
    days,
    totals: {
      views: store.events.filter((event) => event.kind === "pageview").length,
      clicks: store.events.filter((event) => event.kind === "click").length,
      views7d: recent.filter((event) => event.kind === "pageview").length,
      clicks7d: recent.filter((event) => event.kind === "click").length,
      users: store.accounts.filter((account) => account.role === "user").length,
    },
    topPaths: [...byPath.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([path, count]) => ({ path, count })),
  };
}
