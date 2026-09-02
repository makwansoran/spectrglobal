"use client";

import { useActionState, useMemo, useState, useTransition } from "react";
import {
  createEditorialPost,
  deleteEditorialPostAction,
  updateEditorialPost,
  type CreatePostState,
} from "@/app/actions/editorial";
import { AdminEssayComposer } from "@/components/admin-essay-composer";
import { EssayBody } from "@/components/essay-body";
import { defaultImage, slugifyTitle, splitParagraphs } from "@/lib/editorial/helpers";

type Post = {
  slug: string;
  date: string;
  title: string;
  dek: string;
  href: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
};

type Tab = "new" | "preview" | "manage";

const emptyDraft = {
  title: "",
  slug: "",
  date: new Date().toLocaleString("en-GB", { month: "long", year: "numeric" }),
  dek: "",
  body: "",
  image: defaultImage("research"),
  imageAlt: "",
};

export function AdminResearchWorkspace({ posts }: { posts: Post[] }) {
  const [tab, setTab] = useState<Tab>("new");
  const [draft, setDraft] = useState(emptyDraft);
  const [previousSlug, setPreviousSlug] = useState("");
  const [pendingDelete, startDelete] = useTransition();
  const [createState, createAction, creating] = useActionState(createEditorialPost, null as CreatePostState);
  const [updateState, updateAction, updating] = useActionState(updateEditorialPost, null as CreatePostState);

  const preview = useMemo(() => {
    const title = draft.title.trim() || "Untitled essay";
    const slug = slugifyTitle(draft.slug || draft.title) || "preview";
    return {
      title,
      date: draft.date.trim() || emptyDraft.date,
      dek: draft.dek.trim(),
      image: draft.image.trim() || defaultImage("research"),
      imageAlt: draft.imageAlt.trim() || title,
      paragraphs: splitParagraphs(draft.body),
      href: `/research/${slug}`,
    };
  }, [draft]);

  const state = previousSlug ? updateState : createState;
  const pending = previousSlug ? updating : creating;

  function setField(name: keyof typeof emptyDraft, value: string) {
    setDraft((current) => ({ ...current, [name]: value }));
  }

  function editPost(post: Post) {
    setDraft({
      title: post.title,
      slug: post.slug,
      date: post.date,
      dek: post.dek,
      body: post.paragraphs.join("\n\n"),
      image: post.image,
      imageAlt: post.imageAlt,
    });
    setPreviousSlug(post.slug);
    setTab("new");
  }

  function resetDraft() {
    setDraft(emptyDraft);
    setPreviousSlug("");
  }

  return (
    <>
      <nav className="admin-localnav" aria-label="Research posts">
        <button type="button" className={tab === "new" ? "is-active" : undefined} onClick={() => setTab("new")}>
          New research post
        </button>
        <button type="button" className={tab === "preview" ? "is-active" : undefined} onClick={() => setTab("preview")}>
          Preview
        </button>
        <button type="button" className={tab === "manage" ? "is-active" : undefined} onClick={() => setTab("manage")}>
          Manage
        </button>
      </nav>

      {tab === "new" ? (
        <section className="admin-panel">
          <h2>{previousSlug ? "Edit research essay" : "New research essay"}</h2>
          {previousSlug ? (
            <p className="admin-lede" style={{ marginTop: 8 }}>
              Editing {previousSlug}.{" "}
              <button type="button" className="admin-text-button" onClick={resetDraft}>
                Start a new post instead
              </button>
            </p>
          ) : null}
          <form action={previousSlug ? updateAction : createAction} className="mt-6 grid gap-4">
            <input type="hidden" name="kind" value="research" />
            {previousSlug ? <input type="hidden" name="previousSlug" value={previousSlug} /> : null}
            <label className="grid gap-1 text-sm text-[#3d3d3d]">
              Title
              <input
                name="title"
                required
                className="field"
                placeholder="Title"
                value={draft.title}
                onChange={(event) => setField("title", event.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm text-[#3d3d3d]">
              URL slug (optional)
              <input
                name="slug"
                className="field"
                placeholder="generated-from-title"
                value={draft.slug}
                onChange={(event) => setField("slug", event.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm text-[#3d3d3d]">
              Date
              <input
                name="date"
                className="field"
                placeholder="September 2026"
                value={draft.date}
                onChange={(event) => setField("date", event.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm text-[#3d3d3d]">
              Dek
              <input
                name="dek"
                required
                className="field"
                placeholder="One-line summary"
                value={draft.dek}
                onChange={(event) => setField("dek", event.target.value)}
              />
            </label>
            <AdminEssayComposer body={draft.body} onChange={(value) => setField("body", value)} />
            <label className="grid gap-1 text-sm text-[#3d3d3d]">
              Image path
              <input
                name="image"
                className="field"
                placeholder="/images/industries/infrastructure.jpg"
                value={draft.image}
                onChange={(event) => setField("image", event.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm text-[#3d3d3d]">
              Image alt
              <input
                name="imageAlt"
                className="field"
                placeholder="Describe the image"
                value={draft.imageAlt}
                onChange={(event) => setField("imageAlt", event.target.value)}
              />
            </label>
            {state && !state.ok ? (
              <p role="alert" className="text-sm text-[#b42318]">
                {state.error}
              </p>
            ) : null}
            {state?.ok ? (
              <p className="text-sm text-[#0a0a0a]">
                Saved.{" "}
                <a href={state.href} className="underline underline-offset-4">
                  View live
                </a>
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <button type="submit" disabled={pending} className="ops-get w-fit disabled:opacity-60">
                {pending ? "Saving…" : previousSlug ? "Save changes" : "Publish"}
              </button>
              <button type="button" className="ops-signout" onClick={() => setTab("preview")}>
                Preview
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {tab === "preview" ? (
        <section className="admin-panel admin-preview">
          <h2>Preview</h2>
          <p className="admin-lede" style={{ marginTop: 8 }}>
            This is how the essay will look. It is not live until you publish.
          </p>
          <article className="admin-preview__article">
            <div className="admin-preview__image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview.image} alt={preview.imageAlt} />
            </div>
            <p className="admin-preview__meta">{preview.date}</p>
            <h3>{preview.title}</h3>
            {preview.dek ? <p className="admin-preview__dek">{preview.dek}</p> : null}
            {preview.paragraphs.length === 0 ? (
              <p className="admin-empty">Add a title and body on New research post to preview.</p>
            ) : (
              <EssayBody paragraphs={preview.paragraphs} />
            )}
          </article>
        </section>
      ) : null}

      {tab === "manage" ? (
        <section className="admin-panel">
          <h2>Manage research posts</h2>
          {posts.length === 0 ? (
            <p className="admin-empty">No research essays yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.slug}>
                    <td>
                      <a href={post.href}>{post.title}</a>
                    </td>
                    <td>{post.date}</td>
                    <td>
                      <div className="admin-row-actions">
                        <button type="button" className="ops-signout" onClick={() => editPost(post)}>
                          Edit
                        </button>
                        <form
                          action={(formData) => {
                            startDelete(() => deleteEditorialPostAction(formData));
                          }}
                        >
                          <input type="hidden" name="kind" value="research" />
                          <input type="hidden" name="slug" value={post.slug} />
                          <button
                            type="submit"
                            className="ops-signout"
                            disabled={pendingDelete}
                            onClick={(event) => {
                              if (!confirm(`Delete “${post.title}”?`)) event.preventDefault();
                            }}
                          >
                            Delete
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      ) : null}
    </>
  );
}
