import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Rosette, its open-source development status, and PreFab Photonics.",
};

const projectLinks = [
  {
    label: "Source and issues",
    href: "https://github.com/PreFab-Photonics/rosette",
  },
  {
    label: "Python package",
    href: "https://pypi.org/project/librosette/",
  },
  {
    label: "PreFab Photonics",
    href: "https://www.prefabphotonics.com/about",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
      <div className="max-w-3xl">
        <h1 className="text-4xl tracking-tight text-fd-foreground sm:text-5xl">
          About Rosette
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fd-muted-foreground">
          Rosette is a local-first GDS-II layout environment for integrated
          photonics. It combines a typed Python API, a Rust core, and a WebGPU
          viewer with project context that coding agents and engineers can both
          inspect.
        </p>
      </div>

      <div className="mt-14 grid max-w-4xl gap-10 border-fd-border border-t pt-10 sm:grid-cols-2">
        <section>
          <h2 className="text-sm font-semibold text-fd-foreground">
            Project status
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground">
            Rosette is MIT licensed beta software: the API is unstable, breaking
            changes are expected, and it is not suitable for production
            sign-off.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-fd-foreground">
            Publisher and contact
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground">
            Rosette is built and maintained by PreFab Photonics Inc. For general
            questions, email{" "}
            <a
              href="mailto:hi@prefabphotonics.com"
              className="text-fd-foreground underline decoration-fd-border underline-offset-4 transition-colors hover:decoration-fd-foreground"
            >
              hi@prefabphotonics.com
            </a>
            . Use GitHub issues for reproducible bugs and feature requests.
          </p>
        </section>
      </div>

      <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-fd-border border-t pt-6 text-sm">
        {projectLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fd-muted-foreground transition-colors hover:text-fd-foreground"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
