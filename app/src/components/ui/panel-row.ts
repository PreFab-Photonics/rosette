import { cn } from "@/lib/utils";

/** Shared active/focused/hover colors for compact panel rows. */
export function panelRowStateClassName({
  isActive,
  isFocused,
}: {
  isActive: boolean;
  isFocused: boolean;
}): string {
  return cn(
    isActive
      ? "bg-interactive text-foreground"
      : isFocused
        ? "bg-interactive-focus text-foreground"
        : "text-foreground-secondary hover:bg-interactive hover:text-foreground",
    isFocused && "ring-1 ring-focus-ring",
  );
}
