import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Generic } from '../../../icons/index';
import { HotKeyListener } from '../../actions/HotKey';
import BlankSlate from '../../feedback/BlankSlate';
import Toolbar from '../Toolbar';
import FilterToggle, {
  FILTER_LIST_HOT_KEY,
  useFilterToolbar,
} from '../Toolbar/FilterToggle';
import { ListPreset, useListPresets } from './ListPresets';

export type ListFilterProps = {
  value: string;
  onChange: (value: string) => void;
  debounce?: boolean;
};

type ListFilterState = {
  filter: ListFilterProps;
  /** The filter row shows. */
  open: boolean;
  /**
   * Runs with the new state. `true` opens the row and moves the focus to the
   * input, also when the row is open. `false` closes the row and clears a
   * filter with a value.
   */
  onToggle: (open: boolean) => void;
  rowRef: React.MutableRefObject<HTMLDivElement | null>;
};

// Keeps the state that the filter button and the filter row share: open or
// closed, the focus of the input, and the close when the list loses its
// filter (for example, in the edit mode of a sidebar). Returns undefined
// when the list has no filter. PaneHeader uses it.
export function useListFilter(
  filter: ListFilterProps | undefined,
): ListFilterState | undefined {
  const rowRef = useRef<HTMLDivElement>(null);
  const onFilterChange = filter?.onChange;

  const clearFilter = useCallback(() => {
    onFilterChange?.('');
  }, [onFilterChange]);

  const {
    open: openByToolbar,
    onOpen: openToolbar,
    onClose,
  } = useFilterToolbar({
    isFiltering: Boolean(filter?.value),
    onClear: clearFilter,
  });

  // A list that loses its filter closes it, thus the filter is closed when
  // it comes back
  useEffect(() => {
    if (!filter) onClose();
  }, [Boolean(filter)]);

  const onOpen = useCallback(() => {
    openToolbar();
    // The input is in the DOM only after the next render
    requestAnimationFrame(() => {
      rowRef.current?.querySelector('input')?.focus();
    });
  }, [openToolbar]);

  const onToggle = useCallback(
    (nextOpen: boolean) => (nextOpen ? onOpen() : onClose()),
    [onOpen, onClose],
  );

  const open = filter !== undefined && openByToolbar;

  return useMemo(
    () => (filter ? { filter, open, onToggle, rowRef } : undefined),
    [filter, open, onToggle],
  );
}

type ButtonProps = {
  open: boolean;
  onToggle: (open: boolean) => void;
};

export const ListFilterButton = React.memo(function ListFilterButton({
  open,
  onToggle,
}: ButtonProps) {
  // The hotkey only opens the filter. When the filter is open, it moves the
  // focus to the input.
  const handleHotKey = useCallback(() => onToggle(true), [onToggle]);
  const handleClick = useCallback(() => onToggle(!open), [onToggle, open]);

  return (
    <HotKeyListener
      hotKey={FILTER_LIST_HOT_KEY}
      description={{ id: 'hotkeys.filterList' }}
      trigger={handleHotKey}
    >
      <FilterToggle pressed={open} onClick={handleClick} hotKey={true} />
    </HotKeyListener>
  );
});

type RowProps = {
  filter: ListFilterProps;
  onToggle: (open: boolean) => void;
  rowRef: React.MutableRefObject<HTMLDivElement | null>;
};

export const ListFilterRow = React.memo(function ListFilterRow({
  filter,
  onToggle,
  rowRef,
}: RowProps) {
  const onClose = useCallback(() => onToggle(false), [onToggle]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      // Other Esc hotkeys (for example, the one that stops edit mode) must not
      // also run
      event.stopPropagation();
      onClose();
    },
    [onClose],
  );

  // The header slot of the layout gives the bottom border to this element
  return (
    <div ref={rowRef} onKeyDown={handleKeyDown}>
      <Toolbar style="short">
        <Toolbar.FilterInput
          value={filter.value}
          onChange={filter.onChange}
          debounce={filter.debounce}
          onClose={onClose}
        />
      </Toolbar>
    </div>
  );
});

/**
 * The text filter and the presets of a list in memory. Give "filter" to
 * Pane.Header and "presets" to Pane.Header.Title, and show "filteredItems".
 * The text filter narrows inside the active preset.
 */
export function useFilteredList<T>(
  items: T[],
  getTexts: (item: T) => Array<string | null | undefined>,
  presetOptions?: ListPreset<T>[],
) {
  const [value, setValue] = useState('');
  const [presetId, setPresetId] = useState<string | null>(null);
  const term = value.trim().toLowerCase();

  const { presets, activePreset } = useListPresets(
    items,
    presetOptions,
    presetId,
    setPresetId,
  );

  const presetItems = activePreset ? items.filter(activePreset.matches) : items;

  const filteredItems = term
    ? presetItems.filter((item) =>
        getTexts(item).some((text) => text?.toLowerCase().includes(term)),
      )
    : presetItems;

  const filter = useMemo(() => ({ value, onChange: setValue }), [value]);

  const isFiltering = term !== '' || activePreset !== undefined;

  return {
    filter,
    presets,
    filteredItems,
    // True when the text filter or a preset is active
    isFiltering,
    hasNoResults: isFiltering && filteredItems.length === 0,
  };
}

// The content of a pane whose filter keeps no item. Pane.Header renders the
// button and the row of the filter: only this goes in the content.
export const FilterBlankSlate = React.memo(function FilterBlankSlate() {
  return (
    <BlankSlate
      placement="area"
      small
      icon={<Generic.SearchIcon />}
      title={{ id: 'listFilter.noResults.title' }}
      description={{ id: 'listFilter.noResults.description' }}
    />
  );
});
