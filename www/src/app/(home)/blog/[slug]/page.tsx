import defaultMdxComponents from "fumadocs-ui/mdx";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blog, getBlogPostImage } from "@/lib/source";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost(props: Props) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();
  const Mdx = page.data.body;

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
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
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to blog
      </Link>

      <article className="mt-8">
        <time className="font-[family-name:var(--font-geist-mono)] text-xs text-fd-muted-foreground">
          {new Date(page.data.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
          })}
        </time>
        <h1 className="mt-2 font-[family-name:var(--font-instrument-serif)] text-3xl tracking-tight text-fd-foreground sm:text-4xl">
          {page.data.title}
        </h1>
        {page.data.description && (
          <p className="mt-3 text-lg text-fd-muted-foreground">
            {page.data.description}
          </p>
        )}

        <div className="prose mt-10 max-w-none">
          <Mdx
            components={{
              ...defaultMdxComponents,
              img: (props) => <ImageZoom {...(props as any)} />,
            }}
          />
        </div>
      </article>
    </div>
  );
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getBlogPostImage(page).url,
    },
  };
}
