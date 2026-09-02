import type { Metadata } from "next";
import { formatWhen } from "@/lib/admin/overview";
import { loadAnalytics } from "@/lib/analytics/store";

export const metadata: Metadata = { title: "Clicks" };

export default async function AdminClicksPage() {
  const analytics = await loadAnalytics();
  const rows = analytics.clicks.slice(0, 200);

  return (
    <>
      <h1 className="admin-title">Clicks</h1>
      <p className="admin-lede">
        {analytics.totals.clicks7d} clicks in the last 7 days · {analytics.totals.clicks} total.
      </p>

      <section className="admin-panel">
        <h2>Recent clicks</h2>
        {rows.length === 0 ? (
          <p className="admin-empty">No clicks recorded yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Page</th>
                <th>Control</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{formatWhen(row.at)}</td>
                  <td>{row.path}</td>
                  <td>{row.label || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
