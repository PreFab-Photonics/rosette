# www

Docs site (Next.js + fumadocs). Content in `content/docs/` and `content/blog/`.
Scripts are in `package.json`; CI gates on `lint`, `types:check`, and `build`.

Lints with **biome** here — `app/` uses oxlint/oxfmt. Don't mix the two.

API reference pages use fumadocs-python components: `<PyFunction name={"fn"} />` and
`<PyAttribute name={"CONST"} />`, both on `content/docs/api-reference/index.mdx`.
