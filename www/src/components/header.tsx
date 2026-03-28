"use client";

import { useSearchContext } from "fumadocs-ui/contexts/search";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navLinks = [
  { label: "Docs", href: "/docs", external: false },
  { label: "Blog", href: "/blog", external: false },
] as const;

export function Header({ trailing }: { trailing?: ReactNode }) {
  const { setOpenSearch, hotKey } = useSearchContext();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-fd-border bg-fd-background/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <a
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0 });
              }
            }}
            className="flex items-center gap-2 text-sm font-semibold tracking-tight text-fd-foreground transition-colors"
          >
            <Image
              src="/rosette-logo.png"
              alt="Rosette"
              width={28}
              height={28}
            />
            <span className="text-2xl font-[family-name:var(--font-instrument-serif)]">
              Rosette
            </span>
          </a>

          {navLinks.map((link) => {
            const isActive = !link.external && pathname.startsWith(link.href);
            return link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  isActive
                    ? "text-brand-purple dark:text-brand-purple-light"
                    : "text-fd-muted-foreground hover:text-fd-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {/* Search — icon only on mobile */}
          <button
            type="button"
            onClick={() => setOpenSearch(true)}
            className="inline-flex items-center justify-center rounded-md p-1.5 text-fd-muted-foreground transition-colors hover:text-fd-foreground md:hidden"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>

          {/* Search — full button on desktop */}
          <button
            type="button"
            onClick={() => setOpenSearch(true)}
            className="hidden h-8 items-center gap-2 rounded-md border border-fd-border bg-fd-muted px-3 text-xs text-fd-muted-foreground transition-colors hover:text-fd-foreground md:inline-flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Search
            {hotKey.length > 0 && (
              <span className="ml-1 inline-flex gap-0.5">
                {hotKey.map((k) => {
                  const keyStr =
                    typeof k.key === "string" ? k.key : String(k.display);
                  return (
                    <kbd
                      key={keyStr}
                      className="rounded border border-fd-border bg-fd-background px-1 font-mono text-[10px] text-fd-muted-foreground"
                    >
                      {k.display}
                    </kbd>
                  );
                })}
              </span>
            )}
          </button>

          <div
            className="hidden h-8 cursor-not-allowed items-center gap-1.5 rounded-md border border-brand-purple-dark/50 bg-brand-purple px-3 text-xs font-medium text-white opacity-50 shadow-sm shadow-brand-purple-dark/30 ring-1 ring-inset ring-white/15 md:inline-flex"
            title="Coming soon"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Download
          </div>

          {trailing}
        </div>
      </nav>
    </header>
  );
}
