import { CopyButton } from "./components/copy-button";
import { HeroViewer } from "./components/hero-viewer";
import { RedactedText } from "./components/redacted-text";

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

const heroCodeFallback = `from rosette import Cell, Layer, Route, write_gds
from components.mmi import mmi_1x2
from components.grating_coupler import grating_coupler

chip = Cell("splitter")
gc = grating_coupler(layer=Layer(1, 0)).at(0, 0)
mmi = mmi_1x2(layer=Layer(1, 0)).at(80, 0)
chip.add_ref(gc)
chip.add_ref(mmi)

Route.through(gc.port("opt"), mmi.port("in"),
    layer=Layer(1, 0), width=0.5, bend_radius=10.0)

write_gds("splitter.gds", chip)`;

function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-20 sm:pt-24">
        {/* Hero text */}
        <div className="mx-auto max-w-2xl text-center">
          {/* Tag line */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-1.5 font-[family-name:var(--font-geist-mono)] text-[11px] font-medium tracking-wide text-black/50 uppercase dark:border-white/10 dark:bg-white/5 dark:text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow" />
            In beta
          </div>

          <h1 className="font-[family-name:var(--font-instrument-serif)] text-4xl tracking-tight text-black/90 sm:text-5xl lg:text-6xl dark:text-white">
            A nice GDSII{" "}
            <span className="text-brand-purple dark:text-brand-purple-light">
              layout editor
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-black/50 dark:text-white/60">
            <span className="font-medium text-black/80 dark:text-white/80">
              Fast. Intelligent. Accessible.
            </span>
          </p>

          <p className="mt-3 text-sm text-black/30 dark:text-white/30">
            by{" "}
            <a
              href="https://prefabphotonics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-black/50 dark:hover:text-white/50"
            >
              PreFab Photonics
            </a>
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            {/* pip install — Python API */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="inline-flex h-11 cursor-not-allowed items-center rounded-lg border border-black/10 border-b-black/15 bg-white px-5 opacity-50 shadow-sm font-[family-name:var(--font-geist-mono)] text-sm text-black/70 dark:border-white/10 dark:border-b-white/15 dark:bg-neutral-900 dark:text-white/70 dark:shadow-none">
                <span className="select-none text-black/30 dark:text-white/30">
                  $&nbsp;
                </span>
                pip install{" "}
                <RedactedText className="ml-1.5">rosette</RedactedText>
                <CopyButton text="pip install rosette" disabled />
              </div>
              <span className="text-[11px] text-black/30 dark:text-white/30">
                Python API &middot; coming soon
              </span>
            </div>

            {/* Download — Desktop app */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-lg border border-brand-purple-dark/50 bg-brand-purple px-6 text-sm font-medium text-white opacity-50 shadow-sm shadow-brand-purple-dark/30 ring-1 ring-inset ring-white/15">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Download
              </div>
              <span className="text-[11px] text-black/30 dark:text-white/30">
                Desktop app &middot; coming soon
              </span>
            </div>

            {/* GitHub — Source code */}
            <div className="flex flex-col items-center gap-1.5">
              <a
                href="https://github.com/prefab-photonics/rosette"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-black/10 border-b-black/15 bg-white px-5 shadow-sm text-sm font-medium text-black/70 transition-colors hover:border-black/20 hover:text-black dark:border-white/10 dark:border-b-white/15 dark:bg-neutral-900 dark:text-white/70 dark:shadow-none dark:hover:border-white/20 dark:hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
              <span className="text-[11px] text-black/30 dark:text-white/30">
                Source code
              </span>
            </div>
          </div>
        </div>

        {/* Full-width viewer + synced background dot grid */}
        <HeroViewer
          src="/viewer/index.html?embed=true&src=showcase.json&colors=382165,5635a2,e6b01b&fills=solid,solid,solid&name=demo&zoom=0.8&panelWidth=200"
          fallback={heroCodeFallback}
        />
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
      "A Rust core and GPU rendering that keeps you in the flow. From geometry operations to live preview, every layer of the stack is built for speed.",
  },
  {
    title: "Intelligent",
    description:
      "AI-native from the ground up. Built for models and agents to enhance the fabrication, simulation, and design capabilities of your workflow.",
  },
  {
    title: "Accessible",
    description:
      "A clean Python API, a modern desktop app, and documentation written for engineers. Professional tools without the learning cliff.",
  },
];

function WhyRosette() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-px w-8 bg-black/20 dark:bg-white/20" />
        <span className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium tracking-widest text-black/40 uppercase dark:text-white/40">
          Principles
        </span>
      </div>
      <h2 className="font-[family-name:var(--font-instrument-serif)] text-2xl tracking-tight text-black/90 italic dark:text-white">
        Why Rosette?
      </h2>

      <div className="mt-10 grid gap-x-10 gap-y-6 sm:grid-cols-3">
        {reasons.map((reason, i) => (
          <div key={reason.title}>
            <span className="font-[family-name:var(--font-geist-mono)] text-xs text-black/20 dark:text-white/20">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-1 text-sm font-semibold text-black/90 dark:text-white/90">
              {reason.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-black/50 dark:text-white/50">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  What's Inside                                                             */
/* -------------------------------------------------------------------------- */

const capabilities = [
  {
    label: "app",
    title: "Desktop app",
    description:
      "A native app with a WebGPU-rendered viewer, hot-reloading preview, and design rule overlays. See your layout update in real time as you write code.",
  },
  {
    label: "python",
    title: "Python API",
    description:
      "A clean, typed Python interface over a compiled Rust core. Ergonomic placement, automatic routing, and hierarchical cells.",
  },
  {
    label: "fabrication",
    title: "Fabrication awareness",
    description:
      "Built on PreFab\u2019s process knowledge. Move beyond basic design rules with foundry models that have true predictive capabilities.",
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
      "Guides, API references, and copy-paste recipes written for engineers. From first install to tapeout, every step is documented.",
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
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />

      <div className="flex items-center gap-3 mb-3">
        <div className="h-px w-8 bg-black/20 dark:bg-white/20" />
        <span className="font-[family-name:var(--font-geist-mono)] text-[11px] font-medium tracking-widest text-black/40 uppercase dark:text-white/40">
          Features
        </span>
      </div>
      <h2 className="font-[family-name:var(--font-instrument-serif)] text-2xl tracking-tight text-black/90 italic dark:text-white">
        What&rsquo;s inside
      </h2>

      <div className="mt-10 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((cap) => (
          <div key={cap.label} className="py-5 sm:pr-8 lg:pr-10">
            <h3 className="text-sm font-semibold text-black/90 dark:text-white/90">
              {cap.title}
            </h3>
            {cap.label === "more" ? (
              <div className="mt-2.5 flex flex-wrap gap-x-2 gap-y-1.5 text-black/30 dark:text-white/20">
                <RedactedText cols={14} rows={3} size={3}>
                  Simulation
                </RedactedText>
                <RedactedText cols={16} rows={3} size={3}>
                  integration
                </RedactedText>
                <RedactedText cols={10} rows={3} size={3}>
                  component
                </RedactedText>
                <RedactedText cols={18} rows={3} size={3}>
                  marketplace
                </RedactedText>
                <RedactedText cols={8} rows={3} size={3}>
                  cloud
                </RedactedText>
                <RedactedText cols={20} rows={3} size={3}>
                  collaboration
                </RedactedText>
                <RedactedText cols={12} rows={3} size={3}>
                  and more
                </RedactedText>
                <RedactedText cols={14} rows={3} size={3}>
                  actively
                </RedactedText>
                <RedactedText cols={16} rows={3} size={3}>
                  developed
                </RedactedText>
                <RedactedText cols={10} rows={3} size={3}>
                  shaped
                </RedactedText>
                <RedactedText cols={18} rows={3} size={3}>
                  by community
                </RedactedText>
                <RedactedText cols={12} rows={3} size={3}>
                  rosette
                </RedactedText>
                <RedactedText cols={16} rows={3} size={3}>
                  open source
                </RedactedText>
                <RedactedText cols={10} rows={3} size={3}>
                  tools
                </RedactedText>
                <RedactedText cols={14} rows={3} size={3}>
                  platform
                </RedactedText>
                <RedactedText cols={8} rows={3} size={3}>
                  next
                </RedactedText>
                <RedactedText cols={18} rows={3} size={3}>
                  generation
                </RedactedText>
                <RedactedText cols={12} rows={3} size={3}>
                  design
                </RedactedText>
              </div>
            ) : (
              <p className="mt-1.5 text-sm leading-relaxed text-black/50 dark:text-white/50">
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
/*  Closing CTA                                                               */
/* -------------------------------------------------------------------------- */

function ClosingCTA() {
  return (
    <section className="relative">
      {/* Top divider */}
      <div className="absolute inset-x-0 top-0 mx-auto max-w-6xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-16 pb-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-instrument-serif)] text-3xl tracking-tight text-black/90 sm:text-4xl dark:text-white">
            Your GDSII{" "}
            <span className="text-brand-purple dark:text-brand-purple-light">
              layout editor
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-black/50 dark:text-white/60">
            Thousands of geometry operations, routing decisions, and design
            checks &mdash; compiled to native code and wrapped in an accessible
            interface.{" "}
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            {/* pip install — Python API */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="inline-flex h-11 cursor-not-allowed items-center rounded-lg border border-black/10 border-b-black/15 bg-white px-5 opacity-50 shadow-sm font-[family-name:var(--font-geist-mono)] text-sm text-black/70 dark:border-white/10 dark:border-b-white/15 dark:bg-neutral-900 dark:text-white/70 dark:shadow-none">
                <span className="select-none text-black/30 dark:text-white/30">
                  $&nbsp;
                </span>
                pip install{" "}
                <RedactedText className="ml-1.5">rosette</RedactedText>
                <CopyButton text="pip install rosette" disabled />
              </div>
              <span className="text-[11px] text-black/30 dark:text-white/30">
                Python API &middot; coming soon
              </span>
            </div>

            {/* Download — Desktop app */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-lg border border-brand-purple-dark/50 bg-brand-purple px-6 text-sm font-medium text-white opacity-50 shadow-sm shadow-brand-purple-dark/30 ring-1 ring-inset ring-white/15">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Download
              </div>
              <span className="text-[11px] text-black/30 dark:text-white/30">
                Desktop app &middot; coming soon
              </span>
            </div>

            {/* GitHub — Source code */}
            <div className="flex flex-col items-center gap-1.5">
              <a
                href="https://github.com/prefab-photonics/rosette"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-black/10 border-b-black/15 bg-white px-5 shadow-sm text-sm font-medium text-black/70 transition-colors hover:border-black/20 hover:text-black dark:border-white/10 dark:border-b-white/15 dark:bg-neutral-900 dark:text-white/70 dark:shadow-none dark:hover:border-white/20 dark:hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </a>
              <span className="text-[11px] text-black/30 dark:text-white/30">
                Source code
              </span>
            </div>
          </div>
        </div>
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
      <WhatsInside />
      <ClosingCTA />
    </>
  );
}
