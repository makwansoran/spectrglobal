import type { Metadata } from "next";
import Link from "next/link";
import { setOsDownloadGranted } from "@/app/actions/admin";
import { AdminPostForm } from "@/components/admin-post-form";
import { BrandLink } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";
import { requireAdminSession } from "@/lib/auth/local-session";
import { formatWhen, loadAdminOverview } from "@/lib/admin/overview";
import { listBlogPosts, listResearchEssays } from "@/lib/hubs";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminPage() {
  const session = await requireAdminSession();
  const [blog, research] = await Promise.all([listBlogPosts(), listResearchEssays()]);

  let overview: Awaited<ReturnType<typeof loadAdminOverview>> | null = null;
  try {
    overview = await loadAdminOverview();
  } catch {
    overview = null;
  }

  return (
    <div className="ops min-h-screen bg-white">
      <header className="ops-bar">
        <BrandLink href="/admin" />
        <div className="flex items-center gap-4">
          <Link href="/blog" className="text-sm text-[#6b6b6b] hover:text-[#0a0a0a]">
            Blog
          </Link>
          <Link href="/research" className="text-sm text-[#6b6b6b] hover:text-[#0a0a0a]">
            Research
          </Link>
          <SignOutButton dark href="/login" />
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <p className="ops-kicker">Admin</p>
        <h1 className="ops-title">Publish</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b6b6b]">
          Signed in as {session.username}. Password only — no 2FA. Create blog posts and research essays
          below.
        </p>

        <section className="mt-10 max-w-2xl border border-black/10 p-6">
          <p className="ops-kicker">New post</p>
          <h2 className="mt-2 text-xl font-medium tracking-[-0.03em] text-[#0a0a0a]">
            Blog or research
          </h2>
          <AdminPostForm />
        </section>

        <section className="mt-14 grid gap-10 md:grid-cols-2">
          <PostList title="Blog" posts={blog} />
          <PostList title="Research" posts={research} />
        </section>

        {overview ? <Overview overview={overview} /> : null}
      </main>
    </div>
  );
}

function PostList({
  title,
  posts,
}: {
  title: string;
  posts: { slug: string; title: string; date: string; href: string }[];
}) {
  return (
    <div>
      <p className="ops-kicker">{title}</p>
      <ul className="mt-4 divide-y divide-black/10 border-y border-black/10">
        {posts.map((post) => (
          <li key={`${title}-${post.slug}`} className="py-4">
            <a href={post.href} className="font-medium text-[#0a0a0a] underline-offset-4 hover:underline">
              {post.title}
            </a>
            <p className="mt-1 text-sm text-[#6b6b6b]">{post.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Overview({ overview }: { overview: Awaited<ReturnType<typeof loadAdminOverview>> }) {
  const { counts } = overview;
  const stats = [
    { label: "Waitlist", value: counts.waitlist },
    { label: "Career applications", value: counts.careers },
    { label: "Contact inquiries", value: counts.contacts },
    { label: "Spectr logins", value: counts.spectrLogins },
    { label: "Careers logins", value: counts.careersLogins },
    { label: "OS downloads granted", value: counts.osGranted },
  ];

  return (
    <>
      <section className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-black/10 p-5">
            <p className="ops-kicker">{stat.label}</p>
            <p className="mt-2 text-3xl font-medium tracking-[-0.04em] text-[#0a0a0a]">{stat.value}</p>
          </div>
        ))}
      </section>

      {!overview.storageReady ? (
        <p className="mt-6 border border-black/10 bg-[#fafafa] px-4 py-3 text-sm text-[#6b6b6b]">
          Waitlist and applications are not stored yet. Run the latest <code>supabase/schema.sql</code> in
          the SQL editor, then new submissions will show here.
        </p>
      ) : null}

      <Section title="Waitlist" empty="No waitlist signups yet.">
        {overview.waitlist.map((row) => (
          <li key={row.id} className="grid gap-1 py-4 sm:grid-cols-[1fr_1fr_auto]">
            <div>
              <p className="font-medium text-[#0a0a0a]">{row.name}</p>
              <p className="text-sm text-[#6b6b6b]">{row.email}</p>
            </div>
            <p className="text-sm text-[#6b6b6b]">
              {row.company} · {row.country}
            </p>
            <p className="text-sm text-[#6b6b6b]">{formatWhen(row.created_at)}</p>
            <p className="sm:col-span-3 text-sm leading-6 text-[#3d3d3d]">{row.purpose}</p>
          </li>
        ))}
      </Section>

      <Section title="Career applications" empty="No career applications yet.">
        {overview.careers.map((row) => (
          <InquiryItem key={row.id} row={row} />
        ))}
      </Section>

      <Section title="Contact and other inquiries" empty="No contact inquiries yet.">
        {overview.contacts.map((row) => (
          <InquiryItem key={row.id} row={row} />
        ))}
      </Section>

      <section className="mt-14">
        <p className="ops-kicker">All logins</p>
        {overview.profiles.length === 0 ? (
          <p className="mt-4 text-sm text-[#6b6b6b]">No accounts yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-black/10 border-y border-black/10">
            {overview.profiles.map((profile) => (
              <li key={profile.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div>
                  <p className="font-medium text-[#0a0a0a]">{profile.email}</p>
                  <p className="mt-1 text-sm text-[#6b6b6b]">
                    {[profile.full_name, formatWhen(profile.created_at)].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-1 text-sm text-[#6b6b6b]">
                    {profile.product_access ? "Spectr" : null}
                    {profile.product_access && profile.careers_access ? " · " : null}
                    {profile.careers_access ? "Careers" : null}
                    {!profile.product_access && !profile.careers_access ? "No access flags" : null}
                    {" · "}
                    {profile.os_download_granted ? "OS download granted" : "OS download locked"}
                  </p>
                </div>
                {profile.product_access ? (
                  <form action={setOsDownloadGranted}>
                    <input type="hidden" name="userId" value={profile.id} />
                    <input
                      type="hidden"
                      name="granted"
                      value={profile.os_download_granted ? "false" : "true"}
                    />
                    <button type="submit" className="ops-get">
                      {profile.os_download_granted ? "Revoke download" : "Grant download"}
                    </button>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function Section({
  title,
  empty,
  children,
}: {
  title: string;
  empty: string;
  children: React.ReactNode;
}) {
  const items = Array.isArray(children) ? children : [children];
  const hasItems = items.filter(Boolean).length > 0;

  return (
    <section className="mt-14">
      <p className="ops-kicker">{title}</p>
      {hasItems ? (
        <ul className="mt-4 divide-y divide-black/10 border-y border-black/10">{children}</ul>
      ) : (
        <p className="mt-4 text-sm text-[#6b6b6b]">{empty}</p>
      )}
    </section>
  );
}

function InquiryItem({
  row,
}: {
  row: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    organization: string;
    product: string;
    message: string;
    country: string;
    work_url: string;
    created_at: string;
  };
}) {
  const name = `${row.first_name} ${row.last_name}`.trim();
  return (
    <li className="grid gap-1 py-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-medium text-[#0a0a0a]">{name || row.email}</p>
        <p className="text-sm text-[#6b6b6b]">{formatWhen(row.created_at)}</p>
      </div>
      <p className="text-sm text-[#6b6b6b]">
        {row.email}
        {row.organization ? ` · ${row.organization}` : ""}
        {row.country ? ` · ${row.country}` : ""}
      </p>
      <p className="text-sm text-[#6b6b6b]">{row.product}</p>
      <p className="text-sm leading-6 text-[#3d3d3d]">{row.message}</p>
      {row.work_url ? (
        <a href={row.work_url} className="text-sm underline underline-offset-4" target="_blank" rel="noreferrer">
          {row.work_url}
        </a>
      ) : null}
    </li>
  );
}
