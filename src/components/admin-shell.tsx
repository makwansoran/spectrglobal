"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLink } from "@/components/logo";
import { SignOutButton } from "@/components/sign-out-button";
import "./admin-shell.css";

const nav = [{ href: "/admin/users", label: "Users" }];

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
          <BrandLink href="/admin/users" light />
        </div>
        <nav className="admin-sidebar__nav" aria-label="Admin">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={active ? "is-active" : undefined}>
                {item.label}
              </Link>
            );
          })}
          <p className="admin-sidebar__kicker">View</p>
          <Link href="/">Site</Link>
        </nav>
        <div className="admin-sidebar__foot">
          <p>{username}</p>
          <SignOutButton dark href="/login" />
        </div>
      </aside>
      <div className="admin-main">
        <div id="main-content" className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}
