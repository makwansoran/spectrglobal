import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ProfileLoading } from "../components/ProfileLoading";
import { useVessel } from "../hooks/useVessel";
import { companyProfilePath } from "../lib/paths";

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      {children}
    </div>
  );
}

function formatDwt(dwt: string | number | null) {
  if (dwt === null || dwt === undefined || dwt === "") return null;
  const n = typeof dwt === "number" ? dwt : Number(String(dwt).replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(n) || n <= 0) return String(dwt);
  return `${n.toLocaleString()} DWT`;
}

export function VesselProfilePage() {
  const { vesselId } = useParams<{ vesselId: string }>();
  const { data, loading, error } = useVessel(vesselId);

  if (loading) {
    return (
      <PageShell>
        <ProfileLoading />
      </PageShell>
    );
  }

  if (error === "not_found" || !data?.profile) {
    return (
      <PageShell>
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-xl font-semibold text-ink">Vessel not found</h1>
          <p className="mt-2 text-sm text-muted">
            {vesselId ? `No profile for "${vesselId}" in Spectr yet.` : "Missing vessel id."}
          </p>
          <a href="/index.html" className="btn-primary mt-6 inline-block no-underline">
            Back to search
          </a>
        </main>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-xl font-semibold text-ink">Could not load profile</h1>
          <p className="mt-2 text-sm text-muted">Try refreshing the page.</p>
        </main>
      </PageShell>
    );
  }

  const { profile, company } = data;
  const dwtLabel = formatDwt(profile.dwt);

  const facts: Array<[string, string]> = [];
  if (profile.typeLabel) facts.push(["Type", profile.typeLabel]);
  if (profile.flag) facts.push(["Flag", profile.flag]);
  if (profile.imo) facts.push(["IMO", profile.imo]);
  if (profile.mmsi) facts.push(["MMSI", profile.mmsi]);
  if (profile.callsign) facts.push(["Callsign", profile.callsign]);
  if (dwtLabel) facts.push(["Capacity", dwtLabel]);
  if (profile.yearBuilt) facts.push(["Built", String(profile.yearBuilt)]);
  if (profile.shipyard) facts.push(["Shipyard", profile.shipyard]);
  if (profile.scrubber) facts.push(["Scrubber", profile.scrubber]);

  return (
    <PageShell>
      <header className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-line bg-white text-2xl font-semibold tracking-tight text-ink shadow-sm">
              {profile.name?.slice(0, 2).toUpperCase() || "V"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                Vessel · {profile.typeLabel}
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink md:text-4xl">{profile.name}</h1>
              <p className="mt-2 text-lg text-muted">
                {[profile.flag, dwtLabel, profile.yearBuilt ? `Built ${profile.yearBuilt}` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {company && (
                <a
                  href={companyProfilePath(company.slug)}
                  className="btn-ghost mt-4 inline-flex no-underline"
                >
                  View {company.name}
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        {profile.route && (
          <section className="mb-10">
            <h2 className="section-label">Voyage</h2>
            <p className="text-base leading-relaxed text-muted">
              {profile.route}
              {profile.eta ? <span className="ml-2 text-sm">· ETA {profile.eta}</span> : null}
            </p>
          </section>
        )}

        {facts.length > 0 && (
          <section className="mb-10">
            <h2 className="section-label">Vessel details</h2>
            <dl className="spectr-card grid gap-3 p-4 text-sm sm:grid-cols-2">
              {facts.map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-muted">{label}</dt>
                  <dd className="font-medium text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {profile.marineTrafficUrl && (
          <section className="mb-10">
            <h2 className="section-label">External</h2>
            <a
              href={profile.marineTrafficUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex no-underline"
            >
              Track on MarineTraffic ↗
            </a>
          </section>
        )}
      </main>
      <SiteFooter />
    </PageShell>
  );
}
