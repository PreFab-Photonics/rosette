import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dir, "..");
const appDir = join(root, ".next", "server", "app");
const publicDir = join(root, "public");
const origin = "https://rosette.dev";

interface Rewrite {
  source: string;
  destination: string;
  regex: string;
}

interface RoutesManifest {
  staticRoutes: { page: string }[];
  dynamicRoutes: { page: string; regex: string }[];
  rewrites: {
    beforeFiles: Rewrite[];
    afterFiles: Rewrite[];
    fallback: Rewrite[];
  };
}

interface PrerenderManifest {
  routes: Record<
    string,
    {
      initialStatus?: number;
      srcRoute?: string | null;
    }
  >;
  dynamicRoutes: Record<string, unknown>;
}

function walk(directory: string, extension?: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return walk(path, extension);
    return extension && extname(entry.name) !== extension ? [] : [path];
  });
}

function routeFromHtml(path: string): string {
  const name = relative(appDir, path)
    .split(sep)
    .join("/")
    .replace(/\.html$/, "")
    .replace(/\/index$/, "");
  return name && name !== "index" ? `/${name}` : "/";
}

function normalizePath(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/$/, "");
}

const htmlByRoute = new Map(
  walk(appDir, ".html")
    .map((path) => [routeFromHtml(path), readFileSync(path, "utf8")] as const)
    .filter(([route]) => !route.startsWith("/_")),
);
const routesManifest = JSON.parse(
  readFileSync(join(root, ".next", "routes-manifest.json"), "utf8"),
) as RoutesManifest;
const prerenderManifest = JSON.parse(
  readFileSync(join(root, ".next", "prerender-manifest.json"), "utf8"),
) as PrerenderManifest;
const routes = new Set([
  ...htmlByRoute.keys(),
  ...Object.entries(prerenderManifest.routes)
    .filter(
      ([path, route]) =>
        !path.startsWith("/_") && (route.initialStatus ?? 200) < 400,
    )
    .map(([path]) => normalizePath(path)),
  ...routesManifest.staticRoutes
    .map((route) => normalizePath(route.page))
    .filter((route) => !route.startsWith("/_")),
]);
for (const path of walk(publicDir)) {
  routes.add(`/${relative(publicDir, path).split(sep).join("/")}`);
}
const rewrites = [
  ...routesManifest.rewrites.beforeFiles,
  ...routesManifest.rewrites.afterFiles,
  ...routesManifest.rewrites.fallback,
];
const constrainedDynamicPages = new Set(
  Object.keys(prerenderManifest.dynamicRoutes),
);
const dynamicRoutes = routesManifest.dynamicRoutes
  .filter((route) => !constrainedDynamicPages.has(route.page))
  .map((route) => new RegExp(route.regex));

function routeExists(pathname: string): boolean {
  return (
    routes.has(pathname) || dynamicRoutes.some((route) => route.test(pathname))
  );
}

function resolveRewrite(pathname: string): string | undefined {
  for (const rewrite of rewrites) {
    const match = new RegExp(rewrite.regex).exec(pathname);
    if (!match) continue;

    const names = [...rewrite.source.matchAll(/:([A-Za-z_][A-Za-z0-9_]*)\*?/g)];
    let destination = rewrite.destination;
    names.forEach((name, index) => {
      destination = destination.replace(
        new RegExp(`:${name[1]}\\*?`),
        match[index + 1] ?? "",
      );
    });
    return normalizePath(new URL(destination, origin).pathname);
  }
  return undefined;
}

const errors: string[] = [];
const idsByRoute = new Map<string, Set<string>>();
for (const [route, html] of htmlByRoute) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  for (const id of new Set(duplicates)) {
    errors.push(`${route}: duplicate anchor #${id}`);
  }
  idsByRoute.set(route, new Set(ids));
}

function validateLink(source: string, href: string) {
  if (!href || href === "#") return;
  const decodedHref = href.replaceAll("&amp;", "&");
  let url: URL;
  try {
    url = new URL(decodedHref, `${origin}${source}`);
  } catch {
    errors.push(`${source}: invalid URL ${href}`);
    return;
  }
  if (url.origin !== origin) return;

  const pathname = normalizePath(decodeURIComponent(url.pathname));
  const rewriteDestination = resolveRewrite(pathname);
  const markdownTarget =
    (pathname.endsWith(".md") || pathname.endsWith(".mdx")) &&
    rewriteDestination !== undefined;
  const canonicalPath = markdownTarget
    ? normalizePath(pathname.replace(/\.mdx?$/, ""))
    : pathname;
  if (rewriteDestination !== undefined && !routeExists(rewriteDestination)) {
    errors.push(
      `${source}: ${href} rewrites to missing route ${rewriteDestination}`,
    );
    return;
  }
  if (
    !routeExists(pathname) &&
    !(markdownTarget && routeExists(canonicalPath))
  ) {
    errors.push(`${source}: ${href} resolves to missing route ${pathname}`);
    return;
  }

  if (url.hash && !markdownTarget) {
    const fragment = decodeURIComponent(url.hash.slice(1));
    const ids = idsByRoute.get(canonicalPath);
    if (ids && !ids.has(fragment)) {
      errors.push(`${source}: ${href} targets missing anchor #${fragment}`);
    }
  }
}

for (const [route, html] of htmlByRoute) {
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    validateLink(route, match[1]);
  }
}

for (const [filename, source] of [
  ["llms.txt", "/llms.txt"],
  ["llms-full.txt", "/llms-full.txt"],
] as const) {
  const body = readFileSync(join(appDir, `${filename}.body`), "utf8");
  for (const match of body.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    validateLink(source, match[1]);
  }
}

if (errors.length > 0) {
  throw new Error(
    `Broken internal links:\n${[...new Set(errors)].sort().join("\n")}`,
  );
}

console.log(`Link check passed: ${htmlByRoute.size} HTML routes`);
