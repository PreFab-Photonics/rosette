import type { CSSProperties } from "react";

type RedactedStyle = CSSProperties & {
  "--redacted-size": string;
  "--redacted-accent": string;
  "--redacted-accent-x": string;
  "--redacted-accent-y": string;
};

/**
 * Renders a block of pixelated / censored squares in place of text.
 *
 * A CSS-masked field of small squares with a deterministic accent, giving a
 * "name not yet revealed" feel without one DOM node per pixel.
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
  /** Optional CSS color for one deterministic accent pixel */
  accentColor?: string;
  className?: string;
}) {
  const numCols = cols ?? children.length;

  const seed = Array.from(children).reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0,
  );
  const accentIndex = seed % (rows * numCols);
  const style: RedactedStyle = {
    width: numCols * size + numCols - 1,
    height: rows * size + rows - 1,
    "--redacted-size": `${size}px`,
    "--redacted-accent": accentColor ?? "transparent",
    "--redacted-accent-x": `${(accentIndex % numCols) * (size + 1)}px`,
    "--redacted-accent-y": `${Math.floor(accentIndex / numCols) * (size + 1)}px`,
  };

  return (
    <span
      className={`redacted-pixels relative inline-block ${className ?? ""}`}
      style={style}
    >
      <span className="sr-only">{children}</span>
    </span>
  );
}
