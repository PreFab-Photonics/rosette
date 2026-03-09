import { useCallback, useRef, useState } from "react";
import { DEFAULT_PANEL_WIDTH, MIN_PANEL_WIDTH, MAX_PANEL_WIDTH } from "@/stores/ui";

/** Snap threshold in CSS pixels — within this range, snap to the default width. */
const SNAP_THRESHOLD = 8;

/** Which side of the viewport the panel lives on. Determines drag direction. */
type PanelSide = "left" | "right";

interface UseResizeOptions {
  /** Which viewport edge the panel is anchored to. */
  side: PanelSide;
  /** Current panel width. */
  width: number;
  /** Callback to update the panel width (should write to store). */
  onResize: (width: number) => void;
}

interface UseResizeReturn {
  /** Props to spread onto the invisible resize handle element. */
  handleProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    onDoubleClick: () => void;
    style: React.CSSProperties;
  };
  /** Whether a resize drag is currently in progress. */
  isResizing: boolean;
}

/**
 * Hook for drag-to-resize on floating panels.
 *
 * Provides an invisible hit-zone handle on the inner edge of a panel.
 * Includes snap-to-default-width behavior and double-click-to-reset.
 */
export function useResize({ side, width, onResize }: UseResizeOptions): UseResizeReturn {
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const clampAndSnap = useCallback((raw: number): number => {
    const clamped = Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, raw));
    // Snap to default width when close
    if (Math.abs(clamped - DEFAULT_PANEL_WIDTH) <= SNAP_THRESHOLD) {
      return DEFAULT_PANEL_WIDTH;
    }
    return Math.round(clamped);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only left button
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();

      startXRef.current = e.clientX;
      startWidthRef.current = width;
      setIsResizing(true);

      // Prevent text selection during drag
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";

      const handleMouseMove = (ev: MouseEvent) => {
        const dx = ev.clientX - startXRef.current;
        // Left panel: dragging right = wider; Right panel: dragging left = wider
        const newWidth = side === "left" ? startWidthRef.current + dx : startWidthRef.current - dx;
        onResize(clampAndSnap(newWidth));
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
        setIsResizing(false);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [side, width, onResize, clampAndSnap],
  );

  const handleDoubleClick = useCallback(() => {
    onResize(DEFAULT_PANEL_WIDTH);
  }, [onResize]);

  return {
    handleProps: {
      onMouseDown: handleMouseDown,
      onDoubleClick: handleDoubleClick,
      style: {
        position: "absolute" as const,
        top: 0,
        bottom: 0,
        width: 6,
        cursor: "col-resize",
        zIndex: 50,
        // Position on the inner edge of the panel
        ...(side === "left" ? { right: -3 } : { left: -3 }),
      },
    },
    isResizing,
  };
}
