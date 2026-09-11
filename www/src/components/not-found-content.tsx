import Link from "next/link";

export function NotFoundContent() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center px-6 py-20 sm:py-28">
      <div className="max-w-3xl border-fd-border border-l pl-6 sm:pl-10">
        <p className="text-xs tracking-[0.2em] text-fd-muted-foreground uppercase">
          404 / route not found
        </p>
        <h1 className="mt-5 text-4xl tracking-tight text-fd-foreground sm:text-5xl">
          This page is outside the layout.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-fd-muted-foreground">
          The address may be outdated or incomplete. Search from the header,
          open the documentation, or return to the project overview.
        </p>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          <Link
            href="/docs"
            className="font-medium text-fd-foreground underline decoration-fd-border underline-offset-4 transition-colors hover:decoration-fd-foreground"
          >
            Browse documentation
          </Link>
          <Link
            href="/"
            className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
          >
            Return home
          </Link>
          <a
            href="/llms.txt"
            className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
          >
            Agent index
          </a>
          <a
            href="https://github.com/PreFab-Photonics/rosette"
            className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
