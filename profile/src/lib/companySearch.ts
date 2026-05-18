import type { CompanySearchItem } from "../api/companies";

export function normalizeQuery(q: string) {
  return q.trim().toLowerCase();
}

export function matchCompany(company: CompanySearchItem, query: string) {
  if (!query) return false;
  const name = company.name.toLowerCase();
  const legal = company.legalName.toLowerCase();
  if (name.startsWith(query) || legal.startsWith(query)) return true;
  return company.terms.some((term) => term.startsWith(query));
}

export function searchCompanies(index: CompanySearchItem[], query: string, limit = 10) {
  const q = normalizeQuery(query);
  if (!q) return [];
  return index.filter((c) => matchCompany(c, q)).slice(0, limit);
}
