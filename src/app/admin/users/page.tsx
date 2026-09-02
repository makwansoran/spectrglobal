import type { Metadata } from "next";
import { setOsDownloadGranted } from "@/app/actions/admin";
import { formatWhen, loadAdminOverview } from "@/lib/admin/overview";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage() {
  let overview: Awaited<ReturnType<typeof loadAdminOverview>> | null = null;
  try {
    overview = await loadAdminOverview();
  } catch {
    overview = null;
  }

  const users = (overview?.profiles ?? []).filter((profile) => profile.os_download_granted);

  return (
    <>
      <h1 className="admin-title">Users</h1>
      <p className="admin-lede">
        Accounts with Spectr OS download access. Waitlist signups are on the Waitlist page.
      </p>

      <section className="admin-panel">
        <h2>Spectr OS download</h2>
        {users.length === 0 ? (
          <p className="admin-empty">No accounts have Spectr OS download access yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((profile) => (
                <tr key={profile.id}>
                  <td>{profile.email}</td>
                  <td>{profile.full_name || "—"}</td>
                  <td>{formatWhen(profile.created_at)}</td>
                  <td>
                    <form action={setOsDownloadGranted}>
                      <input type="hidden" name="userId" value={profile.id} />
                      <input type="hidden" name="granted" value="false" />
                      <button type="submit" className="ops-get">
                        Revoke download
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
