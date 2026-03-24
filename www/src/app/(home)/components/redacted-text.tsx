"use client";

import { useMemo } from "react";

/**
 * Renders a block of pixelated / censored squares in place of text.
 *
 * Rows of small squares with randomized opacity, giving a
 * "name not yet revealed" feel. Pure CSS, no animation.
 */
export function RedactedText({
  children,
  rows = 3,
  cols,
  size = 4,
  accentColor,
  className,
}: {
  children: string;
  /** Number of pixel rows (default 3) */
  rows?: number;
  /** Number of pixel columns (defaults to character count) */
  cols?: number;
  /** Pixel size in px (default 4) */
  size?: number;
  /** Optional CSS color for sporadic accent pixels */
  accentColor?: string;
  className?: string;
}) {
  const numCols = cols ?? children.length;

  // Deterministic pseudo-random opacities and accent flags so they don't shift on re-render
  const pixels = useMemo(() => {
    const seed = Array.from(children).reduce((s, c) => s + c.charCodeAt(0), 0);
    const values: { opacity: number; accent: boolean }[] = [];
    let v = seed;
    for (let i = 0; i < rows * numCols; i++) {
      v = (v * 9301 + 49297) % 233280;
      const opacity = 0.15 + (v / 233280) * 0.4;
      // ~8% chance of accent color
      v = (v * 9301 + 49297) % 233280;
      const accent = accentColor != null && v / 233280 < 0.08;
      values.push({ opacity, accent });
    }
    return values;
  }, [children, rows, numCols, accentColor]);

  return (
    <span className={`relative inline-flex items-center ${className ?? ""}`}>
      <span
        className="inline-grid gap-px"
        style={{
          gridTemplateColumns: `repeat(${numCols}, ${size}px)`,
          gridTemplateRows: `repeat(${rows}, ${size}px)`,
        }}
        aria-hidden="true"
      >
        {pixels.map((px, i) => {
          const key = `px-${i}`;
          return (
            <span
              key={key}
              className="rounded-[0.5px]"
              style={{
                opacity: px.accent ? px.opacity + 0.2 : px.opacity,
                backgroundColor: px.accent ? accentColor : "currentColor",
              }}
            />
          );
        })}
      </span>
      <span className="sr-only">{children}</span>
    </span>
  );
}
