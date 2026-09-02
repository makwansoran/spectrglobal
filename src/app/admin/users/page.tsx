import type { Metadata } from "next";
import { setOsDownloadGranted } from "@/app/actions/admin";
import { formatWhen, loadAdminOverview } from "@/lib/admin/overview";
import { loadAnalytics } from "@/lib/analytics/store";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const analytics = await loadAnalytics();
  let overview: Awaited<ReturnType<typeof loadAdminOverview>> | null = null;
  try {
    overview = await loadAdminOverview();
  } catch {
    overview = null;
  }

  const accounts = analytics.accounts.filter((account) => account.role === "user");

  return (
    <>
      <h1 className="admin-title">Users</h1>
      <p className="admin-lede">Dashboard logins, waitlist, and product accounts.</p>

      <section className="admin-kpis">
        <div className="admin-kpi">
          <span>Dashboard users</span>
          <strong>{accounts.length}</strong>
        </div>
        <div className="admin-kpi">
          <span>Waitlist</span>
          <strong>{overview?.counts.waitlist ?? 0}</strong>
        </div>
        <div className="admin-kpi">
          <span>Spectr logins</span>
          <strong>{overview?.counts.spectrLogins ?? 0}</strong>
        </div>
      </section>

      <section className="admin-panel">
        <h2>Dashboard logins</h2>
        {accounts.length === 0 ? (
          <p className="admin-empty">No user dashboard logins yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Created</th>
                <th>Last seen</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => (
                <tr key={account.username}>
                  <td>{account.username}</td>
                  <td>{formatWhen(account.createdAt)}</td>
                  <td>{formatWhen(account.lastSeen)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="admin-panel">
        <h2>Waitlist</h2>
        {!overview || overview.waitlist.length === 0 ? (
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
              {overview.waitlist.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
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

      {overview && overview.profiles.length > 0 ? (
        <section className="admin-panel">
          <h2>Product accounts</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Access</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {overview.profiles.map((profile) => (
                <tr key={profile.id}>
                  <td>
                    {profile.email}
                    <div style={{ color: "#8a8a8a", marginTop: 4 }}>
                      {formatWhen(profile.created_at)}
                    </div>
                  </td>
                  <td>
                    {profile.product_access ? "Spectr" : "—"}
                    {profile.os_download_granted ? " · download granted" : " · download locked"}
                  </td>
                  <td>
                    {profile.product_access ? (
                      <form action={setOsDownloadGranted}>
                        <input type="hidden" name="userId" value={profile.id} />
                        <input
                          type="hidden"
                          name="granted"
                          value={profile.os_download_granted ? "false" : "true"}
                        />
                        <button type="submit" className="ops-get">
                          {profile.os_download_granted ? "Revoke" : "Grant download"}
                        </button>
                      </form>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}
    </>
  );
}
