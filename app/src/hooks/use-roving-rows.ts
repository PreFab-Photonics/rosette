import { useCallback, useEffect, useRef } from "react";
import type { KeyboardEvent, RefCallback } from "react";
import { isEditableTarget } from "@/lib/keyboard";

type RowKey = string | number;

interface UseRovingRowsOptions<Key extends RowKey> {
  rowKeys: readonly Key[];
  focusedKey: Key | null;
  fallbackKey?: Key | null;
  isActive: boolean;
  wrap?: boolean;
  onFocusedKeyChange: (key: Key | null) => void;
  onFocusWithin?: () => void;
}

interface RovingRowProps<Element extends HTMLElement> {
  ref: RefCallback<Element>;
  tabIndex: number;
  onFocus: () => void;
}

function indexOfKey<Key>(keys: readonly Key[], target: Key | null): number {
  if (target === null) return -1;
  return keys.findIndex((key) => Object.is(key, target));
}

/** Controlled roving DOM focus for flat panel row lists. */
export function useRovingRows<Key extends RowKey, Element extends HTMLElement = HTMLElement>({
  rowKeys,
  focusedKey,
  fallbackKey = null,
  isActive,
  wrap = false,
  onFocusedKeyChange,
  onFocusWithin,
}: UseRovingRowsOptions<Key>) {
  const rowElements = useRef(new Map<Key, Element>());
  const previousKeys = useRef<readonly Key[]>(rowKeys);

  const focusRow = useCallback((key: Key) => {
    const element = rowElements.current.get(key);
    if (!element) return;
    if (document.activeElement !== element) element.focus({ preventScroll: true });
    element.scrollIntoView?.({ block: "nearest" });
  }, []);

  const focusedIndex = indexOfKey(rowKeys, focusedKey);
  const fallbackIndex = indexOfKey(rowKeys, fallbackKey);
  const tabStopKey =
    focusedIndex >= 0
      ? rowKeys[focusedIndex]
      : fallbackIndex >= 0
        ? rowKeys[fallbackIndex]
        : rowKeys[0];

  useEffect(() => {
    const oldKeys = previousKeys.current;
    previousKeys.current = rowKeys;

    if (rowKeys.length === 0) {
      if (focusedKey !== null) onFocusedKeyChange(null);
      return;
    }
    if (focusedIndex >= 0 || (focusedKey === null && !isActive)) return;

    const oldIndex = indexOfKey(oldKeys, focusedKey);
    const nextIndex = oldIndex >= 0 ? Math.min(oldIndex, rowKeys.length - 1) : fallbackIndex;
    onFocusedKeyChange(rowKeys[nextIndex >= 0 ? nextIndex : 0] ?? null);
  }, [fallbackIndex, focusedIndex, focusedKey, isActive, onFocusedKeyChange, rowKeys]);

  useEffect(() => {
    if (!isActive || focusedKey === null) return;
    focusRow(focusedKey);
  }, [focusRow, focusedKey, isActive]);

  const getRowProps = useCallback(
    (key: Key): RovingRowProps<Element> => ({
      ref: (element) => {
        if (element) {
          rowElements.current.set(key, element);
        } else {
          rowElements.current.delete(key);
        }
      },
      tabIndex: Object.is(key, tabStopKey) ? 0 : -1,
      onFocus: () => {
        onFocusWithin?.();
        if (!Object.is(key, focusedKey)) onFocusedKeyChange(key);
      },
    }),
    [focusedKey, onFocusWithin, onFocusedKeyChange, tabStopKey],
  );

  const handleNavigationKeyDown = useCallback(
    (event: KeyboardEvent<Element>, key: Key): boolean => {
      if (isEditableTarget(event.target) || rowKeys.length === 0) return false;
      const index = indexOfKey(rowKeys, key);
      if (index < 0) return false;

      let nextIndex: number | null = null;
      if (event.key === "ArrowDown") {
        nextIndex = index < rowKeys.length - 1 ? index + 1 : wrap ? 0 : index;
      } else if (event.key === "ArrowUp") {
        nextIndex = index > 0 ? index - 1 : wrap ? rowKeys.length - 1 : index;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = rowKeys.length - 1;
      }

      if (nextIndex === null) return false;
      event.preventDefault();
      event.stopPropagation();
      onFocusedKeyChange(rowKeys[nextIndex] ?? null);
      return true;
    },
    [onFocusedKeyChange, rowKeys, wrap],
  );

  return { getRowProps, handleNavigationKeyDown, focusRow };
}
