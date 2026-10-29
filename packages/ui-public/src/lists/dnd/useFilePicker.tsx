import React, { useCallback, useMemo, useRef } from 'react';

export type UseFilePickerArgs = {
  /** Runs when the user picks files in the dialog of the browser. */
  onPick: (files: File[]) => void;
  /**
   * Lets the user pick more than one file.
   * @default true
   */
  multiple?: boolean;
};

export type UseFilePickerResult = {
  open: () => void;
  // The input is hidden: render it one time, in any position
  input: React.ReactElement;
};

const hiddenStyle: React.CSSProperties = { display: 'none' };

export function useFilePicker({
  onPick,
  multiple = true,
}: UseFilePickerArgs): UseFilePickerResult {
  const inputRef = useRef<HTMLInputElement>(null);

  const latestOnPick = useRef(onPick);
  latestOnPick.current = onPick;

  const open = useCallback(() => inputRef.current?.click(), []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);

    // This lets the user select the same file again
    e.target.value = '';

    if (files.length > 0) {
      latestOnPick.current(files);
    }
  }, []);

  const input = useMemo(
    () => (
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        style={hiddenStyle}
        tabIndex={-1}
        onChange={handleChange}
      />
    ),
    [multiple, handleChange],
  );

  return { open, input };
}
