/**
 * Text editing logic for the text tool.
 *
 * Handles inline text editing: keystroke processing, cursor navigation,
 * text selection, and clipboard operations. Adapted from rosette-web's
 * textTool.ts for use with HTML overlay rendering.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Cursor position within multi-line text. */
export interface CursorPosition {
  line: number;
  column: number;
}

/** Text selection spanning anchor to focus. */
export interface TextSelection {
  anchor: CursorPosition;
  focus: CursorPosition;
  isActive: boolean;
}

/** State of a text element being actively edited on the canvas. */
export interface ActiveText {
  /** World X position (nanometers). */
  x: number;
  /** World Y position (nanometers). */
  y: number;
  /** Text content (\n-separated lines). */
  content: string;
  /** Current cursor position. */
  cursorPosition: CursorPosition;
  /** Optional selection range. */
  selection?: TextSelection;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Check if pos1 is before pos2 in document order. */
function isPositionBefore(pos1: CursorPosition, pos2: CursorPosition): boolean {
  if (pos1.line < pos2.line) return true;
  if (pos1.line > pos2.line) return false;
  return pos1.column < pos2.column;
}

/**
 * Normalize a selection so start is before end.
 * Returns null if no selection or if anchor === focus.
 */
export function getNormalizedSelection(
  selection: TextSelection | undefined,
): { start: CursorPosition; end: CursorPosition } | null {
  if (!selection || !selection.isActive) return null;

  if (
    selection.anchor.line === selection.focus.line &&
    selection.anchor.column === selection.focus.column
  ) {
    return null;
  }

  const start = isPositionBefore(selection.anchor, selection.focus)
    ? selection.anchor
    : selection.focus;
  const end = isPositionBefore(selection.anchor, selection.focus)
    ? selection.focus
    : selection.anchor;

  return { start, end };
}

// ---------------------------------------------------------------------------
// Selection operations
// ---------------------------------------------------------------------------

/** Extract the selected text as a string. */
export function getSelectedText(activeText: ActiveText): string {
  if (!activeText.selection?.isActive) return "";

  const selection = getNormalizedSelection(activeText.selection);
  if (!selection) return "";

  const lines = activeText.content.split("\n");
  let result = "";

  for (let i = selection.start.line; i <= selection.end.line; i++) {
    const line = lines[i];
    const startCol = i === selection.start.line ? selection.start.column : 0;
    const endCol = i === selection.end.line ? selection.end.column : line.length;
    result += line.substring(startCol, endCol);
    if (i < selection.end.line) result += "\n";
  }

  return result;
}

/** Delete the selected text and reposition the cursor. */
export function deleteSelectedText(activeText: ActiveText): ActiveText {
  if (!activeText.selection?.isActive) return activeText;

  const selection = getNormalizedSelection(activeText.selection);
  if (!selection) return activeText;

  const lines = activeText.content.split("\n");
  const newLines = [...lines];

  if (selection.start.line === selection.end.line) {
    // Single line selection
    const line = newLines[selection.start.line];
    newLines[selection.start.line] =
      line.substring(0, selection.start.column) + line.substring(selection.end.column);
  } else {
    // Multi-line selection
    const firstLine = newLines[selection.start.line];
    const lastLine = newLines[selection.end.line];
    newLines[selection.start.line] =
      firstLine.substring(0, selection.start.column) + lastLine.substring(selection.end.column);
    newLines.splice(selection.start.line + 1, selection.end.line - selection.start.line);
  }

  return {
    ...activeText,
    content: newLines.join("\n"),
    cursorPosition: {
      line: selection.start.line,
      column: selection.start.column,
    },
    selection: undefined,
  };
}

// ---------------------------------------------------------------------------
// Arrow key / navigation handling
// ---------------------------------------------------------------------------

/** Handle arrow keys, Home, and End with optional Shift-selection. */
export function handleArrowKeys(
  activeText: ActiveText,
  key: string,
  event?: KeyboardEvent,
): ActiveText {
  event?.preventDefault();
  event?.stopPropagation();

  const lines = activeText.content.split("\n");
  const { line, column } = activeText.cursorPosition;
  const isShiftPressed = event?.shiftKey || false;

  let newLine = line;
  let newColumn = column;

  // Start selection if shift is pressed and none exists
  let updated = activeText;
  if (isShiftPressed && !activeText.selection?.isActive) {
    updated = {
      ...activeText,
      selection: {
        anchor: { line, column },
        focus: { line, column },
        isActive: true,
      },
    };
  }

  switch (key) {
    case "ArrowLeft":
      if (column > 0) {
        newColumn = column - 1;
      } else if (line > 0) {
        newLine = line - 1;
        newColumn = lines[newLine].length;
      }
      break;
    case "ArrowRight":
      if (column < lines[line].length) {
        newColumn = column + 1;
      } else if (line < lines.length - 1) {
        newLine = line + 1;
        newColumn = 0;
      }
      break;
    case "ArrowUp":
      if (line > 0) {
        newLine = line - 1;
        newColumn = Math.min(column, lines[newLine].length);
      }
      break;
    case "ArrowDown":
      if (line < lines.length - 1) {
        newLine = line + 1;
        newColumn = Math.min(column, lines[newLine].length);
      }
      break;
    case "Home":
      newColumn = 0;
      break;
    case "End":
      newColumn = lines[line].length;
      break;
  }

  if (isShiftPressed) {
    const newFocus = { line: newLine, column: newColumn };
    const isSelectionEmpty =
      updated.selection!.anchor.line === newFocus.line &&
      updated.selection!.anchor.column === newFocus.column;

    return {
      ...updated,
      cursorPosition: newFocus,
      selection: {
        ...updated.selection!,
        focus: newFocus,
        isActive: !isSelectionEmpty,
      },
    };
  }

  return {
    ...updated,
    cursorPosition: { line: newLine, column: newColumn },
    selection: undefined,
  };
}

// ---------------------------------------------------------------------------
// Keyboard shortcuts (Ctrl+A, Ctrl+C)
// ---------------------------------------------------------------------------

/**
 * Handle keyboard shortcuts during text editing.
 * Returns updated ActiveText or null if not a recognized shortcut.
 */
export function handleKeyboardShortcuts(
  activeText: ActiveText,
  event: KeyboardEvent,
): ActiveText | null {
  // Ctrl+A: Select all
  if (event.key === "a" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    event.stopPropagation();

    const lines = activeText.content.split("\n");
    const lastLineIndex = lines.length - 1;
    const lastLineLength = lines[lastLineIndex].length;

    return {
      ...activeText,
      cursorPosition: { line: lastLineIndex, column: lastLineLength },
      selection: {
        anchor: { line: 0, column: 0 },
        focus: { line: lastLineIndex, column: lastLineLength },
        isActive: true,
      },
    };
  }

  // Ctrl+C: Copy (just return current state; copy is handled by the hook)
  if (event.key === "c" && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    event.stopPropagation();
    return activeText;
  }

  // Ctrl+V: Paste
  if (event.key === "v" && (event.ctrlKey || event.metaKey)) {
    // Don't prevent default -- let the paste event fire for the hook to handle
    return activeText;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Main text edit handler
// ---------------------------------------------------------------------------

/**
 * Process a keypress during inline text editing.
 *
 * Returns the updated ActiveText, or null to signal that the text should
 * be committed (Enter pressed without Shift).
 */
export function handleTextEdit(
  activeText: ActiveText,
  key: string,
  event?: KeyboardEvent,
): ActiveText | null {
  // Check for keyboard shortcuts first
  if (event && (event.ctrlKey || event.metaKey)) {
    const shortcutResult = handleKeyboardShortcuts(activeText, event);
    if (shortcutResult) return shortcutResult;
  }

  let result: ActiveText | null = null;

  // If there's a selection and we're typing a character or pressing delete/backspace,
  // delete the selected text first
  if (
    activeText.selection?.isActive &&
    (key.length === 1 || key === "Backspace" || key === "Delete")
  ) {
    activeText = deleteSelectedText(activeText);
    if (key === "Backspace" || key === "Delete") {
      return activeText;
    }
    // Re-derive lines/currentLine after deletion
  }

  // Re-derive after potential selection deletion
  const updatedLines = activeText.content.split("\n");
  const updatedCurrentLine = updatedLines[activeText.cursorPosition.line];

  switch (key) {
    case "Enter": {
      event?.preventDefault();
      event?.stopPropagation();

      // Shift+Enter adds a new line, plain Enter commits the text
      if (!event?.shiftKey) {
        return null; // Signal to commit
      }

      const beforeCursor = updatedCurrentLine.slice(0, activeText.cursorPosition.column);
      const afterCursor = updatedCurrentLine.slice(activeText.cursorPosition.column);
      const newLines = [...updatedLines];
      newLines[activeText.cursorPosition.line] = beforeCursor;
      newLines.splice(activeText.cursorPosition.line + 1, 0, afterCursor);

      result = {
        ...activeText,
        content: newLines.join("\n"),
        cursorPosition: {
          line: activeText.cursorPosition.line + 1,
          column: 0,
        },
        selection: undefined,
      };
      break;
    }

    case "Backspace": {
      event?.preventDefault();
      event?.stopPropagation();
      if (activeText.cursorPosition.column > 0) {
        const newLines = [...updatedLines];
        newLines[activeText.cursorPosition.line] =
          updatedCurrentLine.slice(0, activeText.cursorPosition.column - 1) +
          updatedCurrentLine.slice(activeText.cursorPosition.column);

        result = {
          ...activeText,
          content: newLines.join("\n"),
          cursorPosition: {
            ...activeText.cursorPosition,
            column: activeText.cursorPosition.column - 1,
          },
          selection: undefined,
        };
      } else if (activeText.cursorPosition.line > 0) {
        const prevLine = updatedLines[activeText.cursorPosition.line - 1];
        const newLines = [...updatedLines];
        newLines.splice(activeText.cursorPosition.line - 1, 2, prevLine + updatedCurrentLine);

        result = {
          ...activeText,
          content: newLines.join("\n"),
          cursorPosition: {
            line: activeText.cursorPosition.line - 1,
            column: prevLine.length,
          },
          selection: undefined,
        };
      }
      break;
    }

    case "Delete": {
      event?.preventDefault();
      event?.stopPropagation();
      if (activeText.cursorPosition.column < updatedCurrentLine.length) {
        const newLines = [...updatedLines];
        newLines[activeText.cursorPosition.line] =
          updatedCurrentLine.slice(0, activeText.cursorPosition.column) +
          updatedCurrentLine.slice(activeText.cursorPosition.column + 1);

        result = {
          ...activeText,
          content: newLines.join("\n"),
          cursorPosition: activeText.cursorPosition,
          selection: undefined,
        };
      } else if (activeText.cursorPosition.line < updatedLines.length - 1) {
        const nextLine = updatedLines[activeText.cursorPosition.line + 1];
        const newLines = [...updatedLines];
        newLines.splice(activeText.cursorPosition.line, 2, updatedCurrentLine + nextLine);

        result = {
          ...activeText,
          content: newLines.join("\n"),
          cursorPosition: activeText.cursorPosition,
          selection: undefined,
        };
      }
      break;
    }

    case "ArrowLeft":
    case "ArrowRight":
    case "ArrowUp":
    case "ArrowDown":
    case "Home":
    case "End":
      result = handleArrowKeys(activeText, key, event);
      break;

    default:
      if (key.length === 1) {
        event?.preventDefault();
        event?.stopPropagation();
        const newLines = [...updatedLines];
        newLines[activeText.cursorPosition.line] =
          updatedCurrentLine.slice(0, activeText.cursorPosition.column) +
          key +
          updatedCurrentLine.slice(activeText.cursorPosition.column);

        result = {
          ...activeText,
          content: newLines.join("\n"),
          cursorPosition: {
            ...activeText.cursorPosition,
            column: activeText.cursorPosition.column + 1,
          },
          selection: undefined,
        };
      }
      break;
  }

  return result || activeText;
}

// ---------------------------------------------------------------------------
// Mouse-based cursor positioning
// ---------------------------------------------------------------------------

/**
 * Estimate the character column at a given X offset within a monospace text line.
 *
 * @param xOffset - Horizontal offset in pixels from the start of the line.
 * @param charWidth - Width of a single monospace character in pixels.
 * @param lineLength - Number of characters in the line.
 * @returns The column index (0-based).
 */
export function estimateColumn(xOffset: number, charWidth: number, lineLength: number): number {
  if (charWidth <= 0) return 0;
  const col = Math.round(xOffset / charWidth);
  return Math.max(0, Math.min(lineLength, col));
}

/**
 * Compute a cursor position from a click within the active text area.
 *
 * @param localX - X offset in pixels from the text origin.
 * @param localY - Y offset in pixels from the text origin.
 * @param lineHeightPx - Line height in pixels.
 * @param charWidthPx - Character width in pixels (monospace).
 * @param content - The text content.
 * @returns The cursor position.
 */
export function getCursorFromLocalCoords(
  localX: number,
  localY: number,
  lineHeightPx: number,
  charWidthPx: number,
  content: string,
): CursorPosition {
  const lines = content.split("\n");

  // Determine which line was clicked
  let lineIndex = Math.floor(localY / lineHeightPx);
  lineIndex = Math.max(0, Math.min(lines.length - 1, lineIndex));

  // Determine column
  const column = estimateColumn(localX, charWidthPx, lines[lineIndex].length);

  return { line: lineIndex, column };
}

/**
 * Handle mouse down for starting text selection.
 */
export function handleTextMouseDown(
  activeText: ActiveText,
  localX: number,
  localY: number,
  lineHeightPx: number,
  charWidthPx: number,
): ActiveText {
  const cursorPosition = getCursorFromLocalCoords(
    localX,
    localY,
    lineHeightPx,
    charWidthPx,
    activeText.content,
  );

  return {
    ...activeText,
    cursorPosition,
    selection: {
      anchor: cursorPosition,
      focus: cursorPosition,
      isActive: false,
    },
  };
}

/**
 * Handle mouse move for extending text selection.
 */
export function handleTextMouseMove(
  activeText: ActiveText,
  localX: number,
  localY: number,
  lineHeightPx: number,
  charWidthPx: number,
  isMouseDown: boolean,
): ActiveText {
  if (!isMouseDown || !activeText.selection) return activeText;

  const cursorPosition = getCursorFromLocalCoords(
    localX,
    localY,
    lineHeightPx,
    charWidthPx,
    activeText.content,
  );

  const isSelectionEmpty =
    activeText.selection.anchor.line === cursorPosition.line &&
    activeText.selection.anchor.column === cursorPosition.column;

  return {
    ...activeText,
    cursorPosition,
    selection: {
      ...activeText.selection,
      focus: cursorPosition,
      isActive: !isSelectionEmpty,
    },
  };
}

/**
 * Handle double-click for word selection.
 */
export function handleTextDoubleClick(
  activeText: ActiveText,
  localX: number,
  localY: number,
  lineHeightPx: number,
  charWidthPx: number,
): ActiveText {
  const cursorPosition = getCursorFromLocalCoords(
    localX,
    localY,
    lineHeightPx,
    charWidthPx,
    activeText.content,
  );

  const lines = activeText.content.split("\n");
  const line = lines[cursorPosition.line];

  // Find word boundaries
  let startCol = cursorPosition.column;
  let endCol = cursorPosition.column;

  while (startCol > 0 && !/\s/.test(line[startCol - 1])) {
    startCol--;
  }
  while (endCol < line.length && !/\s/.test(line[endCol])) {
    endCol++;
  }

  return {
    ...activeText,
    cursorPosition: { ...cursorPosition, column: endCol },
    selection: {
      anchor: { ...cursorPosition, column: startCol },
      focus: { ...cursorPosition, column: endCol },
      isActive: startCol !== endCol,
    },
  };
}
