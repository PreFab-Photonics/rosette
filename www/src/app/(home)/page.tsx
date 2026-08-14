import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blog } from "@/lib/source";
import { AgentFlow, INIT_COMMAND } from "./components/agent-flow";
import { CopyButton } from "./components/copy-button";
import { RedactedText } from "./components/redacted-text";

export const metadata: Metadata = {
  title: {
    absolute: "Rosette - Chip design tools for agents",
  },
  description:
    "Rosette gives coding agents the instructions, context, and verification tools to design photonic chips. Rust core, Python API, and a WebGPU desktop app.",
  keywords: [
    "GDSII",
    "layout editor",
    "photonics",
    "integrated circuits",
    "Python",
    "EDA",
    "photonic design",
    "AI agents",
    "agentic design",
    "Claude Code",
    "OpenCode",
  ],
};

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-6 pt-20 sm:pt-24">
        {/* Hero text */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-[family-name:var(--font-instrument-serif)] text-3xl tracking-tight text-fd-foreground uppercase sm:text-4xl lg:text-5xl">
            Photonic design tools for agents + humans
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-fd-muted-foreground">
            Rosette gives coding agents the instructions, context, and
            verification they need to design photonic chips — and gives you a
            fast editor to check their work
          </p>
        </div>
      </div>

      {/* Quickstart and agent transcript */}
      <div className="mx-auto mt-10 max-w-4xl px-6 pb-8">
        <AgentFlow />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Why Rosette                                                               */
/* -------------------------------------------------------------------------- */

const reasons = [
  {
    title: "Fast",
    description:
      "A Rust core and GPU acceleration that keeps you in the flow. From geometry operations to live preview, every layer of the stack is built for speed.",
  },
  {
    title: "Intelligent",
    description:
      "AI-native from the ground up. Built for models and agents to enhance the design, simulation, and fabrication capabilities of your workflow.",
  },
  {
    title: "Accessible",
    description:
      "A minimal Python API, a modern interface, and documentation written for engineers and agents. Professional tools without the learning cliff.",
  },
];

function WhyRosette() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center gap-3 mb-3">
        <span
          aria-hidden="true"
          className="font-[family-name:var(--font-geist-mono)] text-xs text-fd-muted-foreground"
        >
          ◇
        </span>
        <span className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium tracking-widest text-fd-muted-foreground uppercase">
          Principles
        </span>
      </div>
      <h2 className="font-medium text-2xl tracking-tight text-fd-foreground">
        Why Rosette?
      </h2>

      <div className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-3">
        {reasons.map((reason) => (
          <div key={reason.title}>
            <h3 className="text-sm font-semibold text-fd-foreground">
              {reason.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-fd-muted-foreground">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Editor preview (supplementary)                                            */
/* -------------------------------------------------------------------------- */

function EditorPreview() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16">
      {/* Subtle divider */}
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-fd-border to-transparent" />

      <div className="flex items-center gap-3 mb-3">
        <span
          aria-hidden="true"
          className="font-[family-name:var(--font-geist-mono)] text-xs text-fd-muted-foreground"
        >
          ◎
        </span>
        <span className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium tracking-widest text-fd-muted-foreground uppercase">
          Editor
        </span>
      </div>
      <h2 className="font-medium text-2xl tracking-tight text-fd-foreground">
        Inspect and modify layouts
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fd-muted-foreground">
        Agents write and verify the design. You review it. The editor renders on
        the GPU and hot-reloads as the design changes, so you can go from the
        whole chip down to individual grating teeth without waiting.
      </p>

      <div className="mt-10">
        <div className="relative aspect-[2732/1740] w-full select-none overflow-hidden rounded-xl border border-fd-border shadow-sm ring-1 ring-inset ring-fd-accent dark:shadow-elevation">
          {/* Light theme */}
          <Image
            src="/editor-loopback-light.png"
            alt="A grating coupler from the fiber loopback design, open in the Rosette editor"
            fill
            // Sits ~1384px down the page, so it lands inside the initial
            // viewport on tall windows and gets picked as the LCP element.
            // Eager (not `priority`) starts the request without taking
            // fetch priority from the fonts. Delivered webp is 25KB / 63KB@2x.
            loading="eager"
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover dark:hidden"
          />
          {/* Dark theme */}
          <Image
            src="/editor-loopback-dark.png"
            alt="A grating coupler from the fiber loopback design, open in the Rosette editor"
            fill
            loading="eager"
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="hidden object-cover dark:block"
          />
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  What's Inside                                                             */
/* -------------------------------------------------------------------------- */

const capabilities = [
  {
    label: "python",
    title: "Python API",
    description:
      "A minimal, typed Python interface over a compiled Rust core. Ergonomic placement, automatic routing, and hierarchical cells.",
  },
  {
    label: "cli",
    title: "Powerful CLI",
    description:
      "Build, check, and preview from the terminal. One command to init a project, one to export GDS, and a dev server that live-reloads as you edit.",
  },
  {
    label: "app",
    title: "Layout editor",
    description:
      "A modern app with a WebGPU-rendered viewer, hot-reloading preview, and ergonomic keyboard-based workflows.",
  },
  {
    label: "agents",
    title: "Agentic workflows",
    description:
      "AI-native from day one. Agent instructions and direct code access gives LLM agents the context to design circuits alongside you.",
  },
  {
    label: "docs",
    title: "Documentation",
    description:
      "Guides, API references, and copy-paste recipes written for engineers and agents. From first install to tapeout, every step is documented.",
  },
  {
    label: "more",
    title: "More to come",
    description:
      "Simulation integration, a component marketplace, cloud collaboration, and more. Rosette is actively developed and shaped by the community.",
  },
];

function WhatsInside() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16">
      {/* Subtle divider */}
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-fd-border to-transparent" />

      <div className="flex items-center gap-3 mb-3">
        <span
          aria-hidden="true"
          className="font-[family-name:var(--font-geist-mono)] text-xs text-fd-muted-foreground"
        >
          ▣
        </span>
        <span className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium tracking-widest text-fd-muted-foreground uppercase">
          Features
        </span>
      </div>
      <h2 className="font-medium text-2xl tracking-tight text-fd-foreground">
        What&rsquo;s inside
      </h2>

      <div className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((cap) => (
          <div key={cap.label} className="py-5 sm:pr-8 lg:pr-10">
            <h3 className="text-sm font-semibold text-fd-foreground">
              {cap.title}
            </h3>
            {cap.label === "more" ? (
              <div className="mt-2.5 flex flex-wrap gap-x-2 gap-y-1.5 text-fd-muted-foreground">
                <RedactedText cols={14} rows={3} size={3} accentColor="#34d399">
                  Simulation
                </RedactedText>
                <RedactedText cols={16} rows={3} size={3} accentColor="#34d399">
                  integration
                </RedactedText>
                <RedactedText cols={10} rows={3} size={3} accentColor="#34d399">
                  component
                </RedactedText>
                <RedactedText cols={18} rows={3} size={3} accentColor="#34d399">
                  marketplace
                </RedactedText>
                <RedactedText cols={8} rows={3} size={3} accentColor="#34d399">
                  cloud
                </RedactedText>
                <RedactedText cols={20} rows={3} size={3} accentColor="#34d399">
                  collaboration
                </RedactedText>
                <RedactedText cols={12} rows={3} size={3} accentColor="#34d399">
                  and more
                </RedactedText>
                <RedactedText cols={14} rows={3} size={3} accentColor="#34d399">
                  actively
                </RedactedText>
                <RedactedText cols={16} rows={3} size={3} accentColor="#34d399">
                  developed
                </RedactedText>
                <RedactedText cols={10} rows={3} size={3} accentColor="#34d399">
                  shaped
                </RedactedText>
                <RedactedText cols={18} rows={3} size={3} accentColor="#34d399">
                  by community
                </RedactedText>
                <RedactedText cols={12} rows={3} size={3} accentColor="#34d399">
                  rosette
                </RedactedText>
                <RedactedText cols={16} rows={3} size={3} accentColor="#34d399">
                  open source
                </RedactedText>
                <RedactedText cols={10} rows={3} size={3} accentColor="#34d399">
                  tools
                </RedactedText>
                <RedactedText cols={14} rows={3} size={3} accentColor="#34d399">
                  platform
                </RedactedText>
                <RedactedText cols={8} rows={3} size={3} accentColor="#34d399">
                  next
                </RedactedText>
                <RedactedText cols={18} rows={3} size={3} accentColor="#34d399">
                  generation
                </RedactedText>
                <RedactedText cols={12} rows={3} size={3} accentColor="#34d399">
                  design
                </RedactedText>
              </div>
            ) : (
              <p className="mt-1.5 text-sm leading-relaxed text-fd-muted-foreground">
                {cap.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Open source                                                               */
/* -------------------------------------------------------------------------- */

const projectFiles = [
  { name: "rosette.toml", purpose: "layer stack + design rules" },
  { name: "components/", purpose: "editable device library" },
  { name: "AGENTS.md", purpose: "agent instructions + rules" },
  { name: ".agents/skills/", purpose: "reusable agent workflows" },
];

const sourceAreas = [
  { name: "crates/", purpose: "geometry + layout engine" },
  { name: "python/", purpose: "API + CLI" },
  { name: "app/", purpose: "WebGPU editor" },
];

function OpenSource() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-fd-border to-transparent" />

      <div className="flex items-center gap-3 mb-3">
        <span
          aria-hidden="true"
          className="font-[family-name:var(--font-geist-mono)] text-xs text-fd-muted-foreground"
        >
          {"<>"}
        </span>
        <span className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium tracking-widest text-fd-muted-foreground uppercase">
          Open source
        </span>
      </div>
      <h2 className="font-medium text-2xl tracking-tight text-fd-foreground">
        Fit Rosette to your process
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-fd-muted-foreground">
        Adapt a project without maintaining a fork. If your workflow needs
        deeper changes, the full Rust, Python, and WebGPU stack is MIT licensed
        and forkable too.
      </p>

      <div className="mt-10 overflow-hidden rounded-xl border border-fd-border shadow-xs dark:shadow-elevation lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="border-fd-border border-b bg-fd-muted/25 p-5 sm:p-7 lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between font-[family-name:var(--font-geist-mono)] text-[10px] tracking-widest uppercase sm:text-[11px]">
            <span className="font-medium text-fd-foreground">
              Project level
            </span>
            <span className="text-emerald-600 dark:text-emerald-400">
              no fork required
            </span>
          </div>

          <h3 className="mt-6 text-lg font-semibold tracking-tight text-fd-foreground">
            Shape each project.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground">
            Keep process-specific decisions beside the design, where your team
            and agents can read and change them.
          </p>

          <div className="mt-5 divide-y divide-fd-border border-y border-fd-border font-[family-name:var(--font-geist-mono)]">
            {projectFiles.map((file) => (
              <div
                key={file.name}
                className="grid grid-cols-[minmax(0,1fr)] py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center sm:gap-x-3"
              >
                <code className="text-xs text-fd-foreground sm:text-sm">
                  {file.name}
                </code>
                <span className="mt-0.5 text-[10px] text-fd-muted-foreground sm:mt-0 sm:text-right sm:text-[11px]">
                  {file.purpose}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 font-[family-name:var(--font-geist-mono)] text-[10px] leading-relaxed text-fd-muted-foreground sm:text-[11px]">
            Plain files. Git tracked. Readable by you and your agent.
          </p>

          <Link
            href="/docs/getting-started/installation#project-structure"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-fd-foreground transition-colors hover:text-fd-muted-foreground"
          >
            Explore project structure
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="flex flex-col p-5 sm:p-7">
          <div className="flex items-center justify-between font-[family-name:var(--font-geist-mono)] text-[10px] tracking-widest uppercase sm:text-[11px]">
            <span className="font-medium text-fd-foreground">Tool level</span>
            <span className="text-fd-muted-foreground">MIT licensed</span>
          </div>

          <h3 className="mt-6 text-lg font-semibold tracking-tight text-fd-foreground">
            Change Rosette itself.
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-fd-muted-foreground">
            The engine, bindings, CLI, and editor live in one public repository.
            Change a subsystem or carry the whole stack in your own direction.
          </p>

          <div className="mt-5 divide-y divide-fd-border border-y border-fd-border font-[family-name:var(--font-geist-mono)]">
            {sourceAreas.map((area) => (
              <div
                key={area.name}
                className="grid grid-cols-[minmax(0,1fr)] py-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:items-center sm:gap-x-3"
              >
                <code className="text-xs text-fd-foreground sm:text-sm">
                  {area.name}
                </code>
                <span className="mt-0.5 text-[10px] text-fd-muted-foreground sm:mt-0 sm:text-right sm:text-[11px]">
                  {area.purpose}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-7">
            <a
              href="https://github.com/PreFab-Photonics/rosette"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-fd-foreground transition-colors hover:text-fd-muted-foreground"
            >
              Browse source
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
            </a>
            <a
              href="https://github.com/PreFab-Photonics/rosette/fork"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              Fork Rosette
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Recent Blog Posts                                                         */
/* -------------------------------------------------------------------------- */

function RecentPosts() {
  const posts = blog
    .getPages()
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    )
    .slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16">
      {/* Subtle divider */}
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-fd-border to-transparent" />

      <div className="flex items-center gap-3 mb-3">
        <span
          aria-hidden="true"
          className="font-[family-name:var(--font-geist-mono)] text-xs text-fd-muted-foreground"
        >
          ›
        </span>
        <span className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium tracking-widest text-fd-muted-foreground uppercase">
          Updates
        </span>
      </div>
      <h2 className="font-medium text-2xl tracking-tight text-fd-foreground">
        Latest writing
      </h2>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <Link
            key={post.url}
            href={post.url}
            className="group rounded-xl border border-fd-border p-5 shadow-xs transition-colors hover:border-fd-foreground/30 dark:shadow-elevation sm:p-6"
          >
            <div className="flex items-center gap-3">
              <time className="font-[family-name:var(--font-geist-mono)] text-xs text-fd-muted-foreground">
                {new Date(post.data.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </time>
              {i === 0 && (
                <span className="rounded-full bg-fd-muted px-2.5 py-0.5 font-[family-name:var(--font-geist-mono)] text-[10px] font-medium text-fd-muted-foreground uppercase">
                  Latest
                </span>
              )}
            </div>
            <h3 className="mt-2 text-base font-semibold text-fd-foreground transition-colors group-hover:text-fd-muted-foreground">
              {post.data.title}
            </h3>
            {post.data.description && (
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-fd-muted-foreground">
                {post.data.description}
              </p>
            )}
          </Link>
        ))}
        {/* Empty slots to fill the 3-column grid */}
        {posts.length < 3 && (
          <div className="hidden rounded-xl border border-dashed border-fd-border p-5 sm:p-6 lg:block" />
        )}
        {posts.length < 2 && (
          <div className="hidden rounded-xl border border-dashed border-fd-border p-5 sm:p-6 lg:block" />
        )}
      </div>

      <div className="mt-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-fd-foreground transition-colors hover:text-fd-muted-foreground"
        >
          View all posts
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
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
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Closing CTA                                                               */
/* -------------------------------------------------------------------------- */

function ClosingCTA() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-14">
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-fd-border to-transparent" />

      <div className="mx-auto max-w-xl">
        <p className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium tracking-widest text-fd-muted-foreground uppercase">
          Start with one command
        </p>
        <div className="mt-4 flex min-w-0 items-center border-fd-border border-b pb-3 font-[family-name:var(--font-geist-mono)] text-sm text-fd-foreground">
          <span className="select-none text-fd-muted-foreground">$</span>
          <code className="ml-3 min-w-0 flex-1 overflow-x-auto whitespace-nowrap">
            {INIT_COMMAND}
          </code>
          <CopyButton text={INIT_COMMAND} />
        </div>
        <Link
          href="/docs/getting-started/installation"
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-fd-muted-foreground transition-colors hover:text-fd-foreground"
        >
          Installation guide
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function HomePage() {
  return (
    <>
      <Hero />
      <WhyRosette />
      <EditorPreview />
      <WhatsInside />
      <OpenSource />
      <RecentPosts />
      <ClosingCTA />
    </>
  );
}
