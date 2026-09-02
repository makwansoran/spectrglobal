import { promises as fs } from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/admin";
import { defaultImage, splitParagraphs, type EditorialKind } from "@/lib/editorial/helpers";

export type { EditorialKind } from "@/lib/editorial/helpers";
export { defaultImage, slugifyTitle, splitParagraphs } from "@/lib/editorial/helpers";

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
  hidden?: { blog?: string[]; research?: string[] };
};

const FILE = path.join(process.cwd(), "data", "editorial-posts.json");

const emptyFile: EditorialFile = { blog: [], research: [], hidden: { blog: [], research: [] } };

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

async function readFileStore(): Promise<EditorialFile> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<EditorialFile>;
    return {
      blog: Array.isArray(parsed.blog) ? parsed.blog : [],
      research: Array.isArray(parsed.research) ? parsed.research : [],
      hidden: {
        blog: Array.isArray(parsed.hidden?.blog) ? parsed.hidden.blog : [],
        research: Array.isArray(parsed.hidden?.research) ? parsed.hidden.research : [],
      },
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

export async function loadHiddenSlugs(kind: EditorialKind): Promise<string[]> {
  const file = await readFileStore();
  return file.hidden?.[kind] ?? [];
}

export async function loadEditorialPosts(kind: EditorialKind): Promise<EditorialPost[]> {
  const [file, db] = await Promise.all([readFileStore(), readDbStore(kind)]);
  const hidden = new Set(file.hidden?.[kind] ?? []);
  return mergePosts(file[kind], db).filter((post) => !hidden.has(post.slug));
}

export async function editorialSlugTaken(kind: EditorialKind, slug: string) {
  const posts = await loadEditorialPosts(kind);
  return posts.some((post) => post.slug === slug);
}

export async function upsertEditorialPost(
  kind: EditorialKind,
  post: EditorialPost,
  previousSlug?: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const file = await readFileStore();
  const fromSlug = previousSlug || post.slug;
  const withoutOld = file[kind].filter((item) => item.slug !== fromSlug && item.slug !== post.slug);
  const hidden = {
    blog: file.hidden?.blog ?? [],
    research: file.hidden?.research ?? [],
  };
  hidden[kind] = hidden[kind].filter((slug) => slug !== post.slug && slug !== fromSlug);

  const nextFile: EditorialFile = {
    ...file,
    hidden,
    [kind]: [post, ...withoutOld],
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
    if (fromSlug && fromSlug !== post.slug) {
      await admin.from("editorial_posts").delete().eq("kind", kind).eq("slug", fromSlug);
    }
    const { error } = await admin.from("editorial_posts").upsert(
      {
        kind,
        slug: post.slug,
        date: post.date,
        title: post.title,
        dek: post.dek,
        image: post.image,
        image_alt: post.imageAlt,
        paragraphs: post.paragraphs,
      },
      { onConflict: "kind,slug" },
    );
    if (error) dbError = error.message;
    else dbOk = true;
  }

  if (fileOk || dbOk) return { ok: true };
  return {
    ok: false,
    error: dbError || "Could not save the post.",
  };
}

export async function deleteEditorialPost(
  kind: EditorialKind,
  slug: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const file = await readFileStore();
  const hidden = {
    blog: file.hidden?.blog ?? [],
    research: file.hidden?.research ?? [],
  };
  if (!hidden[kind].includes(slug)) hidden[kind] = [...hidden[kind], slug];

  const nextFile: EditorialFile = {
    ...file,
    hidden,
    [kind]: file[kind].filter((item) => item.slug !== slug),
  };

  let fileOk = false;
  try {
    await writeFileStore(nextFile);
    fileOk = true;
  } catch {
    fileOk = false;
  }

  const admin = tryAdminClient();
  if (admin) {
    await admin.from("editorial_posts").delete().eq("kind", kind).eq("slug", slug);
  }

  if (fileOk) return { ok: true };
  return { ok: false, error: "Could not delete the post." };
}

export async function saveEditorialPost(
  kind: EditorialKind,
  post: EditorialPost,
): Promise<{ ok: true } | { ok: false; error: string }> {
  return upsertEditorialPost(kind, post);
}
