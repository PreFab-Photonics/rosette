"use client";

import { useRef } from "react";
import { ViewerEmbed } from "./viewer-embed";
import { SyncedDotGrid } from "./synced-dot-grid";

/**
 * Client wrapper that pairs the ViewerEmbed with the SyncedDotGrid.
 * Owns the iframe ref so the dot grid can track the viewer's camera.
 */
export function HeroViewer({
  src,
  fallback,
}: {
  src: string;
  fallback: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <>
      <SyncedDotGrid iframeRef={iframeRef} />
      <div className="mt-14">
        <ViewerEmbed src={src} fallback={fallback} iframeRef={iframeRef} />
      </div>
    </>
  );
}
