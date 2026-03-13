import Link from "next/link";

const footerLinks = [
  { label: "Docs", href: "/docs", external: false },
  {
    label: "GitHub",
    href: "https://github.com/prefab-photonics/rosette",
    external: true,
  },
  {
    label: "PreFab Photonics",
    href: "https://prefabphotonics.com",
    external: true,
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-brand-purple/10 bg-brand-purple/[0.03] dark:border-brand-purple/15 dark:bg-brand-purple/[0.06]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
        <p className="text-xs text-black/40 dark:text-white/40">
          &copy; {new Date().getFullYear()} PreFab Photonics
        </p>

        <div className="flex items-center gap-6">
          {footerLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-black/40 transition-colors hover:text-brand-purple dark:text-white/40 dark:hover:text-brand-purple-light"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-black/40 transition-colors hover:text-brand-purple dark:text-white/40 dark:hover:text-brand-purple-light"
              >
                {link.label}
              </Link>
            ),
          )}
        </div>
      </div>
    </footer>
  );
}
