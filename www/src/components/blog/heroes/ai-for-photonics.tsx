import { BlogHeroFrame } from "../hero";

/**
 * Hero graphic for the "Why Photonic Design Fits AI" post.
 *
 * Concept: a natural-language prompt on the left dissolves through a cloud of
 * particles into photonic layout geometry on the right. Visualizes the thesis
 * that AI turns intent into layout.
 */
export function AiForPhotonicsHero() {
  return (
    <BlogHeroFrame>
      <svg
        viewBox="0 0 1200 400"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="h-full w-full"
      >
        <defs>
          {/* Fade mask: text side fades out toward center */}
          <linearGradient id="text-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="55%" stopColor="white" stopOpacity="1" />
            <stop offset="95%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="text-mask">
            <rect width="500" height="400" fill="url(#text-fade)" />
          </mask>

          {/* Fade mask: layout side fades out toward center */}
          <linearGradient id="layout-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="30%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="1" />
          </linearGradient>
          <mask id="layout-mask">
            <rect x="580" width="620" height="400" fill="url(#layout-fade)" />
          </mask>

          {/* Radial glow for the particle cloud */}
          <radialGradient id="particle-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="80%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="particle-mask">
            <ellipse
              cx="560"
              cy="200"
              rx="220"
              ry="190"
              fill="url(#particle-glow)"
            />
          </mask>
        </defs>

        {/* ── LEFT: Prompt text ────────────────────────────────────────── */}
        <g mask="url(#text-mask)">
          <g
            fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif"
            className="fill-fd-foreground"
          >
            <text
              x="80"
              y="180"
              fontSize="17"
              opacity="0.6"
              letterSpacing="0.01em"
              fontStyle="italic"
            >
              "Design a third-order serial
            </text>
            <text
              x="80"
              y="203"
              fontSize="17"
              opacity="0.5"
              letterSpacing="0.01em"
              fontStyle="italic"
            >
              ring resonator filter with
            </text>
            <text
              x="80"
              y="226"
              fontSize="17"
              opacity="0.4"
              letterSpacing="0.01em"
              fontStyle="italic"
            >
              input and drop ports"
            </text>
          </g>
        </g>

        {/* ── MIDDLE: Code fragment cloud ──────────────────────────────── */}
        <g mask="url(#particle-mask)">
          <g
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            className="fill-fd-foreground"
          >
            {/* Upper region — sparse, small */}
            <text
              x="430"
              y="95"
              fontSize="8"
              opacity="0.4"
              transform="rotate(-12 430 95)"
            >
              Layer
            </text>
            <text
              x="490"
              y="102"
              fontSize="7"
              opacity="0.35"
              transform="rotate(8 490 102)"
            >
              0.5
            </text>
            <text
              x="545"
              y="90"
              fontSize="9"
              opacity="0.4"
              transform="rotate(-5 545 90)"
            >
              import
            </text>
            <text
              x="610"
              y="98"
              fontSize="7"
              opacity="0.35"
              transform="rotate(15 610 98)"
            >
              gds
            </text>
            <text
              x="650"
              y="92"
              fontSize="6"
              opacity="0.3"
              transform="rotate(-20 650 92)"
            >
              *
            </text>

            {/* Upper-mid region */}
            <text
              x="415"
              y="132"
              fontSize="9"
              opacity="0.5"
              transform="rotate(6 415 132)"
            >
              cell
            </text>
            <text
              x="458"
              y="140"
              fontSize="8"
              opacity="0.45"
              transform="rotate(-14 458 140)"
            >
              .at(
            </text>
            <text
              x="500"
              y="128"
              fontSize="10"
              opacity="0.55"
              transform="rotate(3 500 128)"
              className="fill-brand-purple dark:fill-brand-purple-light"
            >
              Route
            </text>
            <text
              x="555"
              y="138"
              fontSize="7"
              opacity="0.5"
              transform="rotate(-8 555 138)"
            >
              width
            </text>
            <text
              x="605"
              y="130"
              fontSize="9"
              opacity="0.45"
              transform="rotate(11 605 130)"
            >
              port
            </text>
            <text
              x="650"
              y="142"
              fontSize="7"
              opacity="0.4"
              transform="rotate(-18 650 142)"
            >
              =
            </text>
            <text
              x="672"
              y="134"
              fontSize="8"
              opacity="0.35"
              transform="rotate(7 672 134)"
            >
              10.0
            </text>

            {/* Core region — densest, largest */}
            <text
              x="390"
              y="168"
              fontSize="10"
              opacity="0.6"
              transform="rotate(-4 390 168)"
            >
              def
            </text>
            <text
              x="428"
              y="175"
              fontSize="9"
              opacity="0.65"
              transform="rotate(9 428 175)"
              className="fill-brand-purple dark:fill-brand-purple-light"
            >
              ring(
            </text>
            <text
              x="478"
              y="165"
              fontSize="11"
              opacity="0.7"
              transform="rotate(-6 478 165)"
            >
              radius
            </text>
            <text
              x="540"
              y="172"
              fontSize="8"
              opacity="0.65"
              transform="rotate(12 540 172)"
            >
              gap
            </text>
            <text
              x="578"
              y="178"
              fontSize="10"
              opacity="0.6"
              transform="rotate(-3 578 178)"
            >
              0.2
            </text>
            <text
              x="622"
              y="170"
              fontSize="9"
              opacity="0.5"
              transform="rotate(16 622 170)"
            >
              )
            </text>
            <text
              x="650"
              y="176"
              fontSize="8"
              opacity="0.45"
              transform="rotate(-10 650 176)"
            >
              bus
            </text>

            <text
              x="395"
              y="198"
              fontSize="9"
              opacity="0.65"
              transform="rotate(5 395 198)"
            >
              add_ref
            </text>
            <text
              x="455"
              y="205"
              fontSize="11"
              opacity="0.7"
              transform="rotate(-7 455 205)"
              className="fill-brand-purple dark:fill-brand-purple-light"
            >
              coupler
            </text>
            <text
              x="525"
              y="195"
              fontSize="10"
              opacity="0.7"
              transform="rotate(4 525 195)"
              className="fill-brand-purple dark:fill-brand-purple-light"
            >
              .port
            </text>
            <text
              x="578"
              y="202"
              fontSize="8"
              opacity="0.65"
              transform="rotate(-11 578 202)"
            >
              "opt"
            </text>
            <text
              x="625"
              y="195"
              fontSize="9"
              opacity="0.55"
              transform="rotate(8 625 195)"
            >
              bend
            </text>
            <text
              x="670"
              y="200"
              fontSize="7"
              opacity="0.45"
              transform="rotate(-15 670 200)"
            >
              µm
            </text>

            <text
              x="400"
              y="225"
              fontSize="8"
              opacity="0.6"
              transform="rotate(10 400 225)"
            >
              Cell
            </text>
            <text
              x="440"
              y="232"
              fontSize="10"
              opacity="0.65"
              transform="rotate(-5 440 232)"
              className="fill-brand-purple dark:fill-brand-purple-light"
            >
              waveguide
            </text>
            <text
              x="520"
              y="222"
              fontSize="9"
              opacity="0.6"
              transform="rotate(7 520 222)"
            >
              pitch
            </text>
            <text
              x="570"
              y="230"
              fontSize="8"
              opacity="0.55"
              transform="rotate(-13 570 230)"
            >
              127
            </text>
            <text
              x="608"
              y="225"
              fontSize="10"
              opacity="0.5"
              transform="rotate(3 608 225)"
            >
              DRC
            </text>
            <text
              x="648"
              y="232"
              fontSize="7"
              opacity="0.4"
              transform="rotate(-9 648 232)"
            >
              ok
            </text>

            {/* Lower-mid region */}
            <text
              x="420"
              y="258"
              fontSize="9"
              opacity="0.55"
              transform="rotate(-6 420 258)"
            >
              mirror
            </text>
            <text
              x="475"
              y="252"
              fontSize="8"
              opacity="0.5"
              transform="rotate(14 475 252)"
            >
              rotate
            </text>
            <text
              x="530"
              y="262"
              fontSize="10"
              opacity="0.55"
              transform="rotate(-3 530 262)"
              className="fill-brand-purple dark:fill-brand-purple-light"
            >
              check
            </text>
            <text
              x="585"
              y="255"
              fontSize="7"
              opacity="0.45"
              transform="rotate(10 585 255)"
            >
              build
            </text>
            <text
              x="630"
              y="260"
              fontSize="8"
              opacity="0.4"
              transform="rotate(-17 630 260)"
            >
              ()
            </text>

            {/* Lower region — sparse again */}
            <text
              x="445"
              y="288"
              fontSize="8"
              opacity="0.45"
              transform="rotate(8 445 288)"
              className="fill-brand-purple dark:fill-brand-purple-light"
            >
              grating
            </text>
            <text
              x="505"
              y="295"
              fontSize="7"
              opacity="0.4"
              transform="rotate(-11 505 295)"
            >
              mmi
            </text>
            <text
              x="555"
              y="285"
              fontSize="9"
              opacity="0.45"
              transform="rotate(5 555 285)"
            >
              1x2
            </text>
            <text
              x="600"
              y="292"
              fontSize="7"
              opacity="0.35"
              transform="rotate(-14 600 292)"
            >
              loss
            </text>
            <text
              x="645"
              y="288"
              fontSize="6"
              opacity="0.3"
              transform="rotate(19 645 288)"
            >
              nm
            </text>

            {/* Bottom — very sparse */}
            <text
              x="470"
              y="315"
              fontSize="7"
              opacity="0.35"
              transform="rotate(-8 470 315)"
            >
              layer
            </text>
            <text
              x="525"
              y="322"
              fontSize="8"
              opacity="0.35"
              transform="rotate(12 525 322)"
            >
              pass
            </text>
            <text
              x="580"
              y="312"
              fontSize="7"
              opacity="0.3"
              transform="rotate(-5 580 312)"
              className="fill-brand-purple dark:fill-brand-purple-light"
            >
              GDS
            </text>
          </g>
        </g>

        {/* ── RIGHT: Serial-coupled ring add-drop filter ────────────── */}
        <g mask="url(#layout-mask)">
          <g
            fill="none"
            className="stroke-fd-foreground"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          >
            {/* Left bus (vertical) — input bottom, through top */}
            <path d="M 810 110 L 810 290" />

            {/* Right bus (vertical) — add top, drop bottom */}
            <path d="M 1070 110 L 1070 290" />

            {/* Ring 1 (left) */}
            <circle cx="860" cy="200" r="40" />

            {/* Ring 2 (center) — slightly smaller */}
            <circle cx="940" cy="200" r="36" />

            {/* Ring 3 (right) */}
            <circle cx="1020" cy="200" r="40" />
          </g>

          {/* Port markers (muted) */}
          <g
            fill="var(--color-fd-background)"
            className="stroke-fd-foreground"
            strokeWidth="1.25"
            opacity="0.6"
          >
            {/* Through port (top left) */}
            <circle cx="810" cy="110" r="3" />
            {/* Add port (top right) */}
            <circle cx="1070" cy="110" r="3" />
            {/* Drop port (bottom right) */}
            <circle cx="1070" cy="290" r="3" />
          </g>

          {/* Accent: signal path */}
          <g className="text-brand-purple dark:text-brand-purple-light">
            <g
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {/* Input → through (left bus) */}
              <path d="M 810 290 L 810 110" />
              {/* All three rings */}
              <circle cx="860" cy="200" r="40" />
              <circle cx="940" cy="200" r="36" />
              <circle cx="1020" cy="200" r="40" />
              {/* Ring 3 → drop (right bus, bottom half) */}
              <path d="M 1070 200 L 1070 290" />
            </g>
            {/* Input arrow (pointing up, beside bottom of left bus) */}
            <path
              d="M 796 298 L 796 280"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
            <path
              d="M 792 286 L 796 278 L 800 286"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Through arrow (pointing up, beside top of left bus) */}
            <path
              d="M 796 122 L 796 104"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
            <path
              d="M 792 110 L 796 102 L 800 110"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Drop arrow (pointing down, beside bottom of right bus) */}
            <path
              d="M 1084 280 L 1084 298"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
            <path
              d="M 1080 292 L 1084 300 L 1088 292"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </svg>
    </BlogHeroFrame>
  );
}
