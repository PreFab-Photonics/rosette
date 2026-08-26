import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Shortcut {
  modifiers?: string[];
  key: string;
}

interface TooltipProps {
  label: string;
  shortcut?: Shortcut;
  position?: "top" | "bottom" | "left" | "right";
  /** Horizontal alignment relative to the trigger element (for top/bottom positions). */
  align?: "center" | "end";
  className?: string;
  children: ReactNode;
}

export function Tooltip({
  label,
  shortcut,
  position = "bottom",
  align = "center",
  className,
  children,
}: TooltipProps) {
  const kbdClass =
    "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded border border-theme-border-strong bg-theme-border px-1 text-[11px]";

  const isHorizontal = position === "left" || position === "right";
  const positionClass = isHorizontal
    ? cn("top-1/2 -translate-y-1/2", position === "left" ? "right-full mr-3" : "left-full ml-3")
    : cn(
        align === "end" ? "right-0" : "left-1/2 -translate-x-1/2",
        position === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
      );

  return (
    <div className={cn("group relative", className)}>
      {children}
      <div
        className={cn(
          "pointer-events-none select-none absolute z-50 flex items-center gap-1.5 rounded-lg border border-theme-border bg-surface px-2 py-0.5 text-[11px] text-foreground whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100",
          positionClass,
        )}
      >
        <span>{label}</span>
        {shortcut && (
          <span className="flex gap-0.5">
            {shortcut.modifiers?.map((m) => (
              <kbd key={m} className={kbdClass}>
                {m}
              </kbd>
            ))}
            <kbd className={kbdClass}>{shortcut.key}</kbd>
          </span>
        )}
      </div>
    </div>
  );
}
