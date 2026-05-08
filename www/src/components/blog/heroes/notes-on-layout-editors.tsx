import { BlogHeroFrame } from "../hero";

/**
 * Hero graphic for the "Notes on Building a Layout Editor" post.
 *
 * Concept: a stylized view of the editor itself — thin top/bottom chrome, a
 * cells tree on the left, a layers list on the right, and a composition of
 * abstract filled polygons on the canvas in the middle. Monochrome throughout:
 * both the layer swatches and the canvas shapes use the same fill patterns
 * (solid, hatched, crosshatched, dotted) to distinguish layers, matching how
 * Rosette's viewer actually renders geometry.
 */
export function NotesOnLayoutEditorsHero() {
  return (
    <BlogHeroFrame aspect="2/1">
      <svg
        viewBox="0 0 1200 600"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="h-full w-full"
      >
        <defs>
          {/* Fill patterns for layer-row swatches. All use fd-foreground via
              currentColor, inherited from a wrapper <g className="text-fd-foreground">. */}
          <pattern
            id="swatch-solid"
            patternUnits="userSpaceOnUse"
            width="12"
            height="12"
          >
            <rect
              width="12"
              height="12"
              fill="currentColor"
              fillOpacity="0.55"
            />
          </pattern>
          <pattern
            id="swatch-hatched"
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="4"
              stroke="currentColor"
              strokeOpacity="0.7"
              strokeWidth="1"
            />
          </pattern>
          <pattern
            id="swatch-crosshatched"
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="4"
              stroke="currentColor"
              strokeOpacity="0.7"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="0"
              x2="4"
              y2="0"
              stroke="currentColor"
              strokeOpacity="0.7"
              strokeWidth="1"
            />
          </pattern>
          <pattern
            id="swatch-dotted"
            patternUnits="userSpaceOnUse"
            width="3"
            height="3"
          >
            <circle
              cx="1.5"
              cy="1.5"
              r="0.7"
              fill="currentColor"
              fillOpacity="0.7"
            />
          </pattern>
        </defs>

        {/* ── EDITOR CHROME ─────────────────────────────────────────────── */}

        {/* Top bar */}
        <g className="fill-fd-muted stroke-fd-border" strokeWidth="1">
          <rect x="0" y="0" width="1200" height="28" />
        </g>
        <g>
          <circle cx="18" cy="14" r="4" className="fill-fd-border" />
          <circle cx="32" cy="14" r="4" className="fill-fd-border" />
          <circle cx="46" cy="14" r="4" className="fill-fd-border" />
        </g>
        <g
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          className="fill-fd-muted-foreground"
          fontSize="10"
        >
          <text x="70" y="18" opacity="0.6">
            designs / chip.py
          </text>
        </g>
        <line
          x1="0"
          y1="28"
          x2="1200"
          y2="28"
          className="stroke-fd-border"
          strokeWidth="1"
        />

        {/* Left sidebar — Cells panel */}
        <g>
          <rect
            x="0"
            y="28"
            width="180"
            height="544"
            className="fill-fd-card stroke-fd-border"
            strokeWidth="1"
          />
        </g>
        <line
          x1="180"
          y1="28"
          x2="180"
          y2="572"
          className="stroke-fd-border"
          strokeWidth="1"
        />

        {/* Cells panel header */}
        <g
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          fontSize="9"
          className="fill-fd-muted-foreground"
        >
          <text x="16" y="52" opacity="0.55" letterSpacing="0.08em">
            CELLS
          </text>
        </g>

        {/* Cells tree rows. Chevrons: ▾ expanded, ▸ collapsed. */}
        <g
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          fontSize="10"
          className="fill-fd-foreground"
        >
          {/* top (root, expanded, active) */}
          <rect
            x="6"
            y="64"
            width="168"
            height="18"
            rx="3"
            className="fill-fd-muted"
            opacity="0.7"
          />
          <text x="16" y="77" opacity="0.9">
            ▾
          </text>
          <text x="28" y="77" opacity="0.9">
            top
          </text>

          {/* block_a (child, collapsed) */}
          <text x="28" y="98" opacity="0.75">
            ▸
          </text>
          <text x="40" y="98" opacity="0.75">
            block_a
          </text>

          {/* block_b (child, collapsed) */}
          <text x="28" y="119" opacity="0.75">
            ▸
          </text>
          <text x="40" y="119" opacity="0.75">
            block_b
          </text>

          {/* connector (child, expanded) */}
          <text x="28" y="140" opacity="0.75">
            ▾
          </text>
          <text x="40" y="140" opacity="0.75">
            connector
          </text>

          {/* trace (grandchild, collapsed) */}
          <text x="52" y="161" opacity="0.6">
            ▸
          </text>
          <text x="64" y="161" opacity="0.6">
            trace
          </text>

          {/* corner (grandchild, collapsed) */}
          <text x="52" y="182" opacity="0.6">
            ▸
          </text>
          <text x="64" y="182" opacity="0.6">
            corner
          </text>

          {/* pad_array (child, collapsed) */}
          <text x="28" y="203" opacity="0.75">
            ▸
          </text>
          <text x="40" y="203" opacity="0.75">
            pad_array
          </text>

          {/* marker (child, collapsed, dimmer — less-used) */}
          <text x="28" y="224" opacity="0.5">
            ▸
          </text>
          <text x="40" y="224" opacity="0.5">
            marker
          </text>
        </g>

        {/* Right sidebar — Layers panel */}
        <g>
          <rect
            x="1020"
            y="28"
            width="180"
            height="544"
            className="fill-fd-card stroke-fd-border"
            strokeWidth="1"
          />
        </g>
        <line
          x1="1020"
          y1="28"
          x2="1020"
          y2="572"
          className="stroke-fd-border"
          strokeWidth="1"
        />

        {/* Layers panel header */}
        <g
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          fontSize="9"
          className="fill-fd-muted-foreground"
        >
          <text x="1036" y="52" opacity="0.55" letterSpacing="0.08em">
            LAYERS
          </text>
        </g>

        {/* Layer-row swatches (monochrome, pattern-filled). All share
            text-fd-foreground so currentColor in the patterns resolves to
            the theme's foreground. */}
        <g className="text-fd-foreground">
          {/* silicon — solid */}
          <rect
            x="1036"
            y="66"
            width="12"
            height="12"
            rx="2"
            fill="url(#swatch-solid)"
          />
          <rect
            x="1036"
            y="66"
            width="12"
            height="12"
            rx="2"
            fill="none"
            className="stroke-fd-border"
            strokeWidth="0.75"
          />
          {/* oxide — hatched */}
          <rect
            x="1036"
            y="88"
            width="12"
            height="12"
            rx="2"
            fill="url(#swatch-hatched)"
          />
          <rect
            x="1036"
            y="88"
            width="12"
            height="12"
            rx="2"
            fill="none"
            className="stroke-fd-border"
            strokeWidth="0.75"
          />
          {/* metal1 — crosshatched */}
          <rect
            x="1036"
            y="110"
            width="12"
            height="12"
            rx="2"
            fill="url(#swatch-crosshatched)"
          />
          <rect
            x="1036"
            y="110"
            width="12"
            height="12"
            rx="2"
            fill="none"
            className="stroke-fd-border"
            strokeWidth="0.75"
          />
          {/* nitride — dotted */}
          <rect
            x="1036"
            y="132"
            width="12"
            height="12"
            rx="2"
            fill="url(#swatch-dotted)"
          />
          <rect
            x="1036"
            y="132"
            width="12"
            height="12"
            rx="2"
            fill="none"
            className="stroke-fd-border"
            strokeWidth="0.75"
          />
          {/* labels — outline only (unused / decorative) */}
          <rect
            x="1036"
            y="154"
            width="12"
            height="12"
            rx="2"
            fill="none"
            className="stroke-fd-border"
            strokeWidth="0.75"
          />
        </g>

        {/* Layer names */}
        <g
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          fontSize="10"
          className="fill-fd-foreground"
        >
          <text x="1060" y="76" opacity="0.8">
            silicon
          </text>
          <text x="1060" y="98" opacity="0.8">
            oxide
          </text>
          <text x="1060" y="120" opacity="0.8">
            metal1
          </text>
          <text x="1060" y="142" opacity="0.8">
            nitride
          </text>
          <text x="1060" y="164" opacity="0.45">
            labels
          </text>
        </g>

        {/* Layer-number tails */}
        <g
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          fontSize="8"
          className="fill-fd-muted-foreground"
        >
          <text x="1160" y="76" opacity="0.5">
            1/0
          </text>
          <text x="1160" y="98" opacity="0.5">
            2/0
          </text>
          <text x="1160" y="120" opacity="0.5">
            10/0
          </text>
          <text x="1160" y="142" opacity="0.5">
            3/0
          </text>
          <text x="1160" y="164" opacity="0.35">
            100/0
          </text>
        </g>

        {/* Bottom status bar */}
        <line
          x1="0"
          y1="572"
          x2="1200"
          y2="572"
          className="stroke-fd-border"
          strokeWidth="1"
        />
        <g>
          <rect
            x="0"
            y="572"
            width="1200"
            height="28"
            className="fill-fd-muted"
          />
        </g>
        <g
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          fontSize="10"
          className="fill-fd-muted-foreground"
        >
          <text x="16" y="590" opacity="0.65">
            x: 127.350 µm
          </text>
          <text x="130" y="590" opacity="0.65">
            y: −42.100 µm
          </text>
          <g opacity="0.7">
            <line
              x1="560"
              y1="586"
              x2="620"
              y2="586"
              className="stroke-fd-muted-foreground"
              strokeWidth="1"
            />
            <line
              x1="560"
              y1="582"
              x2="560"
              y2="590"
              className="stroke-fd-muted-foreground"
              strokeWidth="1"
            />
            <line
              x1="620"
              y1="582"
              x2="620"
              y2="590"
              className="stroke-fd-muted-foreground"
              strokeWidth="1"
            />
            <text x="628" y="590">
              10 µm
            </text>
          </g>
          <text x="1100" y="590" opacity="0.65">
            zoom: 12.4×
          </text>
        </g>

        {/* ── CANVAS CONTENT (abstract layout shapes) ──────────────────── */}
        {/* Canvas occupies x: 180..1020, y: 28..572. Uses the same fill
            patterns as the layer swatches so the canvas visually echoes the
            layer panel. All shapes inherit currentColor via text-fd-foreground. */}

        <g className="text-fd-foreground">
          {/* Dot grid — sparse, fills the full canvas height */}
          <g className="fill-fd-muted-foreground" opacity="0.18">
            {Array.from({ length: 22 }).flatMap((_, row) =>
              Array.from({ length: 18 }).map((_, col) => {
                const cx = 220 + col * 45;
                const cy = 60 + row * 24;
                return <circle key={`d-${cx}-${cy}`} cx={cx} cy={cy} r="0.9" />;
              }),
            )}
          </g>

          {/* All abstract shapes are wrapped in a translate so they sit
              vertically centered in the (now taller) canvas without having to
              rewrite each shape's y coordinate. */}
          <g transform="translate(0, 115)">
            {/* ── Large outlined block (upper-left) — the "main cell" ────── */}
            <g>
              <rect
                x="220"
                y="70"
                width="180"
                height="110"
                rx="2"
                fill="url(#swatch-hatched)"
                opacity="0.9"
              />
              <rect
                x="220"
                y="70"
                width="180"
                height="110"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                opacity="0.85"
              />
              {/* Two inner rectangles, hinting at child cells */}
              <rect
                x="238"
                y="88"
                width="54"
                height="34"
                fill="url(#swatch-solid)"
                opacity="0.95"
              />
              <rect
                x="238"
                y="88"
                width="54"
                height="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.85"
              />
              <rect
                x="310"
                y="88"
                width="74"
                height="34"
                fill="url(#swatch-crosshatched)"
                opacity="0.9"
              />
              <rect
                x="310"
                y="88"
                width="74"
                height="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.85"
              />
              {/* Thin bar along the bottom */}
              <rect
                x="238"
                y="140"
                width="146"
                height="22"
                fill="url(#swatch-dotted)"
                opacity="0.9"
              />
              <rect
                x="238"
                y="140"
                width="146"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.85"
              />
            </g>

            {/* ── L-shape connector (center-left) ───────────────────────── */}
            <g>
              <path
                d="M 420 100 L 480 100 L 480 130 L 540 130 L 540 150 L 420 150 Z"
                fill="url(#swatch-solid)"
                opacity="0.85"
              />
              <path
                d="M 420 100 L 480 100 L 480 130 L 540 130 L 540 150 L 420 150 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                opacity="0.85"
              />
            </g>

            {/* ── Donut / annular ring (center) ─────────────────────────── */}
            {/* Outer hatched disc, then a background-colored inner disc to
              "erase" the middle, then the two stroked circles on top. Avoids
              the alignment pitfalls of evenodd path fills. */}
            <g>
              <circle
                cx="620"
                cy="130"
                r="34"
                fill="url(#swatch-hatched)"
                opacity="0.9"
              />
              <circle cx="620" cy="130" r="16" className="fill-fd-card" />
              <circle
                cx="620"
                cy="130"
                r="34"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                opacity="0.9"
              />
              <circle
                cx="620"
                cy="130"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                opacity="0.85"
              />
            </g>

            {/* ── 4x3 array of small squares (AREF hint, center-right) ──── */}
            <g>
              {Array.from({ length: 3 }).flatMap((_, row) =>
                Array.from({ length: 4 }).map((_, col) => {
                  const x = 700 + col * 22;
                  const y = 90 + row * 22;
                  return (
                    <g key={`a-${x}-${y}`}>
                      <rect
                        x={x}
                        y={y}
                        width="12"
                        height="12"
                        fill="url(#swatch-solid)"
                        opacity="0.85"
                      />
                      <rect
                        x={x}
                        y={y}
                        width="12"
                        height="12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.75"
                        opacity="0.75"
                      />
                    </g>
                  );
                }),
              )}
              {/* Array bounding box (dashed), showing the AREF as a single unit */}
              <rect
                x="696"
                y="86"
                width="96"
                height="62"
                fill="none"
                stroke="currentColor"
                strokeDasharray="4 3"
                strokeWidth="0.75"
                opacity="0.45"
              />
            </g>

            {/* ── Rotated / diagonal polygon (right) ────────────────────── */}
            <g transform="rotate(30 870 140)">
              <rect
                x="820"
                y="110"
                width="100"
                height="60"
                rx="2"
                fill="url(#swatch-crosshatched)"
                opacity="0.9"
              />
              <rect
                x="820"
                y="110"
                width="100"
                height="60"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                opacity="0.85"
              />
            </g>

            {/* ── Lower-band shapes: pad/pin array (bottom-left) ────────── */}
            <g>
              {Array.from({ length: 6 }).map((_, i) => {
                const x = 230 + i * 42;
                return (
                  <g key={`pad-${x}`}>
                    <rect
                      x={x}
                      y="240"
                      width="28"
                      height="48"
                      rx="2"
                      fill="url(#swatch-solid)"
                      opacity="0.9"
                    />
                    <rect
                      x={x}
                      y="240"
                      width="28"
                      height="48"
                      rx="2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      opacity="0.85"
                    />
                  </g>
                );
              })}
            </g>

            {/* ── Lower-band shapes: two rectangles + thin strip (bottom-right) ── */}
            <g>
              {/* Wide dotted rectangle */}
              <rect
                x="560"
                y="255"
                width="220"
                height="36"
                fill="url(#swatch-dotted)"
                opacity="0.9"
              />
              <rect
                x="560"
                y="255"
                width="220"
                height="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.85"
              />
              {/* Smaller solid rectangle overlapping it */}
              <rect
                x="810"
                y="243"
                width="90"
                height="60"
                fill="url(#swatch-hatched)"
                opacity="0.9"
              />
              <rect
                x="810"
                y="243"
                width="90"
                height="60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.85"
              />
            </g>

            {/* ── Crosshair cursor (near the donut) ─────────────────────── */}
            <g
              className="stroke-fd-foreground"
              strokeWidth="1"
              fill="none"
              opacity="0.85"
            >
              <line x1="663" y1="130" x2="677" y2="130" />
              <line x1="670" y1="123" x2="670" y2="137" />
            </g>
          </g>
        </g>
      </svg>
    </BlogHeroFrame>
  );
}
