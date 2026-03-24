"use client";

import { Header } from "@/components/header";

function SidebarToggle() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("toggle-docs-sidebar"))}
      className="inline-flex items-center justify-center rounded-md p-1.5 text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-foreground md:hidden"
      aria-label="Toggle sidebar"
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
        role="img"
      >
        <title>Toggle sidebar</title>
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M15 3v18" />
      </svg>
    </button>
  );
}

export function DocsHeader() {
  return <Header trailing={<SidebarToggle />} />;
}
