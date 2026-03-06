import { CursorArrowRaysIcon } from "@heroicons/react/20/solid";
import { HandRaisedIcon } from "@heroicons/react/24/outline";
import {
  AlignHorizontalCenters,
  AlignVerticalCenters,
  CenterAlign,
  CompAlignBottom,
  CompAlignLeft,
  CompAlignRight,
  CompAlignTop,
  Drag,
  EaseIn,
  Pentagon,
  PlusSquare,
  PositionAlign,
  Ruler,
  SlashSquare,
  Square3dCornerToCorner,
  Text,
  ZoomIn,
} from "iconoir-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useToolStore, type ToolType } from "@/stores/tool";
import { useUIStore } from "@/stores/ui";
import { useSelectionStore } from "@/stores/selection";
import { useCommandPaletteStore } from "@/stores/command-palette";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useHistoryStore } from "@/stores/history";
import { AlignElementsCommand } from "@/lib/commands";
import type { AlignType } from "@/lib/align";
import { keys } from "@/lib/utils";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/lib/utils";

/**
 * Tool definition with icon and metadata.
 */
interface ToolDef {
  id: ToolType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  shortcut: string;
}

/** Base navigation/view tools. */
const BASE_TOOLS: ToolDef[] = [
  { id: "select", icon: CursorArrowRaysIcon, label: "Select", shortcut: "V" },
  { id: "laser", icon: EaseIn, label: "Laser Pointer", shortcut: "Q" },
  { id: "pan", icon: HandRaisedIcon, label: "Pan", shortcut: "P" },
  { id: "move", icon: Drag, label: "Move", shortcut: "M" },
  { id: "zoom", icon: ZoomIn, label: "Zoom", shortcut: "Z" },
  { id: "ruler", icon: Ruler, label: "Ruler", shortcut: "U" },
];

/** Shape drawing tools. */
const SHAPE_TOOLS: ToolDef[] = [
  { id: "rectangle", icon: Square3dCornerToCorner, label: "Rectangle", shortcut: "R" },
  { id: "polygon", icon: Pentagon, label: "Polygon", shortcut: "G" },
  { id: "text", icon: Text, label: "Text", shortcut: "T" },
];

/**
 * Tool button with icon and tooltip.
 */
function ToolButton({
  tool,
  isActive,
  onClick,
  isDark,
}: {
  tool: ToolDef;
  isActive: boolean;
  onClick: () => void;
  isDark: boolean;
}) {
  const Icon = tool.icon;

  return (
    <Tooltip label={tool.label} shortcut={{ key: tool.shortcut }}>
      <button
        onClick={onClick}
        className={cn(
          "cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none",
          isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
          isActive && (isDark ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]"),
        )}
      >
        <div className="flex h-5 w-5 items-center justify-center">
          <Icon className={cn("h-5 w-5", isDark ? "text-white/90" : "text-black/90")} />
        </div>
      </button>
    </Tooltip>
  );
}

/**
 * Separator between tool groups.
 */
function Separator({ isDark }: { isDark: boolean }) {
  return <div className={cn("mx-0 h-6 w-[1px]", isDark ? "bg-white/10" : "bg-black/10")} />;
}

/**
 * Main toolbar component.
 * Positioned at top-center with tool selection buttons.
 */
export function Toolbar() {
  const { activeTool, setTool } = useToolStore();
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "fixed top-4 left-0 right-0 z-50 mx-auto w-fit",
        "flex items-center gap-1 rounded-xl border px-1 pt-1 pb-[3px]",
        isDark ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]",
      )}
    >
      {/* Base navigation tools */}
      {BASE_TOOLS.map((tool) => (
        <ToolButton
          key={tool.id}
          tool={tool}
          isActive={activeTool === tool.id}
          onClick={() => setTool(tool.id)}
          isDark={isDark}
        />
      ))}

      <Separator isDark={isDark} />

      {/* Shape drawing tools */}
      {SHAPE_TOOLS.map((tool) => (
        <ToolButton
          key={tool.id}
          tool={tool}
          isActive={activeTool === tool.id}
          onClick={() => setTool(tool.id)}
          isDark={isDark}
        />
      ))}

      {/* Instance tool */}
      <InstanceButton isDark={isDark} />

      {/* Alignment operations */}
      <AlignButton isDark={isDark} />

      <Separator isDark={isDark} />

      {/* Command palette */}
      <CommandPaletteButton isDark={isDark} />
    </div>
  );
}

// =============================================================================
// Alignment operations
// =============================================================================

/** Delay (ms) before long-press opens the alignment menu. */
const PRESS_DELAY = 300;

/** Alignment operation definition. */
interface AlignOp {
  id: AlignType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

/** All alignment operations, laid out in a 4-column grid. */
const ALIGN_OPS: AlignOp[] = [
  { id: "align-left", icon: CompAlignLeft, label: "Align Left" },
  { id: "align-center-h", icon: AlignHorizontalCenters, label: "Align Center H" },
  { id: "align-right", icon: CompAlignRight, label: "Align Right" },
  { id: "center-align", icon: CenterAlign, label: "Center Align" },
  { id: "align-top", icon: CompAlignTop, label: "Align Top" },
  { id: "align-center-v", icon: AlignVerticalCenters, label: "Align Center V" },
  { id: "align-bottom", icon: CompAlignBottom, label: "Align Bottom" },
  { id: "origin-align", icon: PositionAlign, label: "Origin Align" },
];

/**
 * Execute an alignment operation on the current selection.
 */
function executeAlign(alignType: AlignType): void {
  const { library, renderer } = useWasmContextStore.getState();
  if (!library || !renderer) return;

  const { selectedIds, lastSelectedId } = useSelectionStore.getState();
  if (selectedIds.size === 0) return;

  // origin-align works with 1+ elements, others need 2+
  if (alignType !== "origin-align" && selectedIds.size < 2) return;

  const cmd = new AlignElementsCommand(new Set(selectedIds), lastSelectedId, alignType);
  useHistoryStore.getState().execute(cmd, { library, renderer });
}

/**
 * Alignment button with long-press / right-click dropdown.
 *
 * Click executes the last-used alignment operation on the current selection.
 * Long-press or right-click opens a grid of all alignment operations.
 */
function AlignButton({ isDark }: { isDark: boolean }) {
  const [lastOp, setLastOp] = useState<AlignOp>(ALIGN_OPS[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const Icon = lastOp.icon;

  // Click outside / Escape closes the menu
  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClick, true);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick, true);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
  }, []);

  const handleClick = useCallback(() => {
    if (!menuOpen) {
      executeAlign(lastOp.id);
    }
  }, [lastOp.id, menuOpen]);

  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      openMenu();
    },
    [openMenu],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0) {
        pressTimerRef.current = setTimeout(openMenu, PRESS_DELAY);
      }
    },
    [openMenu],
  );

  const clearPressTimer = useCallback(() => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  }, []);

  const handleOpClick = useCallback((op: AlignOp) => {
    setLastOp(op);
    setMenuOpen(false);
    // Execute after state update
    setTimeout(() => executeAlign(op.id), 0);
  }, []);

  return (
    <>
      <Tooltip label={lastOp.label}>
        <button
          ref={buttonRef}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          onMouseDown={handleMouseDown}
          onMouseUp={clearPressTimer}
          onMouseLeave={clearPressTimer}
          className={cn(
            "cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none",
            isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
          )}
        >
          <div className="flex h-5 w-5 items-center justify-center">
            <Icon className={cn("h-5 w-5", isDark ? "text-white/90" : "text-black/90")} />
          </div>
        </button>
      </Tooltip>

      {menuOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={cn(
              "fixed z-[9999] rounded-xl border p-2 shadow-sm backdrop-blur-xl",
              isDark
                ? "border-white/10 bg-[rgb(29,29,29)]"
                : "border-black/10 bg-[rgb(241,241,241)]",
            )}
            style={{
              left: `${buttonRef.current?.getBoundingClientRect().left ?? 0}px`,
              top: `${(buttonRef.current?.getBoundingClientRect().bottom ?? 0) + 8}px`,
            }}
          >
            <div className="grid grid-cols-4 gap-1">
              {ALIGN_OPS.map((op) => (
                <Tooltip key={op.id} label={op.label}>
                  <button
                    onClick={() => handleOpClick(op)}
                    className={cn(
                      "cursor-pointer rounded-lg p-1.5 transition-colors",
                      isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
                    )}
                  >
                    <op.icon
                      className={cn("h-5 w-5", isDark ? "text-white/90" : "text-black/90")}
                    />
                  </button>
                </Tooltip>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

// =============================================================================
// Instance & Command Palette buttons
// =============================================================================

/**
 * Instance button that opens the command palette pre-filled with "add instance ".
 */
function InstanceButton({ isDark }: { isDark: boolean }) {
  const open = useCommandPaletteStore((s) => s.open);
  const isOpen = useCommandPaletteStore((s) => s.isOpen);
  const initialSearch = useCommandPaletteStore((s) => s.initialSearch);

  // Highlight when the palette is open and was triggered by this button
  const isActive = isOpen && !!initialSearch;

  return (
    <Tooltip label="Instance" shortcut={{ key: "I" }}>
      <button
        onClick={() => open("add instance ")}
        className={cn(
          "cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none",
          isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
          isActive && (isDark ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]"),
        )}
      >
        <div className="flex h-5 w-5 items-center justify-center">
          <PlusSquare className={cn("h-5 w-5", isDark ? "text-white/90" : "text-black/90")} />
        </div>
      </button>
    </Tooltip>
  );
}

/**
 * Command palette toggle button.
 */
function CommandPaletteButton({ isDark }: { isDark: boolean }) {
  const isOpen = useCommandPaletteStore((s) => s.isOpen);
  const initialSearch = useCommandPaletteStore((s) => s.initialSearch);
  const toggle = useCommandPaletteStore((s) => s.toggle);

  // Only highlight when opened directly (Cmd+K / button click), not via pre-filled search
  const isActive = isOpen && !initialSearch;

  return (
    <Tooltip label="Commands" shortcut={{ modifiers: [keys.mod], key: "K" }}>
      <button
        onClick={toggle}
        className={cn(
          "cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none",
          isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
          isActive && (isDark ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]"),
        )}
      >
        <div className="flex h-5 w-5 items-center justify-center">
          <SlashSquare className={cn("h-5 w-5", isDark ? "text-white/90" : "text-black/90")} />
        </div>
      </button>
    </Tooltip>
  );
}
