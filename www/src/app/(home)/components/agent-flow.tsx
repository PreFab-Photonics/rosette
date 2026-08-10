import Link from "next/link";

/**
 * Hero visual: a terminal-style transcript of an agent designing a photonic
 * circuit in a Rosette project.
 *
 * Every line was verified against a real run: `rosette init --template generic`,
 * then the grating-coupler loopback from the Agent-Driven Design post
 * (`content/blog/agent-driven-design.mdx`) built and checked. The reads name
 * reference files the scaffolded AGENTS.md points the agent at, the commands
 * carry the design argument the CLI requires (`rosette build` alone exits 2),
 * and every number is real: `mid_x = 15` is the first attempt that auto-reduces
 * exactly one bend from 10.0 to 4.5 µm, `mid_x = 25` then builds clean, and
 * `rosette check` reports `23 rules, 57 polygons` and `4 ports … 2 bends`.
 * Keep it that way — if the CLI output changes, update this rather than letting
 * it drift into fiction.
 *
 * Trimmed for legibility, since a hero is read in about three seconds:
 * - `drc`/`checks` rows drop the design path and elapsed time, and fold `passed`
 *   up from its own line.
 * - The `warn` row compresses the CLI's `auto-reduced from 10.0 to 4.5 µm` to an
 *   arrow and drops the trailing zero, which pairs it with the `edit` row below
 *   and keeps it on one line at 390px.
 * - The `edit` row says `route extent 15 → 25 µm` rather than naming the script's
 *   `mid_x` variable, which means nothing to someone who hasn't read the file,
 *   and omits the filename already established by the `write` row above.
 * - `.rosette/cli.json` is left out of the `read` row and the build's bbox
 *   summary out of the `ok` row; both are real, neither earns the space.
 * - The `checks` row says `4 ports connected` rather than echoing the CLI's
 *   `4 ports, 1 connections`. All four ports are matched with no unconnected-port
 *   violations, so this is accurate, and it avoids a count that reads as wrong:
 *   `connections_found` only counts anti-parallel port pairs, and a route's start
 *   port inherits the direction of the port it launches from, so the junction at
 *   the first coupler is co-located-parallel and never increments the counter
 *   (`crates/rosette-checks/src/connectivity.rs:197`). Two physical junctions,
 *   one reported connection.
 *
 * Every row except the `read` list fits one line at 390px. Keep it that way.
 *
 * Motion is pure CSS (staggered `animation-delay`), so this stays a server
 * component with zero client JS and honors `prefers-reduced-motion`.
 */

const PROMPT = "design a grating coupler loopback";

/** ms per typed character of the prompt. */
const CHAR_MS = 22;
/** How long the prompt takes to type out. */
const PROMPT_MS = PROMPT.length * CHAR_MS;
/** The caret sits at the end of the full string, so it stays hidden until the
 *  text has caught up to it. */
const CARET_DELAY_MS = PROMPT_MS;
/** When the first transcript line lands, after the prompt finishes typing. */
const LINES_START_MS = PROMPT_MS + 260;
/** Gap between transcript lines. */
const LINE_STEP_MS = 190;

type Tone = "muted" | "command" | "warn" | "ok";

type FlowLine = {
  /** Stable React key. The same command shows up more than once. */
  id: string;
  /** Gutter label, e.g. `read` or `$`. */
  label: string;
  text: string;
  tone: Tone;
  /** Trailing status word, always rendered in the success accent. */
  status?: string;
};

const lines: FlowLine[] = [
  {
    id: "read",
    label: "read",
    text: "AGENTS.md · rosette.toml · .rosette/api.pyi · components/",
    tone: "muted",
  },
  { id: "write", label: "write", text: "designs/loopback.py", tone: "muted" },
  {
    id: "build-1",
    label: "$",
    text: "rosette build designs/loopback.py",
    tone: "command",
  },
  {
    id: "warn",
    label: "warn",
    text: "bend radius auto-reduced 10 → 4.5 µm",
    tone: "warn",
  },
  {
    id: "edit",
    label: "edit",
    text: "route extent 15 → 25 µm",
    tone: "muted",
  },
  {
    id: "build-2",
    label: "$",
    text: "rosette build designs/loopback.py",
    tone: "command",
  },
  {
    id: "ok",
    label: "ok",
    text: "output/loopback.gds",
    tone: "ok",
  },
  {
    id: "check",
    label: "$",
    text: "rosette check designs/loopback.py",
    tone: "command",
  },
  {
    id: "drc",
    label: "drc",
    text: "23 rules, 57 polygons —",
    tone: "muted",
    status: "passed",
  },
  {
    id: "checks",
    label: "checks",
    text: "4 ports connected, 2 bends —",
    tone: "muted",
    status: "passed",
  },
];

const toneClass: Record<Tone, string> = {
  muted: "text-fd-muted-foreground",
  command: "text-fd-foreground",
  warn: "text-amber-500 dark:text-amber-400",
  ok: "text-fd-foreground",
};

const labelToneClass: Record<Tone, string> = {
  muted: "text-fd-muted-foreground/60",
  command: "text-emerald-500 dark:text-emerald-400",
  warn: "text-amber-500 dark:text-amber-400",
  ok: "text-emerald-500 dark:text-emerald-400",
};

export function AgentFlow() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-xl border border-fd-border bg-fd-background px-4 py-4 font-[family-name:var(--font-geist-mono)] text-[11px] leading-relaxed shadow-md ring-1 ring-inset ring-fd-accent dark:shadow-elevation sm:px-5 sm:py-5 sm:text-xs md:text-sm">
        {/* Prompt — typed character by character */}
        <div className="grid grid-cols-[3.25rem_1fr] sm:grid-cols-[3.75rem_1fr]">
          <span
            aria-hidden="true"
            className="animate-char-in text-emerald-500 select-none dark:text-emerald-400"
          >
            &gt;
          </span>
          <p className="whitespace-pre-wrap text-fd-foreground">
            {Array.from(PROMPT).map((char, i) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed string, index is the identity
                key={`${char}-${i}`}
                className="animate-char-in"
                style={{ animationDelay: `${i * CHAR_MS}ms` }}
              >
                {char}
              </span>
            ))}
            <span
              aria-hidden="true"
              style={{ animationDelay: `${CARET_DELAY_MS}ms` }}
              className="animate-caret ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-fd-foreground/70"
            />
          </p>
        </div>

        <div className="mt-3 space-y-1">
          {lines.map((line, i) => (
            <div
              key={line.id}
              style={{
                animationDelay: `${LINES_START_MS + i * LINE_STEP_MS}ms`,
              }}
              className="animate-line-in grid grid-cols-[3.25rem_1fr] sm:grid-cols-[3.75rem_1fr]"
            >
              <span
                className={`select-none ${labelToneClass[line.tone]}`}
                aria-hidden={line.label === "$"}
              >
                {line.label}
              </span>
              <p className={`break-words ${toneClass[line.tone]}`}>
                {line.text}
                {line.status && (
                  <span className="ml-1 text-emerald-600 dark:text-emerald-400">
                    {line.status}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Caption */}
      <div className="mt-4 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="font-[family-name:var(--font-geist-mono)] text-[11px] text-fd-muted-foreground">
          Works with your coding agents
        </p>
        <Link
          href="/blog/agent-driven-design"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-fd-foreground transition-colors hover:text-fd-muted-foreground"
        >
          How it works
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
