import type { Metadata } from "next";
import { formatWhen, loadAdminOverview } from "@/lib/admin/overview";

export const metadata: Metadata = { title: "Waitlist" };

export default async function AdminWaitlistPage() {
  let overview: Awaited<ReturnType<typeof loadAdminOverview>> | null = null;
  try {
    overview = await loadAdminOverview();
  } catch {
    overview = null;
  }

  const rows = overview?.waitlist ?? [];

  return (
    <>
      <h1 className="admin-title">Waitlist</h1>
      <p className="admin-lede">{rows.length} signups. This list is waitlist only — not Spectr OS users.</p>

      <section className="admin-panel">
        <h2>Signups</h2>
        {rows.length === 0 ? (
          <p className="admin-empty">No waitlist signups yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>
                    {row.name}
                    {row.purpose ? (
                      <div style={{ color: "#8a8a8a", marginTop: 4 }}>{row.purpose}</div>
                    ) : null}
                  </td>
                  <td>{row.email}</td>
                  <td>
                    {row.company}
                    {row.country ? ` · ${row.country}` : ""}
                  </td>
                  <td>{formatWhen(row.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
