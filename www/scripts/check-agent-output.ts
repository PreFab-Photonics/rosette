import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dir, "..");
const docsDir = join(root, "content", "docs");
const corpus = readFileSync(
  join(root, ".next", "server", "app", "llms-full.txt.body"),
  "utf8",
);
const apiOutput = readFileSync(
  join(root, ".next", "server", "app", "api.pyi.body"),
  "utf8",
);
const apiSource = readFileSync(
  resolve(root, "../python/rosette/api.pyi"),
  "utf8",
);

function expectedDocuments(
  directory: string,
  segments: string[] = [],
): string[] {
  const meta = JSON.parse(
    readFileSync(join(directory, "meta.json"), "utf8"),
  ) as { pages: string[] };

  return meta.pages.flatMap((entry) => {
    if (entry.startsWith("---")) return [];
    if (entry === "index" || entry === "...index") {
      return [
        `https://rosette.dev/docs${segments.length ? `/${segments.join("/")}` : ""}`,
      ];
    }

    const childDirectory = join(directory, entry);
    if (existsSync(childDirectory)) {
      return expectedDocuments(childDirectory, [...segments, entry]);
    }

    return [`https://rosette.dev/docs/${[...segments, entry].join("/")}`];
  });
}

const documents = [...corpus.matchAll(/<!-- DOCUMENT: ([^ ]+) -->/g)].map(
  (match) => match[1],
);
const expected = expectedDocuments(docsDir);

if (documents.length !== expected.length) {
  throw new Error(
    `llms-full.txt contains ${documents.length} documents; expected ${expected.length}`,
  );
}
if (new Set(documents).size !== documents.length) {
  throw new Error("llms-full.txt contains duplicate document boundaries");
}
const orderMismatch = documents.findIndex(
  (url, index) => url !== expected[index],
);
if (orderMismatch !== -1) {
  throw new Error(
    `llms-full.txt order mismatch at ${orderMismatch}: found ${documents[orderMismatch]}, expected ${expected[orderMismatch]}`,
  );
}
if (
  /<(?:Callout|Cards?|Tabs?|Tab|PyFunction|PyAttribute|PyParameter|PyFunctionReturn|div)\b|&#x/.test(
    corpus,
  )
) {
  throw new Error("llms-full.txt contains presentation-only MDX output");
}
if (apiOutput !== apiSource) {
  throw new Error("api.pyi route output differs from python/rosette/api.pyi");
}

console.log(`Agent output check passed: ${documents.length} ordered documents`);
