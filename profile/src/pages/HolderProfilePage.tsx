import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ProfileLoading } from "../components/ProfileLoading";
import { fetchHolder, type HolderProfile } from "../api/holders";
import { companyProfilePath } from "../lib/paths";

export function HolderProfilePage() {
  const { holderSlug } = useParams<{ holderSlug: string }>();
  const [holder, setHolder] = useState<HolderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!holderSlug) {
      setLoading(false);
      setError("not_found");
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchHolder(holderSlug)
      .then((p) => {
        if (!cancelled) setHolder(p);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [holderSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <ProfileLoading />
      </div>
    );
  }

  if (error === "not_found" || !holder) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-xl font-semibold text-ink">Organization not found</h1>
          <a href="/index.html" className="btn-primary mt-6 inline-block no-underline">
            Back to search
          </a>
        </main>
      </div>
    );
  }

  const logoUrl = holder.logoDomain
    ? `https://logo.clearbit.com/${holder.logoDomain}`
    : undefined;

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <header className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
          <div className="flex gap-4">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt=""
                className="h-14 w-14 rounded-lg border border-line bg-white object-contain p-1"
              />
            ) : (
              <span className="flex h-14 w-14 items-center justify-center rounded-lg border border-line bg-white text-lg font-bold">
                {holder.name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">
                {holder.orgTypeLabel}
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-ink">{holder.name}</h1>
              <p className="mt-1 text-sm text-muted">
                {holder.isListed && holder.listedTicker
                  ? `Listed · ${holder.listedExchange ? `${holder.listedExchange}: ` : ""}${holder.listedTicker}`
                  : "Private organization"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {holder.companySlug && (
                  <Link to={companyProfilePath(holder.companySlug)} className="btn-primary text-sm no-underline">
                    View company profile
                  </Link>
                )}
                {holder.website && (
                  <a
                    href={holder.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost text-sm no-underline"
                  >
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      {holder.about && (
        <main className="mx-auto max-w-3xl px-4 py-8 md:px-6">
          <p className="text-sm leading-relaxed text-muted">{holder.about}</p>
        </main>
      )}
      <SiteFooter />
    </div>
  );
}
