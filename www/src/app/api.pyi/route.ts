import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const contract = readFileSync(
  resolve(process.cwd(), "../python/rosette/api.pyi"),
  "utf8",
);

export const dynamic = "force-static";
export const runtime = "nodejs";

export function GET() {
  return new Response(contract, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": 'inline; filename="api.pyi"',
      "X-Content-Type-Options": "nosniff",
    },
  });
}
