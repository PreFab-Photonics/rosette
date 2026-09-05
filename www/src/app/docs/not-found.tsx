import type { Metadata } from "next";
import { NotFoundContent } from "@/components/not-found-content";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The requested Rosette page does not exist.",
  alternates: { canonical: null },
};

export default function NotFound() {
  return <NotFoundContent />;
}
