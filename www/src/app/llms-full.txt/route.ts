import { getCanonicalUrl } from "@/lib/llm";
import { getLLMText, getOrderedDocsPages } from "@/lib/source";

export const revalidate = false;

export async function GET() {
  const pages = getOrderedDocsPages();
  const rendered = await Promise.all(pages.map(getLLMText));
  const documents = rendered.map(
    (content, index) =>
      `<!-- DOCUMENT: ${getCanonicalUrl(pages[index].url)} -->\n\n${content}`,
  );

  return new Response(documents.join("\n\n---\n\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
