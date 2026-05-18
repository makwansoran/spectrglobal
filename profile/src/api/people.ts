import type { PersonProfile, PersonSearchItem } from "../types/person";

const apiBase = import.meta.env.VITE_API_BASE ?? "";

export async function fetchPeopleIndex(): Promise<PersonSearchItem[]> {
  const res = await fetch(`${apiBase}/api/people`);
  if (!res.ok) throw new Error("Failed to load people");
  return res.json();
}

export async function fetchPerson(slug: string): Promise<PersonProfile> {
  const res = await fetch(`${apiBase}/api/people/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("not_found");
    throw new Error("Failed to load person");
  }
  const data = await res.json();
  return data.profile;
}
