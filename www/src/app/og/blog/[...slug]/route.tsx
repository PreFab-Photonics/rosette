import { ImageResponse } from "@takumi-rs/image-response";
import { generate as DefaultImage } from "fumadocs-ui/og/takumi";
import { notFound } from "next/navigation";
import { blog, getBlogPostImage } from "@/lib/source";

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/blog/[...slug]">,
) {
  const { slug } = await params;
  // slug is ["my-post", "image.webp"] — take everything except the last segment
  const postSlug = slug.slice(0, -1);
  const page = blog.getPage(postSlug);
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage
      title={page.data.title}
      description={page.data.description}
      site="Rosette"
    />,
    {
      width: 1200,
      height: 630,
      format: "webp",
    },
  );
}

export function generateStaticParams() {
  return blog.getPages().map((page) => ({
    slug: getBlogPostImage(page).segments,
  }));
}
