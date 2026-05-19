import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ProfileLoading } from "../components/ProfileLoading";
import { usePolitician } from "../hooks/usePolitician";
import { countryProfilePath } from "../lib/paths";

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      {children}
    </div>
  );
}

export function PoliticianProfilePage() {
  const { politicianId } = useParams<{ politicianId: string }>();
  const { data: politician, loading, error } = usePolitician(politicianId);

  if (loading) {
    return (
      <PageShell>
        <ProfileLoading />
      </PageShell>
    );
  }

  if (error === "not_found" || (!politician && !loading)) {
    return (
      <PageShell>
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-xl font-semibold text-ink">Politician not found</h1>
          <p className="mt-2 text-sm text-muted">
            {politicianId ? `No profile for "${politicianId}".` : "Missing politician id."}
          </p>
          <a href="/index.html" className="btn-primary mt-6 inline-block no-underline">
            Back to search
          </a>
        </main>
      </PageShell>
    );
  }

  if (error || !politician) {
    return (
      <PageShell>
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-xl font-semibold text-ink">Could not load profile</h1>
          <p className="mt-2 text-sm text-muted">Try refreshing the page.</p>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <header className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <img
              src={
                politician.photoUrl ??
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(politician.name)}`
              }
              alt=""
              className="h-28 w-28 shrink-0 rounded-full border border-line bg-white object-cover shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Politician</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                {politician.name}
              </h1>
              {politician.office && <p className="mt-2 text-lg text-muted">{politician.office}</p>}
              {politician.party && <p className="mt-1 text-sm text-muted">{politician.party}</p>}
              {politician.countrySlug && (
                <Link
                  to={countryProfilePath(politician.countrySlug)}
                  className="btn-ghost mt-4 inline-flex no-underline"
                >
                  View {politician.countryName || politician.countrySlug}
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        {politician.bio?.trim() && (
          <section className="mb-10">
            <h2 className="section-label">About</h2>
            <p className="text-base leading-relaxed text-muted">{politician.bio}</p>
          </section>
        )}

        <section>
          <h2 className="section-label">Role</h2>
          <dl className="spectr-card grid gap-3 p-4 text-sm sm:grid-cols-2">
            {politician.office && (
              <>
                <dt className="text-muted">Office</dt>
                <dd className="font-medium text-ink">{politician.office}</dd>
              </>
            )}
            {politician.countryName && (
              <>
                <dt className="text-muted">Country</dt>
                <dd className="font-medium text-ink">{politician.countryName}</dd>
              </>
            )}
            {politician.termStart && (
              <>
                <dt className="text-muted">Term start</dt>
                <dd className="font-medium text-ink">{politician.termStart}</dd>
              </>
            )}
          </dl>
        </section>
      </main>
      <SiteFooter />
    </PageShell>
  );
}
