"use client";

import { useActionState, useState } from "react";
import { createEditorialPost, type CreatePostState } from "@/app/actions/editorial";
import { AdminEssayComposer } from "@/components/admin-essay-composer";

const initial: CreatePostState = null;

export function AdminPostForm({ kind }: { kind?: "blog" | "research" }) {
  const [state, action, pending] = useActionState(createEditorialPost, initial);
  const [body, setBody] = useState("");

  return (
    <form action={action} className="mt-6 grid gap-4">
      {kind ? (
        <input type="hidden" name="kind" value={kind} />
      ) : (
        <fieldset className="flex flex-wrap gap-4">
          <legend className="sr-only">Post type</legend>
          <label className="flex items-center gap-2 text-sm text-[#0a0a0a]">
            <input type="radio" name="kind" value="blog" defaultChecked />
            Blog
          </label>
          <label className="flex items-center gap-2 text-sm text-[#0a0a0a]">
            <input type="radio" name="kind" value="research" />
            Research
          </label>
        </fieldset>
      )}

      <label className="grid gap-1 text-sm text-[#3d3d3d]">
        Title
        <input name="title" required className="field" placeholder="Title" />
      </label>

      <label className="grid gap-1 text-sm text-[#3d3d3d]">
        URL slug (optional)
        <input name="slug" className="field" placeholder="generated-from-title" />
      </label>

      <label className="grid gap-1 text-sm text-[#3d3d3d]">
        Date
        <input
          name="date"
          className="field"
          placeholder="September 2026"
          defaultValue={new Date().toLocaleString("en-GB", { month: "long", year: "numeric" })}
        />
      </label>

      <label className="grid gap-1 text-sm text-[#3d3d3d]">
        Dek
        <input name="dek" required className="field" placeholder="One-line summary" />
      </label>

      <AdminEssayComposer
        body={body}
        onChange={setBody}
        placeholder="Write the post. Separate paragraphs with a blank line. Drop a figure here."
      />

      <label className="grid gap-1 text-sm text-[#3d3d3d]">
        Image path
        <input name="image" className="field" placeholder="/images/news/spectr-os-free.jpg" />
      </label>

      <label className="grid gap-1 text-sm text-[#3d3d3d]">
        Image alt
        <input name="imageAlt" className="field" placeholder="Describe the image" />
      </label>

      {state && !state.ok ? (
        <p role="alert" className="text-sm text-[#b42318]">
          {state.error}
        </p>
      ) : null}

      {state?.ok ? (
        <p className="text-sm text-[#0a0a0a]">
          Published.{" "}
          <a href={state.href} className="underline underline-offset-4">
            View post
          </a>
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="ops-get w-fit disabled:opacity-60">
        {pending ? "Publishing…" : "Publish"}
      </button>
    </form>
  );
}
