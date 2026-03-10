import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-24 pt-32 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-black/90 sm:text-6xl dark:text-white/90">
        Design photonics with code
      </h1>

      <p className="mx-auto mt-6 max-w-xl text-lg text-black/50 dark:text-white/50">
        Python API. Rust core. Agentic from day one.
      </p>

      <div className="mt-10 flex items-center justify-center gap-4">
        <Link
          href="/docs"
          className="inline-flex h-10 items-center rounded-lg bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          Get Started
        </Link>
        <a
          href="https://github.com/prefab-photonics/rosette"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center rounded-lg border border-black/10 px-5 text-sm font-medium text-black/70 transition-colors hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
        >
          GitHub
        </a>
      </div>

      <div className="mx-auto mt-12 max-w-sm rounded-xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
        <pre className="text-sm font-[family-name:var(--font-geist-mono)] text-black/70 dark:text-white/70">
          <code>pip install rosette</code>
        </pre>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Feature Pillars                                                           */
/* -------------------------------------------------------------------------- */

const pillars = [
  {
    title: "Rust-fast",
    description:
      "Geometry, routing, DRC, and GDS I/O execute in compiled Rust. You write Python.",
  },
  {
    title: "Agentic",
    description:
      "Built for AI workflows. Ships with agent instructions, type stubs, and feedback loops so AI tools can design circuits.",
  },
  {
    title: "Own your components",
    description:
      "shadcn-style: components are plain Python functions copied to your project. Read, modify, extend.",
  },
] as const;

function Pillars() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="grid gap-6 sm:grid-cols-3">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-xl border border-black/10 p-6 dark:border-white/10"
          >
            <h3 className="text-sm font-medium text-black/90 dark:text-white/90">
              {pillar.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-black/50 dark:text-white/50">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Feature Showcase                                                          */
/* -------------------------------------------------------------------------- */

const features = [
  {
    title: "Automatic routing",
    description:
      "Route.through() handles bends, tapers, and width transitions. Euler bends minimize loss. Radius auto-reduces when space is tight, with warnings.",
    code: `route = Route.through(
    mmi.port("out1"),
    Point(200, 50),
    ring.port("in"),
    layer=layers.core,
    width=0.5,
    bend_radius=10.0,
)`,
  },
  {
    title: "Built-in DRC",
    description:
      "Seven check types: min width, min spacing, min area, enclosure, overlap rules, and allowed angles. Configurable in TOML. Runs at Rust speed.",
    code: `[drc.layers.core]
min_width = 0.15
min_spacing = 0.15
min_area = 0.01
allowed_angles = [0, 45, 90, 135, 180]`,
  },
  {
    title: "Live viewer",
    description:
      "rosette serve gives instant visual feedback with hot reload. WebGPU rendering handles millions of polygons. Also ships as a native desktop app.",
    code: `$ rosette serve design.py

  Watching design.py for changes...
  Serving at http://localhost:8000`,
  },
  {
    title: "13 photonic components",
    description:
      "Waveguides, Euler bends, MMIs, directional couplers, ring resonators, grating couplers, spirals, crossings, and more. All with consistent port conventions.",
    code: `from components.ring import ring
from components.grating_coupler import grating_coupler

r = ring(
    layer=layers.core,
    radius=10.0,
    coupling_gap=0.2,
    style="add-drop",
)`,
  },
] as const;

function Features() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="space-y-20">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="grid items-start gap-8 sm:grid-cols-2"
          >
            <div>
              <h3 className="text-lg font-medium text-black/90 dark:text-white/90">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-black/50 dark:text-white/50">
                {feature.description}
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-black/10 bg-black/5 p-5 dark:border-white/10 dark:bg-white/5">
              <pre className="text-[13px] leading-relaxed font-[family-name:var(--font-geist-mono)] text-black/70 dark:text-white/70">
                <code>{feature.code}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Full Example                                                              */
/* -------------------------------------------------------------------------- */

const fullExample = `import rosette as ro
from rosette import Point, Layer

# Load project configuration
layers = ro.load_layer_map()

# Import components — you own these files
from components.mmi import mmi_1x2
from components.bend import bend
from components.grating_coupler import grating_coupler

# Create components
splitter = mmi_1x2(layer=layers.core)
gc_in = grating_coupler(layer=layers.core)
gc_out = grating_coupler(layer=layers.core)

# Assemble the design
chip = ro.Cell("splitter_tree")

gc = chip.place(gc_in).at(0, 0)
mmi = chip.place(splitter).at(100, 0)

ro.Route.through(gc.port("opt"), mmi.port("in"),
    layer=layers.core, width=0.5, bend_radius=10.0)

# Export
ro.write_gds("splitter_tree.gds", chip)`;

function FullExample() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <h2 className="text-center text-2xl font-bold tracking-tight text-black/90 dark:text-white/90">
        From idea to GDS in one file
      </h2>
      <p className="mx-auto mt-4 max-w-lg text-center text-sm text-black/50 dark:text-white/50">
        Components are plain Python functions. Place them, route between their
        ports, and export. No GUI required.
      </p>

      <div className="mt-10 overflow-x-auto rounded-xl border border-black/10 bg-black/5 p-6 dark:border-white/10 dark:bg-white/5">
        <pre className="text-[13px] leading-relaxed font-[family-name:var(--font-geist-mono)] text-black/70 dark:text-white/70">
          <code>{fullExample}</code>
        </pre>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bottom CTA                                                                */
/* -------------------------------------------------------------------------- */

function BottomCTA() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24 text-center">
      <h2 className="text-2xl font-bold tracking-tight text-black/90 dark:text-white/90">
        Get started
      </h2>

      <div className="mx-auto mt-8 max-w-sm rounded-xl border border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
        <pre className="text-sm font-[family-name:var(--font-geist-mono)] text-black/70 dark:text-white/70">
          <code>pip install rosette</code>
        </pre>
      </div>

      <div className="mt-8">
        <Link
          href="/docs"
          className="inline-flex h-10 items-center rounded-lg bg-black px-5 text-sm font-medium text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          Read the docs
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
      <Pillars />
      <Features />
      <FullExample />
      <BottomCTA />
    </>
  );
}
