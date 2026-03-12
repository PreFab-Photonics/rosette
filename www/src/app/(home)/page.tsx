import {
  BrainElectricity,
  Cube,
  Eye,
  Flash,
  GitFork,
  Globe,
  PathArrow,
  Ruler,
  ShieldCheck,
} from "iconoir-react";
import Link from "next/link";
import { CopyButton } from "./components/copy-button";
import { ViewerEmbed } from "./components/viewer-embed";

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
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-28 sm:pt-36">
      {/* Hero text */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-black/90 sm:text-5xl lg:text-6xl dark:text-white/90">
          The modern photonic layout editor
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-black/50 dark:text-white/50">
          A layout engine for photonic integrated circuits.{" "}
          <span className="font-medium text-black/80 dark:text-white/80">
            Fast. Intelligent. Accessible.
          </span>
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          {/* pip install */}
          <div className="inline-flex h-11 items-center rounded-lg border border-black/10 bg-black/[0.03] px-5 font-[family-name:var(--font-geist-mono)] text-sm text-black/70 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70">
            <span className="select-none text-black/30 dark:text-white/30">
              $&nbsp;
            </span>
            pip install rosette
            <CopyButton text="pip install rosette" />
          </div>

          {/* Install app (disabled) */}
          <button
            type="button"
            disabled
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-black px-6 text-sm font-medium text-white opacity-40 dark:bg-white dark:text-black"
            title="Coming soon"
          >
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
            Install app
          </button>

          {/* GitHub */}
          <Link
            href="https://github.com/PreFab-Photonics/rosette"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-black/10 px-5 text-sm font-medium text-black/70 transition-colors hover:bg-black/[0.03] dark:border-white/10 dark:text-white/70 dark:hover:bg-white/[0.03]"
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
          </Link>
        </div>
      </div>

      {/* Full-width viewer */}
      <div className="mt-14">
        <ViewerEmbed
          src="/viewer/index.html?embed=true"
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
    icon: <Flash className="h-5 w-5" />,
    title: "Fast",
    description:
      "Geometry, routing, DRC, and GDS I/O compile to native Rust. Thousands of operations resolve in milliseconds, not minutes.",
  },
  {
    icon: <BrainElectricity className="h-5 w-5" />,
    title: "Intelligent",
    description:
      "AI-native from day one. Ships with agent instructions, type stubs, and structured build feedback so coding tools design circuits alongside you.",
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Accessible",
    description:
      "A clean Python API over a compiled core. Open source, editable components, live visual preview, and a native desktop app. Use it however you work.",
  },
];

function WhyRosette() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-2xl font-bold tracking-tight text-black/90 dark:text-white/90">
        Why Rosette?
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-black/50 dark:text-white/50">
        Three principles behind every design decision in Rosette.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {reasons.map((reason) => (
          <div key={reason.title} className="p-6">
            <div className="text-black/60 dark:text-white/60">
              {reason.icon}
            </div>
            <h3 className="mt-3 text-sm font-semibold text-black/90 dark:text-white/90">
              {reason.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-black/50 dark:text-white/50">
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
    icon: <PathArrow className="h-5 w-5" />,
    title: "Intelligent routing",
    description:
      "Route.through() handles bends, tapers, and width transitions automatically. Euler bends minimize optical loss. Radius auto-reduces when space is tight, with warnings.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Design rule checking",
    description:
      "Seven check types: min width, min spacing, min area, enclosure, overlap rules, and allowed angles. Configurable in TOML, executed at Rust speed.",
  },
  {
    icon: <Eye className="h-5 w-5" />,
    title: "Live preview",
    description:
      "rosette serve gives instant visual feedback with hot reload. WebGPU-rendered viewer handles millions of polygons. Ships as a native desktop app too.",
  },
  {
    icon: <Cube className="h-5 w-5" />,
    title: "Photonic components",
    description:
      "Waveguides, Euler bends, tapers, S-bends, MMIs, directional couplers, ring resonators, grating couplers, spirals, and crossings. Consistent port conventions.",
  },
  {
    icon: <GitFork className="h-5 w-5" />,
    title: "Hierarchical cells",
    description:
      "Cell-based design with the .at() instance API for ergonomic placement. Transform chaining, automatic child-cell collection for GDS export.",
  },
  {
    icon: <Ruler className="h-5 w-5" />,
    title: "Path length tracking",
    description:
      "Every component and route tracks its optical path length. Critical for Mach-Zehnder interferometers, balanced detection, and phase-sensitive designs.",
  },
];

function WhatsInside() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-2xl font-bold tracking-tight text-black/90 dark:text-white/90">
        What&rsquo;s inside
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-black/50 dark:text-white/50">
        Everything you need to go from design to fabrication-ready GDSII, with
        no GUI required.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map((cap) => (
          <div key={cap.title} className="p-6">
            <div className="text-black/60 dark:text-white/60">{cap.icon}</div>
            <h3 className="mt-3 text-sm font-semibold text-black/90 dark:text-white/90">
              {cap.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-black/50 dark:text-white/50">
              {cap.description}
            </p>
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
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-black/90 sm:text-4xl dark:text-white/90">
          The modern photonic layout editor
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-black/50 dark:text-white/50">
          Thousands of geometry operations, routing decisions, and design checks
          &mdash; compiled to native code and wrapped in a clean Python API.{" "}
          <span className="font-medium text-black/80 dark:text-white/80">
            Fast. Intelligent. Accessible.
          </span>
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          {/* pip install */}
          <div className="inline-flex h-11 items-center rounded-lg border border-black/10 bg-black/[0.03] px-5 font-[family-name:var(--font-geist-mono)] text-sm text-black/70 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70">
            <span className="select-none text-black/30 dark:text-white/30">
              $&nbsp;
            </span>
            pip install rosette
            <CopyButton text="pip install rosette" />
          </div>

          {/* Install app (disabled) */}
          <button
            type="button"
            disabled
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-black px-6 text-sm font-medium text-white opacity-40 dark:bg-white dark:text-black"
            title="Coming soon"
          >
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
            Install app
          </button>

          {/* GitHub */}
          <Link
            href="https://github.com/PreFab-Photonics/rosette"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-black/10 px-5 text-sm font-medium text-black/70 transition-colors hover:bg-black/[0.03] dark:border-white/10 dark:text-white/70 dark:hover:bg-white/[0.03]"
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
          </Link>
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
