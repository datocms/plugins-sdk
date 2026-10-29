import { useMemo } from 'react';
import type { Message } from '../../Message';

/**
 * A preset of a list is a view of the list (a fixed filter with a name). The
 * user picks it from the menu of the title ("Not used in the last 2
 * months"). The presets are in the code of each list, not saved by the user.
 */
export type ListPreset<T> = {
  id: string;
  /** The name in the menu: it tells exactly what the preset keeps */
  label: Message;
  /**
   * The name after the title while the preset is active ("API tokens ·
   * Unused"): one or two words
   */
  shortLabel: Message;
  /** The items that the preset keeps */
  matches: (item: T) => boolean;
};

/** A preset in the menu of the title, with the count of its items */
export type ListPresetOption = {
  id: string;
  label: Message;
  shortLabel: Message;
  count: number;
};

/**
 * The presets of a Pane.Header.Title. useListPresets (or useFilteredList)
 * gives them.
 */
export type ListPresetsProps = {
  options: ListPresetOption[];
  /** The id of the active preset, or null when the list shows all the items */
  value: string | null;
  /** Runs when the user picks a preset, or "All" (null) */
  onChange: (id: string | null) => void;
};

/**
 * The presets of a Pane.Header.Title, from the presets of a list and the
 * active one. A preset that keeps no item is not in the menu.
 * useFilteredList calls it.
 */
export function useListPresets<T>(
  items: T[],
  presets: ListPreset<T>[] | undefined,
  value: string | null,
  onChange: (id: string | null) => void,
): {
  presets: ListPresetsProps | undefined;
  activePreset: ListPreset<T> | undefined;
} {
  const activePreset = presets?.find((preset) => preset.id === value);

  // A preset that keeps no item is not in the menu: it can only show an empty
  // list. The active preset stays, also when it keeps no item (for example,
  // after the user enables the last disabled webhook). Thus the user can pick
  // another one. Without options, the title is not a menu.
  const options = useMemo(
    () =>
      presets
        ?.map((preset) => ({
          id: preset.id,
          label: preset.label,
          shortLabel: preset.shortLabel,
          count: items.filter(preset.matches).length,
        }))
        .filter((option) => option.count > 0 || option.id === value),
    [presets, items, value],
  );

  const props = useMemo(
    () =>
      options && options.length > 0
        ? { options, value: activePreset ? value : null, onChange }
        : undefined,
    [options, value, activePreset, onChange],
  );

  return { presets: props, activePreset };
}
