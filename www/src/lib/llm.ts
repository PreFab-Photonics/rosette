import {
  type PlaceholderData,
  renderPlaceholder,
} from "fumadocs-core/mdx-plugins/remark-llms.runtime";

const SITE_URL = "https://rosette.dev";
const REPOSITORY_URL = "https://github.com/PreFab-Photonics/rosette";

function attributeText(
  attributes: Record<string, unknown>,
  name: string,
): string | undefined {
  const attribute = attributes[name];

  if (typeof attribute === "string") return attribute;
  if (typeof attribute === "number" || typeof attribute === "boolean") {
    return String(attribute);
  }

  if (attribute && typeof attribute === "object" && "value" in attribute) {
    const expression = (attribute as { value?: unknown }).value;
    if (typeof expression !== "string") return undefined;

    try {
      const parsed: unknown = JSON.parse(expression);
      if (
        typeof parsed === "string" ||
        typeof parsed === "number" ||
        typeof parsed === "boolean"
      ) {
        return String(parsed);
      }
    } catch {
      if (expression.startsWith("'") && expression.endsWith("'")) {
        return expression
          .slice(1, -1)
          .replaceAll("\\'", "'")
          .replaceAll("\\\\", "\\");
      }
      return expression;
    }
  }

  return undefined;
}

function quoteBlock(content: string): string {
  return content
    .trim()
    .split("\n")
    .map((line) => (line.length > 0 ? `> ${line}` : ">"))
    .join("\n");
}

function indent(content: string): string {
  return content
    .trim()
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
}

function block(content: string): string {
  return `\n\n${content.trim()}\n\n`;
}

const placeholderRenderers = {
  Callout({ attributes, children }: PlaceholderData) {
    const title = attributeText(attributes, "title");
    const type = attributeText(attributes, "type");
    const label =
      type === "warn"
        ? "Warning"
        : type === "example"
          ? "Example"
          : type === "error"
            ? "Caution"
            : "Note";
    const heading =
      title && title.toLowerCase() !== label.toLowerCase()
        ? `${label}: ${title}`
        : (title ?? label);

    return block(quoteBlock(`**${heading}**\n\n${children}`));
  },
  Cards({ children }: PlaceholderData) {
    return block(children);
  },
  Card({ attributes, children }: PlaceholderData) {
    const title = attributeText(attributes, "title") ?? "Related page";
    const href = attributeText(attributes, "href") ?? "#";
    const description =
      attributeText(attributes, "description") ?? children.trim();

    return block(
      `- [${title}](${href})${description ? `: ${description}` : ""}`,
    );
  },
  Tabs({ children }: PlaceholderData) {
    return block(children);
  },
  Tab({ attributes, children }: PlaceholderData) {
    const value = attributeText(attributes, "value") ?? "Option";
    return block(`### ${value}\n\n${children.trim()}`);
  },
  PyFunction({ attributes, children }: PlaceholderData) {
    const name = attributeText(attributes, "name") ?? "function";
    const type = attributeText(attributes, "type") ?? "()";
    return block(
      `### \`${name}\`\n\n\`\`\`python\n${name}${type}\n\`\`\`\n\n${children.trim()}`,
    );
  },
  PyAttribute({ attributes, children }: PlaceholderData) {
    const name = attributeText(attributes, "name") ?? "attribute";
    const type = attributeText(attributes, "type") ?? "Any";
    const body = children.trim();
    return block(
      `### \`${name}\`\n\n\`\`\`python\n${name}: ${type}\n\`\`\`${body ? `\n\n${body}` : ""}`,
    );
  },
  PyParameter({ attributes, children }: PlaceholderData) {
    const name = attributeText(attributes, "name") ?? "parameter";
    const type = attributeText(attributes, "type") ?? "Any";
    const value =
      attributeText(attributes, "value") ??
      attributeText(attributes, "default");
    const defaultValue = value === undefined ? "" : `, default \`${value}\``;
    const body = children.trim();
    return block(
      `- **\`${name}\`** (\`${type}\`${defaultValue})${body ? `\n\n${indent(body)}` : ""}`,
    );
  },
  PyFunctionReturn({ attributes, children }: PlaceholderData) {
    const type = attributeText(attributes, "type") ?? "None";
    const body = children.trim();
    return block(`**Returns:** \`${type}\`${body ? `\n\n${body}` : ""}`);
  },
  div({ children }: PlaceholderData) {
    return block(children);
  },
} satisfies Record<string, (data: PlaceholderData) => string>;

export function getMarkdownUrl(pathname: string): string {
  return `${pathname}.md`;
}

export function getCanonicalUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}

export function getSourceUrl(path: string): string {
  const revision =
    process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA ?? "main";
  return `${REPOSITORY_URL}/blob/${revision}/www/content/docs/${path}`;
}

export async function renderLLMPage(options: {
  title: string;
  description?: string;
  pathname: string;
  sourcePath: string;
  processed: string;
}): Promise<string> {
  const canonicalUrl = getCanonicalUrl(options.pathname);
  const markdownUrl = getCanonicalUrl(getMarkdownUrl(options.pathname));
  const sourceUrl = getSourceUrl(options.sourcePath);
  const description =
    options.description ?? `${options.title} reference for Rosette.`;
  const channel =
    process.env.VERCEL_GIT_COMMIT_REF ?? process.env.GITHUB_REF_NAME;
  const revision = process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GITHUB_SHA;
  const content = (
    await renderPlaceholder(options.processed, placeholderRenderers)
  ).trim();
  const metadata = [
    `title: ${JSON.stringify(options.title)}`,
    `description: ${JSON.stringify(description)}`,
    `canonical_url: ${JSON.stringify(canonicalUrl)}`,
    `markdown_url: ${JSON.stringify(markdownUrl)}`,
    `source_url: ${JSON.stringify(sourceUrl)}`,
    channel ? `docs_channel: ${JSON.stringify(channel)}` : undefined,
    revision ? `docs_revision: ${JSON.stringify(revision)}` : undefined,
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  return `---
${metadata}
---

# ${options.title}

${content}`;
}

export function getMarkdownHeaders(pathname: string): HeadersInit {
  return {
    "Content-Type": "text/markdown; charset=utf-8",
    Link: `<${getCanonicalUrl(pathname)}>; rel="canonical"`,
  };
}
