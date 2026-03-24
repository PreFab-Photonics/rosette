"use client";

import { useEffect, useState } from "react";

/**
 * Embedded WebGPU viewer for the landing page hero.
 *
 * Renders the rosette viewer in an iframe with embed mode enabled.
 * Falls back to a static code block if WebGPU is not available.
 */
export function ViewerEmbed({
  src,
  fallback,
  iframeRef,
}: {
  /** URL for the viewer iframe (e.g. "/viewer/index.html?embed=true") */
  src: string;
  /** Code string to show as fallback when WebGPU is unavailable */
  fallback: string;
  /** Optional ref forwarded to the iframe element for external use. */
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
}) {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    async function check() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gpu = (navigator as any).gpu;
        if (!gpu) {
          setSupported(false);
          return;
        }
        const adapter = await gpu.requestAdapter();
        setSupported(!!adapter);
      } catch {
        setSupported(false);
      }
    }
    check();
  }, []);

  // Still checking — show placeholder matching the viewer dimensions
  if (supported === null) {
    return (
      <div className="aspect-[2/1] w-full rounded-xl border border-fd-border bg-fd-card shadow-md shadow-fd-border/20" />
    );
  }

  // WebGPU not supported — fall back to code block
  if (!supported) {
    return (
      <div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-md shadow-fd-border/20">
        <div className="overflow-x-auto p-5">
          <pre className="text-[13px] leading-relaxed font-[family-name:var(--font-geist-mono)] text-fd-muted-foreground">
            <code>{fallback}</code>
          </pre>
        </div>
      </div>
    );
  }

  // WebGPU supported — render interactive viewer
  return (
    <div className="select-none overflow-hidden rounded-xl border border-fd-border shadow-md shadow-fd-border/20 ring-1 ring-inset ring-fd-accent">
      <iframe
        ref={iframeRef}
        src={src}
        title="Rosette layout viewer"
        className="aspect-[2/1] w-full border-0"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
