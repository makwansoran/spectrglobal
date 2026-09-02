"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLink } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";
import "./admin-shell.css";

const nav = [
  { href: "/admin", label: "Analytics" },
  { href: "/admin/clicks", label: "Clicks" },
  { href: "/admin/research", label: "Research posts" },
  { href: "/admin/blog", label: "Blog posts" },
  { href: "/admin/users", label: "Users" },
];

export function AdminShell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <BrandLink href="/admin" light />
        </div>
        <nav className="admin-sidebar__nav" aria-label="Admin">
          {nav.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={active ? "is-active" : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar__foot">
          <p>{username}</p>
          <SignOutButton dark href="/login" />
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-top">
          <p>Admin dashboard</p>
          <div className="admin-top__links">
            <Link href="/">Site</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/research">Research</Link>
          </div>
        </header>
        <div id="main-content" className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
