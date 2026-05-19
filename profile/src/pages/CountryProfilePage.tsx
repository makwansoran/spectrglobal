import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ProfileLoading } from "../components/ProfileLoading";
import { useCountry } from "../hooks/useCountry";
import { countryFlag } from "../utils/format";
import { politicianProfilePath } from "../lib/paths";

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      {children}
    </div>
  );
}

export function CountryProfilePage() {
  const { countryId } = useParams<{ countryId: string }>();
  const { profile, politicians, loading, error } = useCountry(countryId);

  if (loading) {
    return (
      <PageShell>
        <ProfileLoading />
      </PageShell>
    );
  }

  if (error === "not_found" || (!profile && !loading)) {
    return (
      <PageShell>
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-xl font-semibold text-ink">Country not found</h1>
          <p className="mt-2 text-sm text-muted">
            {countryId ? `No profile for "${countryId}".` : "Missing country id."}
          </p>
          <a href="/index.html" className="btn-primary mt-6 inline-block no-underline">
            Back to search
          </a>
        </main>
      </PageShell>
    );
  }

  if (error || !profile) {
    return (
      <PageShell>
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-xl font-semibold text-ink">Could not load profile</h1>
          <p className="mt-2 text-sm text-muted">Try refreshing the page.</p>
        </main>
      </PageShell>
    );
  }

  const flag = profile.flagEmoji || countryFlag(profile.isoCode);

  return (
    <PageShell>
      <header className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {profile.flagUrl ? (
              <img
                src={profile.flagUrl}
                alt=""
                className="h-16 w-24 shrink-0 rounded border border-line bg-white object-cover shadow-sm"
              />
            ) : (
              <span className="text-5xl" aria-hidden>
                {flag}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Country</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink md:text-4xl">{profile.name}</h1>
              <p className="mt-2 text-lg text-muted">
                {profile.capital && <span>{profile.capital}</span>}
                {profile.capital && profile.isoCode && <span> · </span>}
                <span className="font-mono text-sm">{profile.isoCode}</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        {profile.about?.trim() && (
          <section className="mb-10">
            <h2 className="section-label">About</h2>
            <p className="text-base leading-relaxed text-muted">{profile.about}</p>
          </section>
        )}

        <section>
          <h2 className="section-label">Government</h2>
          {politicians.length === 0 ? (
            <p className="text-sm text-muted">No officials listed yet.</p>
          ) : (
            <ul className="space-y-3">
              {politicians.map((p) => (
                <li
                  key={p.slug}
                  className="spectr-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-ink">{p.name}</p>
                    <p className="mt-0.5 text-sm text-muted">{p.office}</p>
                    {p.party && <p className="mt-0.5 text-xs text-muted">{p.party}</p>}
                  </div>
                  <Link
                    to={politicianProfilePath(p.slug)}
                    className="btn-primary shrink-0 text-center text-sm no-underline sm:min-w-[8.5rem]"
                  >
                    View profile
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <SiteFooter />
    </PageShell>
  );
}
