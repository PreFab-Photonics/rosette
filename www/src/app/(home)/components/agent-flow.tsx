import Link from "next/link";
import { CopyButton } from "./copy-button";

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
 * - Focused contracts and skills are reached through `.rosette/index.md`, so the
 *   complete API/CLI fallbacks are left out of the `read` row. The build's bbox
 *   summary is also omitted; both details are real, neither earns the space.
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

export const INIT_COMMAND = "uvx --from librosette rosette init my-chip";
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
    text: "AGENTS.md · .rosette/index.md · rosette.toml · components/",
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
      <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-background font-[family-name:var(--font-geist-mono)] text-[11px] leading-relaxed shadow-sm ring-1 ring-inset ring-fd-accent dark:shadow-elevation sm:text-xs md:text-sm">
        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <div className="text-[10px] tracking-widest uppercase sm:text-[11px]">
            <span className="font-medium text-fd-foreground">Quickstart</span>
          </div>

          <ol className="mt-4">
            <li className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3">
              <div className="flex flex-col items-center">
                <span className="flex size-5 items-center justify-center rounded-full border border-fd-border bg-fd-background text-[10px] text-fd-muted-foreground">
                  1
                </span>
                <span
                  aria-hidden="true"
                  className="my-1 w-px grow bg-fd-border"
                />
              </div>
              <div className="pb-4">
                <p className="font-medium text-fd-foreground">
                  Initialize a project
                </p>
                <div className="mt-2 flex h-10 min-w-0 items-center rounded-md border border-fd-border bg-fd-accent/50 px-3 text-fd-foreground">
                  <span className="flex min-w-0 flex-1 items-center overflow-x-auto">
                    <span className="select-none text-emerald-500 dark:text-emerald-400">
                      ~&nbsp;
                    </span>
                    <span className="whitespace-nowrap">{INIT_COMMAND}</span>
                  </span>
                  <CopyButton text={INIT_COMMAND} />
                </div>
              </div>
            </li>

            <li className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3">
              <span className="flex size-5 items-center justify-center rounded-full border border-fd-border bg-fd-background text-[10px] text-fd-muted-foreground">
                2
              </span>
              <div>
                <p className="font-medium text-fd-foreground">
                  Ask your coding agent
                </p>
                {/* Prompt — typed character by character */}
                <div className="mt-2 flex min-h-10 items-center rounded-md border border-fd-border bg-fd-accent/50 px-3">
                  <span
                    aria-hidden="true"
                    className="animate-char-in mr-3 text-emerald-500 select-none dark:text-emerald-400"
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
              </div>
            </li>
          </ol>
        </div>

        <div className="border-fd-border border-t bg-fd-muted/25 px-4 py-4 sm:px-5 sm:py-5">
          <div className="space-y-1">
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
      </div>

      {/* Caption */}
      <div className="mt-4 flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <p className="font-[family-name:var(--font-geist-mono)] text-[11px] text-fd-muted-foreground">
            Works with any coding agent
          </p>
          <span className="group relative inline-flex">
            <button
              type="button"
              aria-describedby="beta-notice"
              className="cursor-help rounded-md border border-brand-purple/25 bg-brand-purple/5 px-2.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-[10px] font-medium tracking-widest text-brand-purple uppercase outline-none transition-colors hover:border-brand-purple/40 focus-visible:ring-2 focus-visible:ring-brand-purple/40 dark:text-brand-purple-light"
            >
              Beta
            </button>
            <span
              id="beta-notice"
              role="tooltip"
              className="pointer-events-none absolute top-full left-1/2 z-10 mt-2 w-64 max-w-[calc(100vw-3rem)] -translate-x-1/2 rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-left text-xs leading-relaxed text-fd-muted-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 dark:shadow-elevation"
            >
              Features may be unstable or incomplete. Not suitable for
              production use.
            </span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/prefab-photonics/rosette"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[13px] leading-none font-medium text-fd-foreground transition-colors hover:text-fd-muted-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Clone source
          </a>
          <Link
            href="/blog/agent-driven-design"
            className="inline-flex items-center gap-1.5 text-[13px] leading-none font-medium text-fd-foreground transition-colors hover:text-fd-muted-foreground"
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
    </div>
  );
}
