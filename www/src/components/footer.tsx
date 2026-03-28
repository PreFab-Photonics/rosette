import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { label: "Docs", href: "/docs", external: false },
  { label: "Blog", href: "/blog", external: false },
  {
    label: "GitHub",
    href: "https://github.com/prefab-photonics/rosette",
    external: true,
  },
  {
    label: "PreFab",
    href: "https://prefabphotonics.com",
    external: true,
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-fd-border bg-fd-card">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-6 py-8 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/prefab-logo-notext.png"
            alt="PreFab Photonics"
            width={20}
            height={20}
            className="h-5 w-5"
          />
          <p className="text-xs text-fd-muted-foreground">
            &copy; {new Date().getFullYear()} PreFab Photonics Inc.
          </p>
        </div>

        <div className="flex items-center gap-6">
          {footerLinks.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-fd-muted-foreground transition-colors hover:text-fd-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-fd-muted-foreground transition-colors hover:text-fd-foreground"
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
