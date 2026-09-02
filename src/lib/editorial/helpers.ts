export type EditorialKind = "blog" | "research";

export function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function splitParagraphs(body: string) {
  return body
    .split(/\n\s*\n/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export function defaultImage(kind: EditorialKind) {
  return kind === "blog" ? "/images/news/spectr-os-free.jpg" : "/images/industries/infrastructure.jpg";
}
