import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="px-5 pb-20 pt-32 sm:px-8 lg:pb-28 lg:pt-36">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.06em] sm:text-7xl">
              Send a request.
            </h1>

            <form className="mt-12 space-y-6">
              <Field label="Name">
                <input name="name" type="text" required autoComplete="name" />
              </Field>

              <Field label="Address">
                <input name="address" type="text" required autoComplete="street-address" />
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Email">
                  <input name="email" type="email" required autoComplete="email" />
                </Field>
                <Field label="Phone Number">
                  <input name="phone" type="tel" required autoComplete="tel" />
                </Field>
              </div>

              <Field label="Product">
                <select name="product" required defaultValue="">
                  <option value="" disabled>
                    Select a product
                  </option>
                  <option value="attack">ATTACK</option>
                  <option value="recon">RECON</option>
                  <option value="jammer">JAMMER</option>
                </select>
              </Field>

              <Field label="Message">
                <textarea name="message" required rows={6} />
              </Field>

              <button
                type="submit"
                className="bg-fg px-8 py-4 text-sm font-medium text-bg hover:opacity-80"
              >
                Submit
              </button>
            </form>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label block">{label}</span>
      <div className="mt-3 [&_input]:w-full [&_input]:border [&_input]:border-border [&_input]:bg-bg [&_input]:px-4 [&_input]:py-3 [&_input]:text-base [&_input]:outline-none [&_input]:focus:border-fg [&_select]:w-full [&_select]:appearance-none [&_select]:border [&_select]:border-border [&_select]:bg-bg [&_select]:px-4 [&_select]:py-3 [&_select]:text-base [&_select]:outline-none [&_select]:focus:border-fg [&_textarea]:w-full [&_textarea]:resize-none [&_textarea]:border [&_textarea]:border-border [&_textarea]:bg-bg [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:text-base [&_textarea]:outline-none [&_textarea]:focus:border-fg">
        {children}
      </div>
    </label>
  );
}
