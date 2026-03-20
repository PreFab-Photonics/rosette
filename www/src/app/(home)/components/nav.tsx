"use client";

import Image from "next/image";
import Link from "next/link";

const navLinks = [{ label: "Docs", href: "/docs", external: false }] as const;

export function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-white/90 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[hsl(0,0%,6%)]/90">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <a
          href="/"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0 });
            }
          }}
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-black/90 transition-colors hover:text-black dark:text-white/90 dark:hover:text-white"
        >
          <Image
            src="/rosette-logo.png"
            alt="Rosette"
            width={28}
            height={28}
            className=""
          />
          <span className="text-2xl font-[family-name:var(--font-instrument-serif)]">
            Rosette
          </span>
        </a>

        <div className="flex items-center gap-6">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-black/70 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-black/70 transition-colors hover:text-black dark:text-white/70 dark:hover:text-white"
              >
                {link.label}
              </Link>
            ),
          )}
          <div
            className="inline-flex h-8 cursor-not-allowed items-center gap-1.5 rounded-md border border-brand-purple-dark/50 bg-brand-purple px-3 text-xs font-medium text-white opacity-50 shadow-sm shadow-brand-purple-dark/30 ring-1 ring-inset ring-white/15"
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
        </div>
      </nav>
    </header>
  );
}
