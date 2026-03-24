/**
 * Generate Python API reference MDX pages from the fumapy-generate JSON output.
 *
 * Usage:
 *   1. uv run fumapy-generate rosette --dir .   (produces rosette.json)
 *   2. node scripts/generate-api-docs.mjs        (converts JSON -> MDX in content/docs/api-reference/)
 *
 * Or use the npm script:
 *   bun run generate:api
 */

import { rimraf } from "rimraf";
import * as Python from "fumadocs-python";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const jsonPath = path.resolve(import.meta.dirname, "../rosette.json");
const outDir = path.resolve(
  import.meta.dirname,
  "../content/docs/api-reference",
);

// ---------------------------------------------------------------------------
// Post-processing: fix formatting issues in generated MDX
//
// fumadocs-python's converter has several issues with Python docstring content:
//   1. Indented code blocks (4-space Python convention) render as plain text
//   2. Lines starting with # inside <Callout> render as MDX headings
//   3. Doctest-style code (>>>) in <Callout> isn't code-fenced
//   4. Escaped curly braces \{ \} appear in code that should be fenced
// ---------------------------------------------------------------------------

/**
 * Wrap code content inside <Callout> blocks with ```python fences.
 *
 * Detects blocks of consecutive lines that look like code (Python statements,
 * comments, doctests, indented lines) and wraps them in fenced code blocks.
 */
function fixCalloutContent(mdx) {
  // Match each <Callout ...>...</Callout> block
  return mdx.replace(
    /(<Callout\s[^>]*>)\s*\n([\s\S]*?)\n\s*(<\/Callout>)/g,
    (match, openTag, inner, closeTag) => {
      const fixed = fenceCodeInBlock(inner);
      return `${openTag}\n\n${fixed}\n\n${closeTag}`;
    },
  );
}

/**
 * Given the inner content of a Callout, identify code lines and wrap them
 * in ```python fences. Prose lines are left as-is.
 */
function fenceCodeInBlock(content) {
  const lines = content.split("\n");
  const result = [];
  let codeBuffer = [];
  let inCode = false;

  function flushCode() {
    if (codeBuffer.length === 0) return;
    // Trim trailing blank lines
    while (codeBuffer.length > 0 && codeBuffer.at(-1).trim() === "") {
      codeBuffer.pop();
    }
    if (codeBuffer.length === 0) { inCode = false; return; }
    // Unescape \{ and \} inside code -- they don't need escaping in fences
    let code = codeBuffer.join("\n");
    code = code.replaceAll("\\{", "{").replaceAll("\\}", "}");
    // Strip common 4-space indent if all code lines are indented
    code = stripCommonIndent(code);
    result.push("```python", code, "```");
    codeBuffer = [];
    inCode = false;
  }

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines -- they could be part of code or prose
    if (trimmed === "") {
      if (inCode) {
        codeBuffer.push(line);
      } else {
        result.push(line);
      }
      continue;
    }

    if (isCodeLine(trimmed)) {
      inCode = true;
      codeBuffer.push(line);
    } else if (inCode && isCodeContinuation(trimmed)) {
      // Multi-line expression continuation (closing parens, indented args, etc.)
      codeBuffer.push(line);
    } else {
      flushCode();
      result.push(line);
    }
  }
  flushCode();

  // Trim trailing empty lines from code blocks (between ``` and ```)
  return result.join("\n");
}

/**
 * Heuristic: does this trimmed line look like Python code?
 */
function isCodeLine(trimmed) {
  // Doctest
  if (trimmed.startsWith(">>>") || trimmed.startsWith("...")) return true;
  // Python comment (would become MDX heading)
  if (trimmed.startsWith("#")) return true;
  // Assignment, function call, or common Python patterns
  if (/^[a-zA-Z_]\w*\s*[=(.]/.test(trimmed)) return true;
  // Lines starting with keywords
  if (
    /^(from |import |for |if |else:|elif |while |with |def |class |return |print\(|raise )/.test(
      trimmed,
    )
  )
    return true;
  // TOML-style config lines inside examples (e.g. [layers.silicon])
  if (/^\[[\w./"]+\]$/.test(trimmed)) return true;
  // TOML key = value (only match when value starts with a quote, number, or bracket
  // to avoid matching prose sentences)
  if (/^\w+\s*=\s*["'\d\[({]/.test(trimmed)) return true;
  return false;
}

/**
 * Heuristic: does this trimmed line look like a continuation of a code block
 * that's already in progress? More permissive than isCodeLine -- allows
 * closing brackets, indented args, bare values, etc.
 */
function isCodeContinuation(trimmed) {
  if (isCodeLine(trimmed)) return true;
  // Closing brackets/parens (end of multi-line call)
  if (/^[)\]},]/.test(trimmed)) return true;
  // Indented continuation (keyword args, list items, etc.)
  if (/^\s/.test(trimmed)) return true;
  // Bare values that are likely output or args (numbers, strings, booleans)
  if (/^[\d"'(\[{True|False|None]/.test(trimmed)) return true;
  return false;
}

/**
 * Fix indented code blocks in description areas (before the first MDX
 * component). Python docstrings use 4-space indent for code.
 *
 * Note: file.content does NOT include frontmatter (Python.write() adds it),
 * so the description starts at the beginning of the content string.
 */
function fixDescriptionCodeBlocks(mdx) {
  // Find where description ends (first MDX component or ## heading)
  const firstComponent = mdx.search(/^(<Py|<Tabs|<Cards|## )/m);
  if (firstComponent === -1) return mdx;

  const desc = mdx.slice(0, firstComponent);
  const after = mdx.slice(firstComponent);

  // Only process if there are indented lines
  if (!/^ {4,}\S/m.test(desc)) return mdx;

  // Process the description: wrap 4-space-indented blocks in code fences
  const fixed = fenceIndentedBlocks(desc);
  return fixed + after;
}

/**
 * Find consecutive lines with 4+ space indent and wrap in ```python fences.
 */
function fenceIndentedBlocks(text) {
  const lines = text.split("\n");
  const result = [];
  let codeBuffer = [];

  function flushCode() {
    if (codeBuffer.length === 0) return;
    // Trim trailing blank lines from the code buffer
    while (codeBuffer.length > 0 && codeBuffer.at(-1).trim() === "") {
      codeBuffer.pop();
    }
    if (codeBuffer.length === 0) return;
    let code = codeBuffer.join("\n");
    code = code.replaceAll("\\{", "{").replaceAll("\\}", "}");
    code = stripCommonIndent(code);
    result.push("```python", code, "```", "");
    codeBuffer = [];
  }

  for (const line of lines) {
    // Line has 4+ spaces of leading indent (code in docstring)
    if (/^ {4,}\S/.test(line)) {
      codeBuffer.push(line);
    } else if (line.trim() === "" && codeBuffer.length > 0) {
      // Blank line inside an indented block -- keep it as code
      codeBuffer.push(line);
    } else {
      flushCode();
      result.push(line);
    }
  }
  flushCode();
  return result.join("\n");
}

/**
 * Strip the common leading whitespace from all non-empty lines.
 */
function stripCommonIndent(code) {
  const lines = code.split("\n");
  const nonEmpty = lines.filter((l) => l.trim() !== "");
  if (nonEmpty.length === 0) return code;

  const minIndent = Math.min(
    ...nonEmpty.map((l) => l.match(/^(\s*)/)[1].length),
  );
  if (minIndent === 0) return code;

  return lines.map((l) => (l.trim() === "" ? "" : l.slice(minIndent))).join(
    "\n",
  );
}

/**
 * Apply all post-processing fixes to an MDX string.
 */
function postProcess(mdx) {
  mdx = fixCalloutContent(mdx);
  mdx = fixDescriptionCodeBlocks(mdx);
  return mdx;
}

// ---------------------------------------------------------------------------
// Pre-processing: filter the JSON to only include public API
// ---------------------------------------------------------------------------

/** Modules to exclude from generated docs (internal implementation). */
const EXCLUDED_MODULES = new Set([
  "_core",
  "_serve",
  "_server",
  "_patcher",
  "_source",
  "cli",
]);

/** Classes to exclude (internal implementation details). */
const EXCLUDED_CLASSES = new Set(["SourceLocation"]);

/** Functions to exclude (internal/debug utilities). */
const EXCLUDED_FUNCTIONS = new Set([
  "enable_source_tracking",
  "disable_source_tracking",
]);

/** Module-level submodules to exclude (internal helpers). */
const EXCLUDED_SUBMODULES = new Set(["_curves"]);

/**
 * Remove internal modules, private functions, and private classes from the
 * module tree so they don't get generated as pages.
 */
function filterModule(mod) {
  // Remove excluded top-level modules
  const filteredModules = {};
  for (const [name, submod] of Object.entries(mod.modules)) {
    if (EXCLUDED_MODULES.has(name)) continue;
    // Recurse into kept modules (e.g., components)
    filteredModules[name] = filterSubmodule(submod);
  }
  mod.modules = filteredModules;

  // Remove private and excluded functions
  const filteredFunctions = {};
  for (const [name, func] of Object.entries(mod.functions)) {
    if (name.startsWith("_") || EXCLUDED_FUNCTIONS.has(name)) continue;
    filteredFunctions[name] = func;
  }
  mod.functions = filteredFunctions;

  // Remove private and excluded classes, and filter their methods
  const filteredClasses = {};
  for (const [name, cls] of Object.entries(mod.classes)) {
    if (EXCLUDED_CLASSES.has(name)) continue;
    filterClassMethods(cls);
    filteredClasses[name] = cls;
  }
  mod.classes = filteredClasses;

  // Remove private attributes (starting with _), except __all__-like ones we may want
  mod.attributes = mod.attributes.filter(
    (attr) => !attr.name.startsWith("_"),
  );

  return mod;
}

/**
 * Filter private methods from a class (e.g., _from_inner, _rotation_angle).
 * Keeps dunder methods (__init__, __repr__) but removes single-underscore private.
 */
function filterClassMethods(cls) {
  const filteredFunctions = {};
  for (const [name, func] of Object.entries(cls.functions)) {
    // Keep dunder methods (__init__, __repr__, etc.) but drop _private ones
    if (name.startsWith("_") && !name.startsWith("__")) continue;
    filteredFunctions[name] = func;
  }
  cls.functions = filteredFunctions;
}

/**
 * Filter a submodule (e.g., components) -- remove _-prefixed children.
 */
function filterSubmodule(mod) {
  const filteredModules = {};
  for (const [name, submod] of Object.entries(mod.modules)) {
    if (EXCLUDED_SUBMODULES.has(name) || name.startsWith("_")) continue;
    filteredModules[name] = submod;
  }
  mod.modules = filteredModules;

  // Remove private functions
  const filteredFunctions = {};
  for (const [name, func] of Object.entries(mod.functions)) {
    if (name.startsWith("_")) continue;
    filteredFunctions[name] = func;
  }
  mod.functions = filteredFunctions;

  return mod;
}

// ---------------------------------------------------------------------------
// Main generation
// ---------------------------------------------------------------------------

async function generate() {
  // Read the generated JSON
  const raw = await fs.readFile(jsonPath, "utf-8");
  const content = JSON.parse(raw);

  // Filter to public API only
  filterModule(content);

  // Convert to MDX files.
  // The library generates hrefs like /docs/api-reference/rosette/Cell but the
  // write() function strips the first path segment ("rosette/") when placing
  // files, so the actual page URL is /docs/api-reference/Cell. We fix the
  // hrefs after conversion.
  const converted = Python.convert(content, {
    baseUrl: "/docs/api-reference",
  });

  const moduleName = content.name; // "rosette"
  for (const file of converted) {
    // Fix internal links: remove the "/rosette" segment
    file.content = file.content.replaceAll(
      `/docs/api-reference/${moduleName}/`,
      "/docs/api-reference/",
    );
    file.content = file.content.replaceAll(
      `/docs/api-reference/${moduleName}"`,
      `/docs/api-reference"`,
    );

    // Fix formatting issues
    file.content = postProcess(file.content);
  }

  // Fix the root index page title (converter uses module name "rosette",
  // but we want "API Reference" for the sidebar/breadcrumb).
  const indexFile = converted.find((f) => f.path.endsWith("/index.mdx") && f.path.split("/").length === 2);
  if (indexFile) {
    indexFile.frontmatter.title = "API Reference";
    indexFile.frontmatter.description =
      "Complete reference for every class and function in the Rosette Python API.";
  }

  // Clean previous generated .mdx files (preserve hand-curated meta.json)
  const existing = await fs.readdir(outDir, { recursive: true }).catch(() => []);
  for (const entry of existing) {
    if (entry.endsWith(".mdx")) {
      await rimraf(path.join(outDir, entry));
    }
  }

  // Write the generated files
  await Python.write(converted, { outDir });

  console.log(
    `Generated ${converted.length} API reference pages in ${outDir}`,
  );
  for (const file of converted) {
    console.log(`  ${file.path}`);
  }
}

generate().catch((err) => {
  console.error("Failed to generate API docs:", err);
  process.exit(1);
});
