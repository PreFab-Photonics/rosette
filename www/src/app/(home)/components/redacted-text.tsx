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
  className,
}: {
  children: string;
  /** Number of pixel rows (default 3) */
  rows?: number;
  /** Number of pixel columns (defaults to character count) */
  cols?: number;
  /** Pixel size in px (default 4) */
  size?: number;
  className?: string;
}) {
  const numCols = cols ?? children.length;

  // Deterministic pseudo-random opacities so they don't shift on re-render
  const opacities = useMemo(() => {
    const seed = Array.from(children).reduce((s, c) => s + c.charCodeAt(0), 0);
    const values: number[] = [];
    let v = seed;
    for (let i = 0; i < rows * numCols; i++) {
      v = (v * 9301 + 49297) % 233280;
      // Range from 0.15 to 0.55
      values.push(0.15 + (v / 233280) * 0.4);
    }
    return values;
  }, [children, rows, numCols]);

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
        {opacities.map((opacity, i) => {
          const key = `px-${i}`;
          return (
            <span
              key={key}
              className="rounded-[0.5px] bg-current"
              style={{ opacity }}
            />
          );
        })}
      </span>
      <span className="sr-only">{children}</span>
    </span>
  );
}
