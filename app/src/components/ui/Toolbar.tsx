import { CursorArrowRaysIcon } from "@heroicons/react/20/solid";
import { HandRaisedIcon } from "@heroicons/react/24/outline";
import {
  EaseIn,
  Square3dCornerToCorner,
  ZoomIn,
  Drag,
  Pentagon,
  Ruler,
  SlashSquare,
  PlusSquare,
  Text,
} from "iconoir-react";
import { useToolStore, type ToolType } from "@/stores/tool";
import { useUIStore } from "@/stores/ui";
import { useCommandPaletteStore } from "@/stores/command-palette";
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

      <Separator isDark={isDark} />

      {/* Command palette */}
      <CommandPaletteButton isDark={isDark} />
    </div>
  );
}

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
