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
  Exclude,
  Intersect,
  MoreHoriz,
  Pentagon,
  PlusSquare,
  PositionAlign,
  Ruler,
  SlashSquare,
  Square3dCornerToCorner,
  Substract,
  Text,
  Union,
  ZoomIn,
  PathArrow,
} from "iconoir-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useToolStore, type ToolType } from "@/stores/tool";
import { useUIStore } from "@/stores/ui";
import { useSelectionStore } from "@/stores/selection";
import { useCommandPaletteStore } from "@/stores/command-palette";
import { useWasmContextStore } from "@/stores/wasm-context";
import { useHistoryStore } from "@/stores/history";
import { AlignElementsCommand, BooleanOperationCommand } from "@/lib/commands";
import type { AlignType } from "@/lib/align";
import type { BooleanOpType } from "@/lib/commands";
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
  { id: "path", icon: PathArrow, label: "Path", shortcut: "H" },
  { id: "text", icon: Text, label: "Text", shortcut: "T" },
];

/**
 * Primary tools shown at the md breakpoint (compact mode).
 * Less-used tools go into the overflow menu.
 */
const PRIMARY_BASE_TOOLS: ToolDef[] = [
  { id: "select", icon: CursorArrowRaysIcon, label: "Select", shortcut: "V" },
  { id: "pan", icon: HandRaisedIcon, label: "Pan", shortcut: "P" },
  { id: "move", icon: Drag, label: "Move", shortcut: "M" },
  { id: "zoom", icon: ZoomIn, label: "Zoom", shortcut: "Z" },
];

/** Overflow tools at the md breakpoint (shown in dropdown). */
const OVERFLOW_BASE_TOOLS: ToolDef[] = [
  { id: "laser", icon: EaseIn, label: "Laser Pointer", shortcut: "Q" },
  { id: "ruler", icon: Ruler, label: "Ruler", shortcut: "U" },
];

/**
 * Minimal tools shown at the sm breakpoint.
 */
const MINIMAL_BASE_TOOLS: ToolDef[] = [
  { id: "select", icon: CursorArrowRaysIcon, label: "Select", shortcut: "V" },
  { id: "pan", icon: HandRaisedIcon, label: "Pan", shortcut: "P" },
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
 * Overflow menu button that shows hidden tools in a dropdown.
 */
function OverflowMenuButton({
  isDark,
  overflowBaseTools,
  overflowShapeTools,
  showInstance,
  showCommands,
}: {
  isDark: boolean;
  overflowBaseTools: ToolDef[];
  overflowShapeTools: ToolDef[];
  showInstance: boolean;
  showCommands: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { activeTool, setTool } = useToolStore();
  const open = useCommandPaletteStore((s) => s.open);
  const toggle = useCommandPaletteStore((s) => s.toggle);

  // Highlight if any overflow tool is active
  const isOverflowActive = [...overflowBaseTools, ...overflowShapeTools].some(
    (t) => t.id === activeTool,
  );

  // Close on click outside / Escape
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

  // Compute dropdown position
  const getMenuPosition = useCallback(() => {
    if (!buttonRef.current) return { left: 0, top: 0 };
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 200;
    let left = rect.left;
    // Clamp to not overflow right edge
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8;
    }
    return { left, top: rect.bottom + 8 };
  }, []);

  return (
    <>
      <Tooltip label="More tools" className={menuOpen ? "[&>div:last-child]:hidden" : undefined}>
        <button
          ref={buttonRef}
          onClick={() => setMenuOpen(!menuOpen)}
          className={cn(
            "cursor-pointer rounded-lg p-1.5 transition-colors focus:outline-none",
            isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
            (isOverflowActive || menuOpen) &&
              (isDark ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]"),
          )}
        >
          <div className="flex h-5 w-5 items-center justify-center">
            <MoreHoriz className={cn("h-5 w-5", isDark ? "text-white/90" : "text-black/90")} />
          </div>
        </button>
      </Tooltip>

      {menuOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={cn(
              "fixed z-[9999] min-w-[180px] rounded-xl border p-1 backdrop-blur-xl",
              isDark
                ? "border-white/10 bg-[rgb(29,29,29)]"
                : "border-black/10 bg-[rgb(241,241,241)]",
            )}
            style={(() => {
              const pos = getMenuPosition();
              return { left: `${pos.left}px`, top: `${pos.top}px` };
            })()}
          >
            {/* Overflow base tools */}
            {overflowBaseTools.length > 0 && (
              <div className="flex flex-col">
                {overflowBaseTools.map((tool) => {
                  const Icon = tool.icon;
                  const isActive = activeTool === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setTool(tool.id);
                        setMenuOpen(false);
                      }}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors",
                        isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
                        isActive && (isDark ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]"),
                      )}
                    >
                      <Icon className={cn("h-4 w-4", isDark ? "text-white/90" : "text-black/90")} />
                      <span className={isDark ? "text-white/90" : "text-black/90"}>
                        {tool.label}
                      </span>
                      <kbd
                        className={cn(
                          "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]",
                          isDark ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10",
                        )}
                      >
                        {tool.shortcut}
                      </kbd>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Overflow shape tools */}
            {overflowShapeTools.length > 0 && (
              <>
                <div className={cn("my-1 h-px", isDark ? "bg-white/10" : "bg-black/10")} />
                <div className="flex flex-col">
                  {overflowShapeTools.map((tool) => {
                    const Icon = tool.icon;
                    const isActive = activeTool === tool.id;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => {
                          setTool(tool.id);
                          setMenuOpen(false);
                        }}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors",
                          isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
                          isActive && (isDark ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]"),
                        )}
                      >
                        <Icon
                          className={cn("h-4 w-4", isDark ? "text-white/90" : "text-black/90")}
                        />
                        <span className={isDark ? "text-white/90" : "text-black/90"}>
                          {tool.label}
                        </span>
                        <kbd
                          className={cn(
                            "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]",
                            isDark ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10",
                          )}
                        >
                          {tool.shortcut}
                        </kbd>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Instance + Commands */}
            {(showInstance || showCommands) && (
              <>
                <div className={cn("my-1 h-px", isDark ? "bg-white/10" : "bg-black/10")} />
                <div className="flex flex-col">
                  {showInstance && (
                    <button
                      onClick={() => {
                        open("add instance ");
                        setMenuOpen(false);
                      }}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors",
                        isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
                      )}
                    >
                      <PlusSquare
                        className={cn("h-4 w-4", isDark ? "text-white/90" : "text-black/90")}
                      />
                      <span className={isDark ? "text-white/90" : "text-black/90"}>Instance</span>
                      <kbd
                        className={cn(
                          "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]",
                          isDark ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10",
                        )}
                      >
                        I
                      </kbd>
                    </button>
                  )}
                  {showCommands && (
                    <button
                      onClick={() => {
                        toggle();
                        setMenuOpen(false);
                      }}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors",
                        isDark ? "hover:bg-[rgb(54,54,54)]" : "hover:bg-[rgb(217,217,217)]",
                      )}
                    >
                      <SlashSquare
                        className={cn("h-4 w-4", isDark ? "text-white/90" : "text-black/90")}
                      />
                      <span className={isDark ? "text-white/90" : "text-black/90"}>Commands</span>
                      <span className="ml-auto flex gap-0.5">
                        <kbd
                          className={cn(
                            "inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]",
                            isDark ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10",
                          )}
                        >
                          {keys.mod}
                        </kbd>
                        <kbd
                          className={cn(
                            "inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[10px]",
                            isDark ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10",
                          )}
                        >
                          K
                        </kbd>
                      </span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}

/**
 * Main toolbar component.
 * Positioned at top-center with tool selection buttons.
 *
 * Responsive behavior:
 * - Default: All 12 buttons visible
 * - compact: Primary tools + overflow menu (md breakpoint)
 * - minimal: Select + Pan + overflow menu (sm breakpoint)
 */
export function Toolbar({
  compact = false,
  minimal = false,
}: {
  compact?: boolean;
  minimal?: boolean;
}) {
  const { activeTool, setTool } = useToolStore();
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  // Determine which tools to show inline vs overflow
  const inlineBaseTools = minimal ? MINIMAL_BASE_TOOLS : compact ? PRIMARY_BASE_TOOLS : BASE_TOOLS;
  const showShapeToolsInline = !compact && !minimal;
  const showShapeOpsInline = !compact && !minimal;
  const showInstanceInline = !compact && !minimal;
  const showCommandsInline = !compact && !minimal;
  const showOverflow = compact || minimal;

  // Build overflow tool lists
  const overflowBaseTools = minimal
    ? [
        ...OVERFLOW_BASE_TOOLS,
        { id: "move" as ToolType, icon: Drag, label: "Move", shortcut: "M" },
        { id: "zoom" as ToolType, icon: ZoomIn, label: "Zoom", shortcut: "Z" },
      ]
    : compact
      ? OVERFLOW_BASE_TOOLS
      : [];
  const overflowShapeTools = compact || minimal ? SHAPE_TOOLS : [];

  return (
    <div
      className={cn(
        "fixed top-4 z-50 mx-auto w-fit",
        // Center between collapsed panels when in compact/minimal mode
        compact || minimal ? "left-14 right-14" : "left-0 right-0",
        "flex items-center gap-1 rounded-xl border px-1 pt-1 pb-[3px]",
        isDark ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]",
      )}
    >
      {/* Inline base tools */}
      {inlineBaseTools.map((tool) => (
        <ToolButton
          key={tool.id}
          tool={tool}
          isActive={activeTool === tool.id}
          onClick={() => setTool(tool.id)}
          isDark={isDark}
        />
      ))}

      {/* Shape tools (full mode only) */}
      {showShapeToolsInline && (
        <>
          <Separator isDark={isDark} />
          {SHAPE_TOOLS.map((tool) => (
            <ToolButton
              key={tool.id}
              tool={tool}
              isActive={activeTool === tool.id}
              onClick={() => setTool(tool.id)}
              isDark={isDark}
            />
          ))}
        </>
      )}

      {/* Shape operations (full mode only) */}
      {showShapeOpsInline && <ShapeOpsButton isDark={isDark} />}

      {/* Instance tool (full mode only) */}
      {showInstanceInline && <InstanceButton isDark={isDark} />}

      {/* Separator before commands or overflow */}
      <Separator isDark={isDark} />

      {/* Command palette (full mode only) */}
      {showCommandsInline && <CommandPaletteButton isDark={isDark} />}

      {/* Overflow menu (compact/minimal mode) */}
      {showOverflow && (
        <OverflowMenuButton
          isDark={isDark}
          overflowBaseTools={overflowBaseTools}
          overflowShapeTools={overflowShapeTools}
          showInstance={true}
          showCommands={true}
        />
      )}
    </div>
  );
}

// =============================================================================
// Shape operations (boolean + alignment)
// =============================================================================

/** Delay (ms) before long-press opens the shape ops menu. */
const PRESS_DELAY = 300;

/** A shape operation entry (boolean or alignment). */
interface ShapeOp {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  kind: "boolean" | "align";
}

/** All shape operations in a 4-column grid layout. */
const SHAPE_OPS: ShapeOp[] = [
  // Row 1: Boolean operations
  { id: "union", icon: Union, label: "Union", kind: "boolean" },
  { id: "subtract", icon: Substract, label: "Subtract", kind: "boolean" },
  { id: "intersect", icon: Intersect, label: "Intersect", kind: "boolean" },
  { id: "xor", icon: Exclude, label: "Exclude", kind: "boolean" },
  // Row 2: Horizontal alignment
  { id: "align-left", icon: CompAlignLeft, label: "Align Left", kind: "align" },
  { id: "align-center-h", icon: AlignHorizontalCenters, label: "Align Center H", kind: "align" },
  { id: "align-right", icon: CompAlignRight, label: "Align Right", kind: "align" },
  { id: "center-align", icon: CenterAlign, label: "Center Align", kind: "align" },
  // Row 3: Vertical alignment
  { id: "align-top", icon: CompAlignTop, label: "Align Top", kind: "align" },
  { id: "align-center-v", icon: AlignVerticalCenters, label: "Align Center V", kind: "align" },
  { id: "align-bottom", icon: CompAlignBottom, label: "Align Bottom", kind: "align" },
  { id: "origin-align", icon: PositionAlign, label: "Origin Align", kind: "align" },
];

/**
 * Execute a shape operation (boolean or alignment) on the current selection.
 */
function executeShapeOp(op: ShapeOp): void {
  const { library, renderer } = useWasmContextStore.getState();
  if (!library || !renderer) return;

  const { selectedIds, lastSelectedId } = useSelectionStore.getState();
  if (selectedIds.size === 0) return;

  if (op.kind === "boolean") {
    if (selectedIds.size < 2) return;
    const ids = [...selectedIds];
    const baseId = lastSelectedId ?? ids[0];
    const cmd = new BooleanOperationCommand(ids, op.id as BooleanOpType, baseId);
    useHistoryStore.getState().execute(cmd, { library, renderer });
  } else {
    // Alignment
    const alignType = op.id as AlignType;
    if (alignType !== "origin-align" && selectedIds.size < 2) return;
    const cmd = new AlignElementsCommand(new Set(selectedIds), lastSelectedId, alignType);
    useHistoryStore.getState().execute(cmd, { library, renderer });
  }
}

/**
 * Combined shape operations button with long-press / right-click dropdown.
 *
 * Click executes the last-used operation on the current selection.
 * Long-press or right-click opens a 4x3 grid with boolean ops (row 1)
 * and alignment ops (rows 2-3), matching rosette-web's Toolbar layout.
 */
function ShapeOpsButton({ isDark }: { isDark: boolean }) {
  const [lastOp, setLastOp] = useState<ShapeOp>(SHAPE_OPS[0]);
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
      executeShapeOp(lastOp);
    }
  }, [lastOp, menuOpen]);

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

  const handleOpClick = useCallback((op: ShapeOp) => {
    setLastOp(op);
    setMenuOpen(false);
    setTimeout(() => executeShapeOp(op), 0);
  }, []);

  // Clamp dropdown position to viewport
  const getMenuPosition = useCallback(() => {
    if (!buttonRef.current) return { left: 0, top: 0 };
    const rect = buttonRef.current.getBoundingClientRect();
    const menuWidth = 180; // approximate 4-col grid width
    const menuHeight = 160;
    let left = rect.left;
    let top = rect.bottom + 8;
    if (left + menuWidth > window.innerWidth - 8) {
      left = window.innerWidth - menuWidth - 8;
    }
    if (top + menuHeight > window.innerHeight - 8) {
      top = rect.top - menuHeight - 8;
    }
    return { left, top };
  }, []);

  return (
    <>
      <Tooltip label={lastOp.label} className={menuOpen ? "[&>div:last-child]:hidden" : undefined}>
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
              "fixed z-[9999] rounded-xl border p-2 backdrop-blur-xl",
              isDark
                ? "border-white/10 bg-[rgb(29,29,29)]"
                : "border-black/10 bg-[rgb(241,241,241)]",
            )}
            style={(() => {
              const pos = getMenuPosition();
              return { left: `${pos.left}px`, top: `${pos.top}px` };
            })()}
          >
            <div className="grid grid-cols-4 gap-1">
              {SHAPE_OPS.map((op) => (
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
