export function AgenticDesignLayersFigure() {
  return (
    <figure className="not-prose mx-auto my-10 max-w-2xl">
      <div className="relative rounded-md border border-brand-yellow bg-brand-yellow/15 p-3 pt-10 sm:p-6 sm:pt-12">
        <LayerLabel number="4" name="Designer context" accent="yellow" />
        <div
          className="relative rounded-md border border-brand-purple p-3 pt-10 sm:p-6 sm:pt-12"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-fd-primary) 7%, var(--color-fd-background))",
          }}
        >
          <LayerLabel number="3" name="Photonics tools" accent="purple" />
          <div className="relative rounded-md border border-fd-border bg-fd-muted p-3 pt-10 sm:p-6 sm:pt-12">
            <LayerLabel number="2" name="Agent harness" />
            <div className="rounded-sm border border-fd-border bg-fd-card px-4 py-6 text-center sm:py-8">
              <div className="font-[family-name:var(--font-geist-sans)] text-[9px] tracking-[0.1em] text-fd-muted-foreground sm:text-[10px]">
                1. MODEL
              </div>
              <div className="mt-2 font-[family-name:var(--font-geist-sans)] font-medium text-base tracking-tight text-fd-foreground sm:text-lg">
                Frontier LLM
              </div>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-sm text-fd-muted-foreground">
        The model sits at the center of a stack that gives it tools, feedback,
        and design knowledge.
      </figcaption>
    </figure>
  );
}

function LayerLabel({
  number,
  name,
  accent = "neutral",
}: {
  number: string;
  name: string;
  accent?: "neutral" | "purple" | "yellow";
}) {
  const color = {
    neutral: "text-fd-muted-foreground",
    purple: "text-brand-purple dark:text-brand-purple-light",
    yellow: "text-fd-foreground",
  }[accent];

  return (
    <div
      className={`absolute top-2 right-3 left-3 text-center font-[family-name:var(--font-geist-sans)] text-[9px] tracking-[0.1em] uppercase sm:top-3 sm:right-5 sm:left-5 sm:text-[10px] ${color}`}
    >
      <span>
        {number}. {name}
      </span>
    </div>
  );
}
