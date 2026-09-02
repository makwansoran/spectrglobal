import type { Metadata } from "next";
import Link from "next/link";
import { loadAnalytics } from "@/lib/analytics/store";
import { loadAdminOverview } from "@/lib/admin/overview";
import { listBlogPosts, listResearchEssays } from "@/lib/hubs";

export const metadata: Metadata = { title: "Analytics" };

export default async function AdminAnalyticsPage() {
  const [analytics, blog, research] = await Promise.all([
    loadAnalytics(),
    listBlogPosts(),
    listResearchEssays(),
  ]);

  let waitlist = 0;
  let osUsers = 0;
  try {
    const overview = await loadAdminOverview();
    waitlist = overview.counts.waitlist;
    osUsers = overview.counts.osGranted;
  } catch {
    waitlist = 0;
    osUsers = 0;
  }

  const maxViews = Math.max(1, ...analytics.days.map((day) => day.views));

  const kpis = [
    { label: "Page views", value: analytics.totals.views, href: "/admin" },
    { label: "Views · 7 days", value: analytics.totals.views7d, href: "/admin" },
    { label: "Clicks", value: analytics.totals.clicks, href: "/admin/clicks" },
    { label: "Waitlist", value: waitlist, href: "/admin/waitlist" },
    { label: "Blog posts", value: blog.length, href: "/admin/blog" },
    { label: "Research posts", value: research.length, href: "/admin/research" },
    { label: "Users", value: osUsers, href: "/admin/users" },
  ];

  return (
    <>
      <h1 className="admin-title">Analytics</h1>
      <p className="admin-lede">Traffic, waitlist, and published work on spectr.no.</p>

      <section className="admin-kpis">
        {kpis.map((kpi) => (
          <Link key={kpi.label} href={kpi.href} className="admin-kpi">
            <span>{kpi.label}</span>
            <strong>{kpi.value}</strong>
          </Link>
        ))}
      </section>

      <section className="admin-panel">
        <h2>Page views · 14 days</h2>
        <div className="admin-chart" aria-hidden="true">
          {analytics.days.map((day) => (
            <div key={day.key} className="admin-chart__col">
              <div
                className="admin-chart__bar"
                style={{ height: `${Math.max(4, (day.views / maxViews) * 100)}%` }}
                title={`${day.label}: ${day.views}`}
              />
              <span className="admin-chart__label">{day.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-panel">
        <h2>Top pages</h2>
        {analytics.topPaths.length === 0 ? (
          <p className="admin-empty">No page views recorded yet. Browse the public site to start filling this.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Path</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              {analytics.topPaths.map((row) => (
                <tr key={row.path}>
                  <td>{row.path}</td>
                  <td>{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
