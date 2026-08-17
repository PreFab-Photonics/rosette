import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

export interface MenuShortcutSpec {
  modifiers?: string[];
  key: string;
}

interface MenuSurfaceProps extends ComponentPropsWithRef<"div"> {
  isDark: boolean;
}

export function MenuSurface({ isDark, className, ...props }: MenuSurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-xl border py-1",
        isDark
          ? "border-white/10 bg-[rgb(29,29,29)] text-white/90"
          : "border-black/10 bg-[rgb(241,241,241)] text-black/90",
        className,
      )}
      {...props}
    />
  );
}

interface MenuItemProps extends ComponentPropsWithRef<"button"> {
  isDark: boolean;
  active?: boolean;
}

export function MenuItem({ isDark, active = false, className, disabled, ...props }: MenuItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "mx-1 flex h-7 w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 text-left text-xs transition-colors",
        disabled
          ? "opacity-40"
          : isDark
            ? "hover:bg-[rgb(54,54,54)]"
            : "hover:bg-[rgb(217,217,217)]",
        active && (isDark ? "bg-[rgb(54,54,54)]" : "bg-[rgb(217,217,217)]"),
        className,
      )}
      disabled={disabled}
      {...props}
    />
  );
}

interface MenuSeparatorProps extends ComponentPropsWithRef<"div"> {
  isDark: boolean;
}

export function MenuSeparator({ isDark, className, ...props }: MenuSeparatorProps) {
  return (
    <div
      className={cn("my-1 h-px", isDark ? "bg-white/10" : "bg-black/10", className)}
      {...props}
    />
  );
}

interface MenuShortcutProps extends ComponentPropsWithRef<"span"> {
  isDark: boolean;
  shortcut: MenuShortcutSpec;
}

export function MenuShortcut({ isDark, shortcut, className, ...props }: MenuShortcutProps) {
  const keyClassName = cn(
    "inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]",
    isDark ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10",
  );

  return (
    <span className={cn("flex gap-0.5", className)} {...props}>
      {shortcut.modifiers?.map((modifier) => (
        <kbd key={modifier} className={keyClassName}>
          {modifier}
        </kbd>
      ))}
      <kbd className={keyClassName}>{shortcut.key}</kbd>
    </span>
  );
}
