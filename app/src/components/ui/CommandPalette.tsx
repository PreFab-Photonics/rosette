import { Command } from "cmdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUIStore } from "@/stores/ui";
import { useCommandPaletteStore } from "@/stores/command-palette";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import { getCommands, type CommandItem, type CommandShortcut } from "@/lib/palette-commands";
import { cn } from "@/lib/utils";

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Renders a keyboard shortcut with modifiers and keys.
 */
function ShortcutDisplay({ shortcut }: { shortcut: CommandShortcut }) {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  const kbdClass = cn(
    "inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 text-[11px]",
    isDark ? "border-white/15 bg-white/10" : "border-black/15 bg-black/10",
  );

  return (
    <span className="flex items-center gap-0.5">
      {shortcut.modifiers?.map((modifier, idx) => (
        <kbd key={idx} className={kbdClass}>
          {modifier}
        </kbd>
      ))}
      <kbd className={kbdClass}>{shortcut.key}</kbd>
      {shortcut.then && (
        <>
          <span className={cn("px-1 text-[11px]", isDark ? "text-white/50" : "text-gray-500")}>
            then
          </span>
          <kbd className={kbdClass}>{shortcut.then}</kbd>
        </>
      )}
    </span>
  );
}

/**
 * Renders a single command item in the list.
 */
function CommandRow({ item }: { item: CommandItem }) {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  return (
    <Command.Item
      value={item.searchableText}
      onSelect={item.action}
      className={cn(
        "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2",
        isDark
          ? "text-white/80 aria-selected:bg-[rgb(54,54,54)] aria-selected:text-white"
          : "text-gray-700 aria-selected:bg-[rgb(217,217,217)] aria-selected:text-gray-900",
      )}
    >
      <span className="text-sm">{item.name}</span>
      {item.color && (
        <span
          className={cn(
            "inline-block h-3.5 w-3.5 shrink-0 rounded border",
            isDark ? "border-white/15" : "border-black/15",
          )}
          style={{ backgroundColor: item.color }}
        />
      )}
      {item.shortcut && <ShortcutDisplay shortcut={item.shortcut} />}
    </Command.Item>
  );
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Command palette for quick access to actions.
 *
 * Triggered via Cmd+K (Mac) or Ctrl+K (Windows/Linux).
 * Provides fuzzy search across all available commands.
 */
export function CommandPalette() {
  const theme = useUIStore((s) => s.theme);
  const isDark = theme === "dark";

  const isOpen = useCommandPaletteStore((s) => s.isOpen);
  const close = useCommandPaletteStore((s) => s.close);

  // Claim keyboard focus to disable canvas shortcuts while palette is open
  useKeyboardFocus("command-palette", isOpen);

  const [search, setSearch] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  // Get commands fresh each time palette opens (dynamic layer entries may change)
  // oxlint-disable-next-line react-hooks/exhaustive-deps
  const commands = useMemo(() => getCommands(), [isOpen]);
  const filteredCommands = useMemo(() => {
    const searchLower = search.toLowerCase();
    return commands.filter((cmd) => cmd.searchableText.toLowerCase().includes(searchLower));
  }, [commands, search]);

  // Sort filtered commands alphabetically
  const sortedCommands = useMemo(
    () => [...filteredCommands].sort((a, b) => a.name.localeCompare(b.name)),
    [filteredCommands],
  );

  // Handle click outside to close
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;

      if (contentRef.current && !contentRef.current.contains(target)) {
        close();
      }
    },
    [close],
  );

  // Set up click-outside listener when open, and initialize search from store
  // Note: Escape key is handled natively by cmdk
  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      return;
    }

    // Read initialSearch once on open transition (avoid dep array to prevent
    // clobbering user-typed text if the store value changes while open)
    setSearch(useCommandPaletteStore.getState().initialSearch);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <Command
        className="fixed inset-0 flex items-start justify-center pt-[15vh]"
        shouldFilter={false}
        loop={true}
        label="Command Menu"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            close();
          }
        }}
      >
        <div
          ref={contentRef}
          className={cn(
            "w-full max-w-[560px] overflow-hidden rounded-xl border shadow-md backdrop-blur-xl",
            isDark ? "border-white/10 bg-[rgb(29,29,29)]" : "border-black/10 bg-[rgb(241,241,241)]",
          )}
        >
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Type a command or search..."
            className={cn(
              "w-full border-b bg-transparent px-4 py-3 text-sm outline-none",
              isDark
                ? "border-white/10 text-white/90 placeholder:text-white/50"
                : "border-black/10 text-gray-900 placeholder:text-gray-500",
            )}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <Command.List
            className="max-h-[320px] overflow-y-auto p-1"
            onWheel={(e) => e.stopPropagation()}
          >
            <Command.Empty
              className={cn("px-3 py-2 text-sm", isDark ? "text-white/50" : "text-gray-500")}
            >
              No matching commands
            </Command.Empty>
            {sortedCommands.map((item) => (
              <CommandRow key={item.id} item={item} />
            ))}
          </Command.List>
        </div>
      </Command>
    </div>
  );
}
