import type { ReactNode } from "react";
import { AiForPhotonicsHero } from "./heroes/ai-for-photonics";
import { NotesOnLayoutEditorsHero } from "./heroes/notes-on-layout-editors";

/**
 * Registry of per-post hero graphics. Keys are blog post slugs; if a post is
 * not listed here, no hero is rendered for it (see `BlogHero`).
 *
 * Heroes should share a consistent visual language — see `BlogHeroFrame` — so
 * the blog has a unified feel across posts.
 */
const heroes: Record<string, () => ReactNode> = {
  "ai-for-photonics": () => <AiForPhotonicsHero />,
  "notes-on-layout-editors": () => <NotesOnLayoutEditorsHero />,
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
 *
 * The default aspect ratio is 3:1; pass `aspect` (e.g. "2/1", "5/2") to
 * override per-hero.
 */
export function BlogHeroFrame({
  children,
  aspect = "3/1",
}: {
  children: ReactNode;
  aspect?: string;
}) {
  return (
    <div
      className="relative mb-10 w-full overflow-hidden rounded-xl border border-fd-border bg-fd-card dark:shadow-elevation"
      style={{ aspectRatio: aspect }}
    >
      {children}
    </div>
  );
}

export function BlogHero({ slug }: { slug: string }) {
  const render = heroes[slug];
  if (!render) return null;
  return render();
}
