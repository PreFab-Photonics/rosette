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
      <div className="aspect-[16/10] w-full rounded-xl border border-black/[0.06] border-b-black/10 bg-black/[0.01] shadow-md shadow-black/5 dark:border-white/[0.08] dark:border-b-white/10 dark:bg-white/[0.02] dark:shadow-black/20" />
    );
  }

  // WebGPU not supported — fall back to code block
  if (!supported) {
    return (
      <div className="overflow-hidden rounded-xl border border-black/[0.06] border-b-black/10 bg-black/[0.01] shadow-md shadow-black/5 dark:border-white/[0.08] dark:border-b-white/10 dark:bg-white/[0.02] dark:shadow-black/20">
        <div className="overflow-x-auto p-5">
          <pre className="text-[13px] leading-relaxed font-[family-name:var(--font-geist-mono)] text-black/70 dark:text-white/70">
            <code>{fallback}</code>
          </pre>
        </div>
      </div>
    );
  }

  // WebGPU supported — render interactive viewer
  return (
    <div className="select-none overflow-hidden rounded-xl border border-black/[0.06] border-b-black/10 shadow-md shadow-black/5 ring-1 ring-inset ring-white/50 dark:border-white/[0.08] dark:border-b-white/10 dark:shadow-black/20 dark:ring-white/5">
      <iframe
        ref={iframeRef}
        src={src}
        title="Rosette layout viewer"
        className="aspect-[16/10] w-full border-0"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
