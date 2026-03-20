import Link from "next/link";

const footerLinks = [
  { label: "Docs", href: "/docs", external: false },
  {
    label: "PreFab",
    href: "https://prefabphotonics.com",
    external: true,
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-black/[0.02] dark:border-white/[0.08] dark:bg-white/[0.02]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
        <p className="text-xs text-black/40 dark:text-white/40">
          &copy; {new Date().getFullYear()} PreFab Photonics Inc.
        </p>

        <div className="flex items-center gap-6">
          {footerLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-black/40 transition-colors hover:text-black/70 dark:text-white/40 dark:hover:text-white/70"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-black/40 transition-colors hover:text-black/70 dark:text-white/40 dark:hover:text-white/70"
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
