import type { ReactNode } from "react";
import { useUIStore } from "@/stores/ui";
import { cn } from "@/lib/utils";

export interface Shortcut {
  modifiers?: string[];
  key: string;
}

interface TooltipProps {
  label: string;
  shortcut?: Shortcut;
  position?: "top" | "bottom";
  /** Horizontal alignment relative to the trigger element. */
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
  const isDark = useUIStore((s) => s.theme) === "dark";
  const kbdClass = cn(
    "inline-flex h-[18px] min-w-[18px] items-center justify-center rounded border px-1 text-[11px]",
    isDark ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10",
  );

  const alignClass = align === "end" ? "right-0" : "left-1/2 -translate-x-1/2";

  return (
    <div className={cn("group relative", className)}>
      {children}
      <div
        className={cn(
          "pointer-events-none absolute z-50 flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100",
          alignClass,
          position === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
          isDark
            ? "border-white/10 bg-[rgb(29,29,29)] text-white/90"
            : "border-black/10 bg-[rgb(241,241,241)] text-black/90",
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
