import { cn } from "@/lib/utils";

/** Shared active/focused/hover colors for compact panel rows. */
export function panelRowStateClassName({
  isActive,
  isFocused,
  isDark,
}: {
  isActive: boolean;
  isFocused: boolean;
  isDark: boolean;
}): string {
  return cn(
    isActive
      ? isDark
        ? "bg-[rgb(54,54,54)] text-white/90"
        : "bg-[rgb(217,217,217)] text-black/90"
      : isFocused
        ? isDark
          ? "bg-[rgb(44,44,44)] text-white/90"
          : "bg-[rgb(227,227,227)] text-black/90"
        : isDark
          ? "text-white/70 hover:bg-[rgb(54,54,54)] hover:text-white/90"
          : "text-black/70 hover:bg-[rgb(217,217,217)] hover:text-black/90",
    isFocused && (isDark ? "ring-1 ring-white/25" : "ring-1 ring-black/20"),
  );
}
