import Link from "next/link";

const navLinks = [
  { label: "Docs", href: "/docs", external: false },
  {
    label: "GitHub",
    href: "https://github.com/prefab-photonics/rosette",
    external: true,
  },
] as const;

export function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-black/80">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-medium text-black/90 transition-colors hover:text-black dark:text-white/90 dark:hover:text-white"
        >
          Rosette
        </Link>

        <div className="flex items-center gap-6">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-black/50 transition-colors hover:text-black/90 dark:text-white/50 dark:hover:text-white/90"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-black/50 transition-colors hover:text-black/90 dark:text-white/50 dark:hover:text-white/90"
              >
                {link.label}
              </Link>
            ),
          )}
        </div>
      </nav>
    </header>
  );
}
