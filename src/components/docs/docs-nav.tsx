"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/lib/docs";

export function DocsNav() {
  const pathname = usePathname();

  return (
    <nav className="docs__nav" aria-label="Documentation">
      <p className="docs__nav-label">Docs</p>
      <ul className="docs__nav-list">
        {docsNav.map((item) => {
          const active =
            item.href === "/developers"
              ? pathname === "/developers"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href} className="docs__nav-item">
              <Link href={item.href} className={`docs__nav-link${active ? " is-active" : ""}`}>
                {item.label}
              </Link>
              {item.children && active ? (
                <ul className="docs__nav-children">
                  {item.children.map((child) => {
                    const external = child.href.startsWith("http");
                    return (
                      <li key={child.href}>
                        {external ? (
                          <a
                            href={child.href}
                            className="docs__nav-child"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {child.label}
                          </a>
                        ) : (
                          <Link href={child.href} className="docs__nav-child">
                            {child.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
