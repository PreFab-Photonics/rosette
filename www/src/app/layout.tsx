import { Analytics } from "@vercel/analytics/next";
import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: {
    default: "Rosette - The modern GDSII layout editor",
    template: "%s | Rosette",
  },
  description: "The modern GDSII layout editor",
  metadataBase: new URL("https://rosette.dev"),
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    siteName: "Rosette",
    locale: "en_US",
    images: "/og/default",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
        <RootProvider
          theme={{
            // The site has no theme switcher — appearance follows the OS.
            // next-themes still reads its storage key first (`localStorage
            // .getItem(key) || defaultTheme`), so a leftover value pins the
            // theme with no UI left to change it. A site-scoped key sidesteps
            // both the stale `theme` entry written by the toggle this site used
            // to ship, and any unrelated app sharing the localhost origin.
            storageKey: "rosette-theme",
            defaultTheme: "system",
            enableSystem: true,
            disableTransitionOnChange: true,
          }}
        >
          {children}
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
