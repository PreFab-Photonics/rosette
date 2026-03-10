import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Rosette",
    template: "%s | Rosette",
  },
  description: "Photonic integrated circuit design",
  metadataBase: new URL("https://rosette.dev"),
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
