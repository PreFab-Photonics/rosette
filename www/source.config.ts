import {
  type LLMsOptions,
  placeholder,
} from "fumadocs-core/mdx-plugins/remark-llms";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import {
  defineCollections,
  defineConfig,
  defineDocs,
} from "fumadocs-mdx/config";
import { z } from "zod";

const llmComponents = new Set([
  "Callout",
  "Cards",
  "Card",
  "Tabs",
  "Tab",
  "PyFunction",
  "PyAttribute",
  "PyParameter",
  "PyFunctionReturn",
  "div",
]);

const stringifyLLMComponent: NonNullable<LLMsOptions["stringify"]> = (
  node,
  parent,
  state,
  info,
) => {
  if (
    (node.type !== "mdxJsxFlowElement" && node.type !== "mdxJsxTextElement") ||
    !node.name ||
    !llmComponents.has(node.name)
  ) {
    return undefined;
  }

  if (node.type === "mdxJsxTextElement") {
    return placeholder(node, parent, state, info);
  }

  const attributes: Record<string, unknown> = {};
  for (const attribute of node.attributes) {
    if (attribute.type !== "mdxJsxExpressionAttribute") {
      attributes[attribute.name] = attribute.value;
    }
  }

  // The built-in helper uses phrasing serialization; flow serialization keeps
  // paragraphs, lists, and code fences separated inside block components.
  return `\0${JSON.stringify({
    name: node.name,
    children: state.containerFlow(node, info),
    attributes,
  })}\0`;
};

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/docs/mdx/collections
export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: pageSchema,
    postprocess: {
      includeProcessedMarkdown: {
        headingIds: false,
        stringify: stringifyLLMComponent,
      },
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export const blogPosts = defineCollections({
  type: "doc",
  dir: "content/blog",
  schema: pageSchema.extend({
    date: z.string().date().or(z.date()),
  }),
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
