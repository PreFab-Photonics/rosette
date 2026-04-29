import type { ReactNode } from "react";
import { AiForPhotonicsHero } from "./heroes/ai-for-photonics";

/**
 * Registry of per-post hero graphics. Keys are blog post slugs; if a post is
 * not listed here, no hero is rendered for it (see `BlogHero`).
 *
 * Heroes should share a consistent visual language — see `BlogHeroFrame` — so
 * the blog has a unified feel across posts.
 */
const heroes: Record<string, () => ReactNode> = {
  "ai-for-photonics": () => <AiForPhotonicsHero />,
};

/**
 * Custom OG image paths for blog posts. Keys are slugs; values are paths
 * relative to `public/`. Posts not listed here fall back to the auto-generated
 * OG image.
 */
export const blogOgImages: Record<string, string> = {
  "ai-for-photonics": "/blog/ai-for-photonics/og.png",
};

/**
 * Wrapper that provides the shared frame for a blog post hero: aspect ratio,
 * border, rounded corners, subtle background. Individual hero SVGs go inside.
 */
export function BlogHeroFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative mb-10 overflow-hidden rounded-xl border border-fd-border bg-fd-card dark:shadow-elevation">
      <div className="aspect-[3/1] w-full">{children}</div>
    </div>
  );
}

export function BlogHero({ slug }: { slug: string }) {
  const render = heroes[slug];
  if (!render) return null;
  return render();
}
