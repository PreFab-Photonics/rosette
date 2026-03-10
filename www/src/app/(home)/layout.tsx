import type { ReactNode } from "react";
import { Footer } from "./components/footer";
import { Nav } from "./components/nav";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
