import type { Metadata } from "next";
import Link from "next/link";
import { blog } from "@/lib/source";

export const metadata: Metadata = {
  title: "Blog",
  description: "Updates, guides, and news from the Rosette team.",
};

export default function BlogIndex() {
  const posts = blog
    .getPages()
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    );

  const [featured, ...rest] = posts;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-[family-name:var(--font-instrument-serif)] text-4xl tracking-tight text-fd-foreground italic sm:text-5xl">
          From the Blog
        </h1>
        <p className="mt-3 text-fd-muted-foreground">
          Updates, guides, and news from the Rosette team.
        </p>
      </div>

      {/* Featured latest post */}
      {featured && (
        <Link
          href={featured.url}
          className="group mt-14 block rounded-xl border border-fd-border p-6 transition-colors hover:border-fd-ring sm:p-8"
        >
          <div className="flex items-center gap-3">
            <time className="font-[family-name:var(--font-geist-mono)] text-xs text-fd-muted-foreground">
              {new Date(featured.data.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              })}
            </time>
            <span className="rounded-full bg-brand-purple/10 px-2.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-[10px] font-medium text-brand-purple uppercase dark:bg-brand-purple-light/10 dark:text-brand-purple-light">
              Latest
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-fd-foreground transition-colors group-hover:text-brand-purple dark:group-hover:text-brand-purple-light sm:text-3xl">
            {featured.data.title}
          </h2>
          {featured.data.description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fd-muted-foreground sm:text-base">
              {featured.data.description}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-purple transition-colors dark:text-brand-purple-light">
            Read post
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
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </span>
        </Link>
      )}

      {/* Remaining posts */}
      {rest.length > 0 && (
        <div className="mt-12">
          <div className="divide-y divide-fd-border border-t border-fd-border">
            {rest.map((post) => (
              <Link
                key={post.url}
                href={post.url}
                className="group flex items-baseline justify-between gap-4 py-4"
              >
                <h3 className="text-sm font-medium text-fd-foreground transition-colors group-hover:text-brand-purple dark:group-hover:text-brand-purple-light sm:text-base">
                  {post.data.title}
                </h3>
                <time className="shrink-0 font-[family-name:var(--font-geist-mono)] text-xs text-fd-muted-foreground">
                  {new Date(post.data.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </time>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
