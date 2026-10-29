import { useCallback, useState } from 'react';
import type { TableLayout } from './types';

// A storage pair keeps the layout of a table. Give the two values to the
// `layout` and `onLayoutChange` props of <Table>.
//
// The caller picks one of these hooks, or writes its own pair. A table with
// a layout in Redux reads the layout with its store query and dispatches an
// action in `setLayout` (see useActivityLogTableLayout in
// components/sub/ActivityLog).
export type TableLayoutStorage = [
  layout: TableLayout,
  setLayout: (layout: TableLayout) => void,
];

export function useInMemoryTableLayout(
  defaultLayout: TableLayout,
): TableLayoutStorage {
  return useState(defaultLayout);
}

function readStoredLayout(key: string): TableLayout | undefined {
  try {
    const value = window.localStorage.getItem(key);

    if (!value) {
      return undefined;
    }

    const parsed = JSON.parse(value);

    return Array.isArray(parsed?.columns) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

// When the storage of the browser is not available, the layout stays only in
// the memory
export function useLocalStorageTableLayout(
  key: string,
  defaultLayout: TableLayout,
): TableLayoutStorage {
  const [layout, setStateLayout] = useState(
    () => readStoredLayout(key) ?? defaultLayout,
  );

  const setLayout = useCallback(
    (newLayout: TableLayout) => {
      setStateLayout(newLayout);

      try {
        window.localStorage.setItem(key, JSON.stringify(newLayout));
      } catch {
        // The layout stays in the memory
      }
    },
    [key],
  );

  return [layout, setLayout];
}
