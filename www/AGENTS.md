# www

Docs site (Next.js + fumadocs). Content in `content/docs/` and `content/blog/`.
Scripts are in `package.json`; run `test`, `lint`, `types:check`, and `build` before
finishing docs-site changes. CI gates on `lint`, `types:check`, and `build`.

Lints with **biome** here — `app/` uses oxlint/oxfmt. Don't mix the two.

Machine-readable docs are served at `/docs/*.md` and in `/llms-full.txt`. Keep
their shared serializer in `src/lib/llm.ts`; configure new MDX components as
flow-preserving placeholders in `source.config.ts`. Machine output must not contain
presentation-only JSX or encoded JSX attributes. `.source/` and `.next/` are
generated and must not be edited.

`build` also validates the generated full corpus, API contract output, and internal
links against the built HTML routes and anchors.

`public/cli.json` is generated from the Python parser. After changing CLI
commands or flags, run `uv run python www/scripts/generate-cli-manifest.py` and
keep the Python drift test passing. Do not recreate the manifest schema in
TypeScript.

API reference pages use fumadocs-python components: `<PyFunction name={"fn"} />` and
`<PyAttribute name={"CONST"} />`, both on `content/docs/api-reference/index.mdx`.
