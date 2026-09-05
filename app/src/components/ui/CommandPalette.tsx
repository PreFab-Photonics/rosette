import { Command } from "cmdk";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCommandPaletteStore } from "@/stores/command-palette";
import { useKeyboardFocus } from "@/hooks/use-keyboard-focus";
import { getCommands, type CommandItem, type CommandShortcut } from "@/lib/palette-commands";
import { cn } from "@/lib/utils";
import { useDocumentStore } from "@/stores/document";
import { isDesignMode, isEmbedMode } from "@/hooks/use-library";
import { useComponentCatalogStore } from "@/stores/component-catalog";

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Renders a keyboard shortcut with modifiers and keys.
 */
function ShortcutDisplay({ shortcut }: { shortcut: CommandShortcut }) {
  const kbdClass =
    "inline-flex h-5 min-w-5 items-center justify-center rounded border border-theme-border-strong bg-theme-border px-1 text-[11px]";

  return (
    <span className="flex items-center gap-0.5">
      {shortcut.modifiers?.map((modifier) => (
        <kbd key={modifier} className={kbdClass}>
          {modifier}
        </kbd>
      ))}
      <kbd className={kbdClass}>{shortcut.key}</kbd>
      {shortcut.then && (
        <>
          <span className="px-1 text-[11px] text-foreground-muted">then</span>
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
  return (
    <Command.Item
      value={item.searchableText}
      onSelect={item.action}
      disabled={item.disabled}
      className={cn(
        "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2",
        "text-foreground-secondary aria-selected:bg-interactive aria-selected:text-foreground",
        item.disabled && "cursor-not-allowed opacity-35",
      )}
    >
      <span className="text-sm">{item.name}</span>
      {item.color && (
        <span
          className="inline-block h-3.5 w-3.5 shrink-0 rounded border border-theme-border-strong"
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
  const isOpen = useCommandPaletteStore((s) => s.isOpen);
  const initialSearch = useCommandPaletteStore((s) => s.initialSearch);
  const close = useCommandPaletteStore((s) => s.close);
  const sourceBacked = useDocumentStore((s) => s.backing.kind === "source");
  const isInstancePalette = initialSearch === "add instance ";
  const projectComponents = useComponentCatalogStore((s) => s.components);
  const catalogError = useComponentCatalogStore((s) => s.error);
  const refreshCatalog = useComponentCatalogStore((s) => s.refresh);

  // Claim keyboard focus to disable canvas shortcuts while palette is open
  useKeyboardFocus("command-palette", isOpen);

  const [search, setSearch] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  // Get commands fresh each time palette opens (dynamic layer entries may change)
  const commands = useMemo(() => {
    if (!isOpen) return [];

    void sourceBacked;
    const availableCommands = getCommands(projectComponents);
    return availableCommands.filter((command) => {
      const isInstanceCommand =
        command.id.startsWith("cell-instance-") || command.id.startsWith("project-component-");
      return isInstanceCommand === isInstancePalette;
    });
  }, [isOpen, isInstancePalette, projectComponents, sourceBacked]);
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

  useEffect(() => {
    if (!isOpen || !isInstancePalette || isDesignMode() || isEmbedMode()) return;
    void refreshCatalog();
  }, [isOpen, isInstancePalette, refreshCatalog]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <Command
        className="fixed inset-0 flex items-start justify-center px-4 pt-[min(15vh,120px)]"
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
          className="w-full max-w-[560px] overflow-hidden rounded-xl border border-theme-border bg-surface shadow-md backdrop-blur-xl"
        >
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Type a command or search..."
            className="w-full border-b border-theme-border bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-foreground-muted"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          {isInstancePalette && catalogError && (
            <div className="border-b border-theme-border px-4 py-2 text-xs text-danger">
              Component catalog: {catalogError}
            </div>
          )}
          <Command.List
            className="max-h-[320px] overflow-y-auto p-1"
            onWheel={(e) => e.stopPropagation()}
          >
            <Command.Empty className="px-3 py-2 text-sm text-foreground-muted">
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
