import { useCallback, useEffect, useRef, useState } from "react";

interface UseInlineRenameOptions {
  value: string;
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
  onCommit: (value: string) => void;
}

/** Shared lifecycle for inline row rename fields. */
export function useInlineRename({
  value,
  isEditing,
  onEditingChange,
  onCommit,
}: UseInlineRenameOptions) {
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const canceledRef = useRef(false);
  const committedRef = useRef(false);

  useEffect(() => {
    if (!isEditing) {
      setDraft(value);
      return;
    }

    setDraft(value);
    canceledRef.current = false;
    committedRef.current = false;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [isEditing, value]);

  const commit = useCallback(() => {
    if (!isEditing || canceledRef.current || committedRef.current) return;
    committedRef.current = true;

    const nextValue = draft.trim();
    if (nextValue && nextValue !== value) {
      onCommit(nextValue);
    } else {
      setDraft(value);
    }
    onEditingChange(false);
  }, [draft, isEditing, onCommit, onEditingChange, value]);

  const cancel = useCallback(() => {
    if (!isEditing) return;
    canceledRef.current = true;
    setDraft(value);
    onEditingChange(false);
  }, [isEditing, onEditingChange, value]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        commit();
      } else if (event.key === "Escape") {
        event.preventDefault();
        cancel();
      }
    },
    [cancel, commit],
  );

  return {
    inputRef,
    draft,
    setDraft,
    commit,
    cancel,
    handleKeyDown,
  };
}
