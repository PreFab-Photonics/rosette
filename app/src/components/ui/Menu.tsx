import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils";

export interface MenuShortcutSpec {
  modifiers?: string[];
  key: string;
}

type MenuSurfaceProps = ComponentPropsWithRef<"div">;

export function MenuSurface({ className, ...props }: MenuSurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-theme-border bg-surface py-1 text-foreground",
        className,
      )}
      {...props}
    />
  );
}

interface MenuItemProps extends ComponentPropsWithRef<"button"> {
  active?: boolean;
}

export function MenuItem({ active = false, className, disabled, ...props }: MenuItemProps) {
  return (
    <button
      type="button"
      className={cn(
        "mx-1 flex h-7 w-[calc(100%-0.5rem)] cursor-pointer items-center justify-between gap-3 rounded-lg px-2 text-left text-xs transition-colors",
        disabled ? "opacity-40" : "hover:bg-interactive",
        active && "bg-interactive",
        className,
      )}
      disabled={disabled}
      {...props}
    />
  );
}

type MenuSeparatorProps = ComponentPropsWithRef<"div">;

export function MenuSeparator({ className, ...props }: MenuSeparatorProps) {
  return <div className={cn("my-1 h-px bg-theme-border", className)} {...props} />;
}

interface MenuShortcutProps extends ComponentPropsWithRef<"span"> {
  shortcut: MenuShortcutSpec;
}

export function MenuShortcut({ shortcut, className, ...props }: MenuShortcutProps) {
  const keyClassName =
    "inline-flex h-5 min-w-5 items-center justify-center rounded border border-theme-border-strong bg-theme-border px-1 text-[11px]";

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
