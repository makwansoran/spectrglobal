import type { CompanyProfile } from "../../types/company";

export function AboutSection({ company }: { company: CompanyProfile }) {
  if (!company.about?.trim()) return null;
  return <p className="max-w-3xl text-base leading-relaxed text-muted">{company.about}</p>;
}
