import type { CompanyProfile } from "../../types/company";
import { personProfilePath } from "../../lib/paths";

export function PeopleSection({ company }: { company: CompanyProfile }) {
  if (!company.people.length) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {company.people.map((person) => {
        const profileHref = person.personSlug ? personProfilePath(person.personSlug) : null;

        return (
          <article key={person.personSlug || person.id} className="flex flex-col rounded-lg border border-line bg-white p-3 shadow-sm">
            <div className="flex flex-1 items-start gap-3">
              <img
                src={person.photoUrl ?? `https://api.dicebear.com/7.x/initials/svg?seed=${person.name}`}
                alt=""
                className="h-11 w-11 shrink-0 rounded-full border border-line object-cover bg-canvas"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-ink">{person.name}</h3>
                <p className="text-xs text-muted">{person.title}</p>
                {person.bio && (
                  <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted">{person.bio}</p>
                )}
              </div>
            </div>
            {profileHref ? (
              <a href={profileHref} className="btn-primary mt-3 block w-full text-center text-xs no-underline">
                View profile
              </a>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
