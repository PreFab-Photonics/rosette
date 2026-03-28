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

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <h1 className="font-[family-name:var(--font-instrument-serif)] text-4xl tracking-tight text-fd-foreground sm:text-5xl">
        Blog
      </h1>
      <p className="mt-3 text-fd-muted-foreground">
        Updates, guides, and news from the Rosette team.
      </p>

      <div className="mt-12 divide-y divide-fd-border">
        {posts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="group block py-8 first:pt-0 last:pb-0"
          >
            <time className="font-[family-name:var(--font-geist-mono)] text-xs text-fd-muted-foreground">
              {new Date(post.data.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              })}
            </time>
            <h2 className="mt-2 text-xl font-semibold text-fd-foreground transition-colors group-hover:text-brand-purple dark:group-hover:text-brand-purple-light">
              {post.data.title}
            </h2>
            {post.data.description && (
              <p className="mt-1.5 text-sm leading-relaxed text-fd-muted-foreground">
                {post.data.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
