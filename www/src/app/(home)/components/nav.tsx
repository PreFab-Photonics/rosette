import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

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
    <header className="sticky top-0 z-50 w-full border-b border-brand-purple/10 bg-white/90 backdrop-blur-xl dark:border-brand-purple/15 dark:bg-[hsl(250,15%,6%)]/90">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-black/90 transition-colors hover:text-brand-purple dark:text-white/90 dark:hover:text-brand-purple-light"
        >
          <Image
            src="/rosette-logo.png"
            alt="Rosette"
            width={28}
            height={28}
            className=""
          />
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
                className="text-sm text-black/50 transition-colors hover:text-brand-purple dark:text-white/50 dark:hover:text-brand-purple-light"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-black/50 transition-colors hover:text-brand-purple dark:text-white/50 dark:hover:text-brand-purple-light"
              >
                {link.label}
              </Link>
            ),
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
