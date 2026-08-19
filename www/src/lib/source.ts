import { blogPosts, docs } from "fumadocs-mdx:collections/server";
import { flattenTree } from "fumadocs-core/page-tree";
import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { renderLLMPage } from "@/lib/llm";

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const blog = loader({
  baseUrl: "/blog",
  source: toFumadocsSource(blogPosts, []),
});

export function getOrderedDocsPages() {
  return flattenTree(source.getPageTree().children).flatMap((node) => {
    const page = source.getNodePage(node);
    return page ? [page] : [];
  });
}

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.webp"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

export function getBlogPostImage(page: InferPageType<typeof blog>) {
  const segments = [...page.slugs, "image.webp"];

  return {
    segments,
    url: `/og/blog/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");

  return renderLLMPage({
    title: page.data.title,
    description: page.data.description,
    pathname: page.url,
    sourcePath: page.path,
    processed,
  });
}
