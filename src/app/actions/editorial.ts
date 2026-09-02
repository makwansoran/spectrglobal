"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth/local-session";
import {
  defaultImage,
  saveEditorialPost,
  slugifyTitle,
  splitParagraphs,
  type EditorialKind,
} from "@/lib/editorial/store";
import { getBlogPost, getResearchEssay } from "@/lib/hubs";

export type CreatePostState = { ok: true; href: string } | { ok: false; error: string } | null;

export async function createEditorialPost(_prev: CreatePostState, formData: FormData): Promise<CreatePostState> {
  await requireAdminSession();

  const kind = String(formData.get("kind") ?? "") as EditorialKind;
  if (kind !== "blog" && kind !== "research") {
    return { ok: false, error: "Choose Blog or Research." };
  }

  const title = String(formData.get("title") ?? "").trim();
  const dek = String(formData.get("dek") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const date =
    String(formData.get("date") ?? "").trim() ||
    new Date().toLocaleString("en-GB", { month: "long", year: "numeric" });
  const image = String(formData.get("image") ?? "").trim() || defaultImage(kind);
  const imageAlt = String(formData.get("imageAlt") ?? "").trim() || title;
  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugifyTitle(slugInput || title);

  if (!title) return { ok: false, error: "Add a title." };
  if (!slug) return { ok: false, error: "Add a title that can become a URL slug." };
  if (!dek) return { ok: false, error: "Add a short dek." };
  const paragraphs = splitParagraphs(body);
  if (paragraphs.length === 0) return { ok: false, error: "Add the post body." };

  const existing = kind === "blog" ? await getBlogPost(slug) : await getResearchEssay(slug);
  if (existing) return { ok: false, error: "That slug is already in use." };

  const post = {
    slug,
    date,
    title,
    dek,
    href: kind === "blog" ? `/blog/${slug}` : `/research/${slug}`,
    image,
    imageAlt,
    paragraphs,
  };

  const saved = await saveEditorialPost(kind, post);
  if (!saved.ok) return saved;

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/research");
  revalidatePath(post.href);
  revalidatePath("/admin");

  return { ok: true, href: post.href };
}
