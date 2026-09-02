import { promises as fs } from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/admin";

export type EditorialKind = "blog" | "research";

export type EditorialPost = {
  slug: string;
  date: string;
  title: string;
  dek: string;
  href: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
};

type EditorialFile = {
  blog: EditorialPost[];
  research: EditorialPost[];
};

const FILE = path.join(process.cwd(), "data", "editorial-posts.json");

const emptyFile: EditorialFile = { blog: [], research: [] };

export function slugifyTitle(title: string) {
  const slug = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug;
}

export function splitParagraphs(body: string) {
  return body
    .split(/\n\s*\n/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function hrefFor(kind: EditorialKind, slug: string) {
  return kind === "blog" ? `/blog/${slug}` : `/research/${slug}`;
}

function asPost(kind: EditorialKind, row: Partial<EditorialPost> & { slug?: string }): EditorialPost | null {
  const slug = row.slug?.trim();
  if (!slug || !row.title?.trim()) return null;
  return {
    slug,
    date: row.date?.trim() || "",
    title: row.title.trim(),
    dek: row.dek?.trim() || "",
    href: row.href?.trim() || hrefFor(kind, slug),
    image: row.image?.trim() || defaultImage(kind),
    imageAlt: row.imageAlt?.trim() || row.title.trim(),
    paragraphs: Array.isArray(row.paragraphs) ? row.paragraphs.filter(Boolean) : [],
  };
}

export function defaultImage(kind: EditorialKind) {
  return kind === "blog" ? "/images/news/spectr-os-free.jpg" : "/images/industries/infrastructure.jpg";
}

async function readFileStore(): Promise<EditorialFile> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<EditorialFile>;
    return {
      blog: Array.isArray(parsed.blog) ? parsed.blog : [],
      research: Array.isArray(parsed.research) ? parsed.research : [],
    };
  } catch {
    return emptyFile;
  }
}

async function writeFileStore(data: EditorialFile) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function tryAdminClient() {
  try {
    return createAdminClient();
  } catch {
    return null;
  }
}

type DbRow = {
  kind: EditorialKind;
  slug: string;
  date: string;
  title: string;
  dek: string;
  image: string;
  image_alt: string;
  paragraphs: string[] | string;
};

function fromDbRow(row: DbRow): EditorialPost | null {
  const paragraphs = Array.isArray(row.paragraphs)
    ? row.paragraphs
    : typeof row.paragraphs === "string"
      ? splitParagraphs(row.paragraphs)
      : [];
  return asPost(row.kind, {
    slug: row.slug,
    date: row.date,
    title: row.title,
    dek: row.dek,
    image: row.image,
    imageAlt: row.image_alt,
    paragraphs,
  });
}

async function readDbStore(kind?: EditorialKind): Promise<EditorialPost[]> {
  const admin = tryAdminClient();
  if (!admin) return [];
  let query = admin
    .from("editorial_posts")
    .select("kind, slug, date, title, dek, image, image_alt, paragraphs")
    .order("created_at", { ascending: false });
  if (kind) query = query.eq("kind", kind);
  const { data, error } = await query;
  if (error || !data) return [];
  return (data as DbRow[]).map(fromDbRow).filter((post): post is EditorialPost => Boolean(post));
}

function mergePosts(primary: EditorialPost[], secondary: EditorialPost[]) {
  const seen = new Set(primary.map((post) => post.slug));
  const extra = secondary.filter((post) => !seen.has(post.slug));
  return [...extra, ...primary];
}

export async function loadEditorialPosts(kind: EditorialKind): Promise<EditorialPost[]> {
  const [file, db] = await Promise.all([readFileStore(), readDbStore(kind)]);
  return mergePosts(file[kind], db);
}

export async function editorialSlugTaken(kind: EditorialKind, slug: string) {
  const posts = await loadEditorialPosts(kind);
  return posts.some((post) => post.slug === slug);
}

export async function saveEditorialPost(kind: EditorialKind, post: EditorialPost): Promise<{ ok: true } | { ok: false; error: string }> {
  const file = await readFileStore();
  if (file[kind].some((item) => item.slug === post.slug)) {
    return { ok: false, error: "A post with that slug already exists." };
  }

  const nextFile: EditorialFile = {
    ...file,
    [kind]: [post, ...file[kind]],
  };

  let fileOk = false;
  let dbOk = false;
  let dbError = "";

  try {
    await writeFileStore(nextFile);
    fileOk = true;
  } catch {
    fileOk = false;
  }

  const admin = tryAdminClient();
  if (admin) {
    const { error } = await admin.from("editorial_posts").insert({
      kind,
      slug: post.slug,
      date: post.date,
      title: post.title,
      dek: post.dek,
      image: post.image,
      image_alt: post.imageAlt,
      paragraphs: post.paragraphs,
    });
    if (error) dbError = error.message;
    else dbOk = true;
  }

  if (fileOk || dbOk) return { ok: true };
  return {
    ok: false,
    error: dbError || "Could not save the post. Check server write access or run the latest schema.sql.",
  };
}
