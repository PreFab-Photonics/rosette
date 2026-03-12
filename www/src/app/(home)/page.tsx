import Link from "next/link";
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
          Design photonics with code
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-black/50 dark:text-white/50">
          A layout engine for photonic integrated circuits.{" "}
          <span className="font-medium text-black/80 dark:text-white/80">
            Rust core. Python API. AI&#8209;native.
          </span>
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <div className="inline-flex h-11 items-center rounded-lg border border-black/10 bg-black/[0.03] px-5 font-[family-name:var(--font-geist-mono)] text-sm text-black/70 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70">
            <span className="select-none text-black/30 dark:text-white/30">
              $&nbsp;
            </span>
            pip install rosette
          </div>

          <span className="text-sm text-black/30 dark:text-white/30">or</span>

          <Link
            href="/docs"
            className="inline-flex h-11 items-center rounded-lg bg-black px-6 text-sm font-medium text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            Get started
          </Link>
        </div>
      </div>

      {/* Full-width viewer */}
      <div className="mt-14">
        <ViewerEmbed
          src="/viewer/index.html?embed=true&src=./showcase.json"
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
    title: "Rust core, Python API",
    description:
      "Geometry, routing, DRC, and GDS I/O execute in compiled Rust. You write Python. Near-native speed with a scripting workflow.",
  },
  {
    title: "AI-native",
    description:
      "Ships with agent instructions, type stubs, and structured build feedback. AI coding tools design circuits alongside you from day one.",
  },
  {
    title: "Own your components",
    description:
      "shadcn-style: 13 photonic components are plain Python functions copied to your project. Read them, modify them, extend them.",
  },
  {
    title: "Fabrication-ready",
    description:
      "Industry-standard GDSII output, built-in design rule checking, and path length tracking for phase-sensitive photonic designs.",
  },
] as const;

function WhyRosette() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="text-2xl font-bold tracking-tight text-black/90 dark:text-white/90">
        Why Rosette?
      </h2>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-black/50 dark:text-white/50">
        A modern foundation for photonic chip design. Fast, open, and built for
        how people actually work today.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {reasons.map((reason) => (
          <div
            key={reason.title}
            className="rounded-xl border border-black/10 p-6 dark:border-white/10"
          >
            <h3 className="text-sm font-semibold text-black/90 dark:text-white/90">
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
    title: "Intelligent routing",
    description:
      "Route.through() handles bends, tapers, and width transitions automatically. Euler bends minimize optical loss. Radius auto-reduces when space is tight, with warnings.",
  },
  {
    title: "Design rule checking",
    description:
      "Seven check types: min width, min spacing, min area, enclosure, overlap rules, and allowed angles. Configurable in TOML, executed at Rust speed.",
  },
  {
    title: "Live preview",
    description:
      "rosette serve gives instant visual feedback with hot reload. WebGPU-rendered viewer handles millions of polygons. Ships as a native desktop app too.",
  },
  {
    title: "Photonic components",
    description:
      "Waveguides, Euler bends, tapers, S-bends, MMIs, directional couplers, ring resonators, grating couplers, spirals, and crossings. Consistent port conventions.",
  },
  {
    title: "Hierarchical cells",
    description:
      "Cell-based design with the .at() instance API for ergonomic placement. Transform chaining, automatic child-cell collection for GDS export.",
  },
  {
    title: "Path length tracking",
    description:
      "Every component and route tracks its optical path length. Critical for Mach-Zehnder interferometers, balanced detection, and phase-sensitive designs.",
  },
] as const;

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
          <div
            key={cap.title}
            className="rounded-xl border border-black/10 p-6 dark:border-white/10"
          >
            <h3 className="text-sm font-semibold text-black/90 dark:text-white/90">
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
          The photonic layout engine
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-black/50 dark:text-white/50">
          Thousands of geometry operations, routing decisions, and design checks
          &mdash; compiled to native code and wrapped in a clean Python API.{" "}
          <span className="font-medium text-black/80 dark:text-white/80">
            Take the engine and build something real.
          </span>
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <div className="inline-flex h-11 items-center rounded-lg border border-black/10 bg-black/[0.03] px-5 font-[family-name:var(--font-geist-mono)] text-sm text-black/70 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70">
            <span className="select-none text-black/30 dark:text-white/30">
              $&nbsp;
            </span>
            pip install rosette
          </div>

          <span className="hidden text-sm text-black/30 sm:inline dark:text-white/30">
            or
          </span>

          <Link
            href="/docs"
            className="inline-flex h-11 items-center rounded-lg bg-black px-6 text-sm font-medium text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            Read the docs
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
