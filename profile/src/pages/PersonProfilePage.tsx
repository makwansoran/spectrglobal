import { useParams } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { ProfileLoading } from "../components/ProfileLoading";
import { usePerson } from "../hooks/usePerson";
import { companyProfilePath } from "../lib/paths";

export function PersonProfilePage() {
  const { personId } = useParams<{ personId: string }>();
  const { data: person, loading, error } = usePerson(personId);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <ProfileLoading />
      </div>
    );
  }

  if (error === "not_found" || (!person && !loading)) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-xl font-semibold text-ink">Person not found</h1>
          <p className="mt-2 text-sm text-muted">
            {personId ? `No profile for "${personId}" in Spectr yet.` : "Missing person id in the URL."}
          </p>
          <a href="/index.html" className="btn-primary mt-6 inline-block no-underline">
            Back to search
          </a>
        </main>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-xl font-semibold text-ink">Could not load profile</h1>
          <p className="mt-2 text-sm text-muted">Try refreshing the page.</p>
          <a href="/index.html" className="btn-primary mt-6 inline-block no-underline">
            Back to search
          </a>
        </main>
      </div>
    );
  }

  const primaryCompany = person.currentCompanySlug
    ? {
        slug: person.currentCompanySlug,
        name: person.currentCompanyName || person.currentCompanySlug,
        title:
          person.currentTitle ||
          person.affiliations.find((a) => a.companySlug === person.currentCompanySlug)?.title,
      }
    : person.affiliations[0]
      ? {
          slug: person.affiliations[0].companySlug,
          name: person.affiliations[0].companyName,
          title: person.affiliations[0].title,
        }
      : null;

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <header className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <img
              src={person.photoUrl ?? `https://api.dicebear.com/7.x/initials/svg?seed=${person.name}`}
              alt=""
              className="h-28 w-28 shrink-0 rounded-full border border-line bg-white object-cover shadow-sm"
            />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted">Person</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink md:text-4xl">{person.name}</h1>
              {primaryCompany?.title && <p className="mt-2 text-lg text-muted">{primaryCompany.title}</p>}
              {primaryCompany && (
                <a
                  href={companyProfilePath(primaryCompany.slug)}
                  className="btn-ghost mt-4 inline-flex no-underline"
                >
                  View {primaryCompany.name}
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        {person.bio?.trim() && (
          <section className="mb-10">
            <h2 className="section-label">About</h2>
            <p className="text-base leading-relaxed text-muted">{person.bio}</p>
          </section>
        )}

        {person.affiliations.length > 0 && (
          <section>
            <h2 className="section-label">Companies</h2>
            <ul className="space-y-3">
              {person.affiliations.map((a) => (
                <li
                  key={a.companySlug}
                  className="spectr-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-ink">{a.companyName}</p>
                    <p className="mt-0.5 text-sm text-muted">{a.title}</p>
                  </div>
                  <a
                    href={companyProfilePath(a.companySlug)}
                    className="btn-primary shrink-0 text-center text-sm no-underline sm:min-w-[8.5rem]"
                  >
                    View company
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
