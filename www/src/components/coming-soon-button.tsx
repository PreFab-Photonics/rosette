interface ComingSoonButtonProps {
  /** Extra classes appended to the base styling (controls sizing/layout per call site). */
  className?: string;
  /** Download icon size in px. Defaults to 16. */
  iconSize?: number;
  /** Optional native hover tooltip. */
  title?: string;
}

/**
 * Disabled "Download" affordance for the not-yet-shipped desktop app.
 *
 * Rendered as a real disabled `<button>` so it carries button semantics and is
 * announced to screen readers, with an `aria-label` conveying the "coming soon"
 * state. Visual styling (`cursor-not-allowed`, `opacity-60`) is preserved.
 */
export function ComingSoonButton({
  className = "",
  iconSize = 16,
  title,
}: ComingSoonButtonProps) {
  return (
    <button
      type="button"
      disabled
      aria-label="Download (coming soon)"
      title={title}
      className={`cursor-not-allowed opacity-60 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={iconSize}
        height={iconSize}
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
    </button>
  );
}
