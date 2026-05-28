"use client";

import { useState } from "react";
import { Nav } from "@/components/nav";

type FormState = "idle" | "submitting" | "done";

export function FundingClient() {
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    company: "",
    website: "",
    droneUse: "",
    quantity: "",
  });

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("submitting");
    setTimeout(() => setState("done"), 1200);
  }

  return (
    <>
      <Nav />
      <main className="flex-1 pt-[72px]">

        <section className="px-6 pb-10 pt-16 sm:px-10 lg:pb-16">
          <div className="max-w-4xl">
            <span className="label">For teams</span>
            <h1 className="display mt-5 text-5xl leading-[0.95] sm:text-7xl">
              Buy drones for work.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
              We help companies choose drone hardware for inspections, mapping,
              content production, and field teams. Tell us what you need and we
              will recommend the right setup.
            </p>
          </div>
        </section>

        <div className="grid gap-14 px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          {state === "done" ? (
            <div className="max-w-lg">
              <h2 className="display text-4xl">Request received.</h2>
              <p className="mt-4 text-muted">
                We will review your request and respond with recommended drone
                models, availability, and next steps for ordering.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
              <div>
                <span className="label">Start here</span>
                <h2 className="display mt-3 text-3xl">Tell us what you need.</h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                  Share the mission, team size, and whether you need a single
                  aircraft or a full drone program.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Your name" required>
                  <input
                    type="text"
                    required
                    placeholder="Ada Lovelace"
                    value={form.customerName}
                    onChange={(e) => set("customerName", e.target.value)}
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email"
                    required
                    placeholder="ada@company.com"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                </Field>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Company name" required>
                  <input
                    type="text"
                    required
                    placeholder="Aerial Works Ltd."
                    value={form.company}
                    onChange={(e) => set("company", e.target.value)}
                  />
                </Field>
                <Field label="Website">
                  <input
                    type="url"
                    placeholder="https://company.com"
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                  />
                </Field>
              </div>

              <Field label="How will you use the drones?" required>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your use case: filming, mapping, inspection, training, or fleet operations."
                  value={form.droneUse}
                  onChange={(e) => set("droneUse", e.target.value)}
                />
              </Field>

              <Field label="Quantity, timeline, and support needs">
                <textarea
                  rows={3}
                  placeholder="How many drones do you need, when do you need them, and do you need training or setup help?"
                  value={form.quantity}
                  onChange={(e) => set("quantity", e.target.value)}
                />
              </Field>

              <button
                type="submit"
                disabled={state === "submitting"}
                className="border border-fg bg-fg px-8 py-4 text-sm text-bg hover:opacity-80 disabled:opacity-40"
              >
                {state === "submitting" ? "Submitting…" : "Submit →"}
              </button>
            </form>
          )}

          <aside className="lg:pt-20">
            <span className="label mb-8 block">How it works</span>
            <div className="space-y-8">
            {[
              ["01", "Review", "We check the use case, budget, timing, and any training needs."],
              ["02", "Recommendation", "We send a short list of drone models and bundle options."],
              ["03", "Quote", "We confirm pricing, shipping, warranties, and support details."],
              ["04", "Delivery", "We prepare the order and help your team get ready to fly."],
            ].map(([num, title, body]) => (
              <div key={String(num)}>
                <span className="label">{num}</span>
                <h3 className="display mt-3 text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
              </div>
            ))}
            </div>
          </aside>
        </div>

      </main>
    </>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="label">
        {label}{required && <span className="ml-1 text-muted">*</span>}
      </label>
      <div className="[&_input]:w-full [&_input]:border-b [&_input]:border-border [&_input]:bg-transparent [&_input]:pb-2 [&_input]:text-sm [&_input]:outline-none [&_input]:placeholder:text-muted [&_input]:focus:border-fg [&_textarea]:w-full [&_textarea]:border [&_textarea]:border-border [&_textarea]:bg-transparent [&_textarea]:p-3 [&_textarea]:text-sm [&_textarea]:outline-none [&_textarea]:placeholder:text-muted [&_textarea]:focus:border-fg [&_textarea]:resize-none">
        {children}
      </div>
    </div>
  );
}

