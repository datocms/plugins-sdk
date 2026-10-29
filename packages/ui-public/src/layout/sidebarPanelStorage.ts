import { useCallback, useState } from 'react';

// A storage pair keeps the open state of a panel. Give it to the `collapse`
// prop of <SidebarPanel>: `collapse={{ open, onToggle: setOpen }}`.
//
// The caller picks one of these hooks, or writes its own pair (for example
// with Redux).
export type SidebarPanelOpenStorage = [
  open: boolean,
  setOpen: (open: boolean) => void,
];

export function useInMemorySidebarPanelOpen(
  defaultOpen: boolean,
): SidebarPanelOpenStorage {
  return useState(defaultOpen);
}

// All the panels share this key. It holds a JSON map from the key of a panel
// to its open state. Do not change the format: the users keep their panels.
const STORAGE_KEY = 'openSidebarPanels';

// The browser can block the storage, and the stored text can be wrong (it
// can come from an older version). In these cases, the panels have no saved
// state.
function readPanels(): Record<string, boolean> {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = value ? JSON.parse(value) : null;

    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(([, open]) => typeof open === 'boolean'),
    );
  } catch {
    return {};
  }
}

// When the storage of the browser is not available, the open state stays
// only in the memory. Use a key that no other panel uses.
export function useLocalStorageSidebarPanelOpen(
  key: string,
  defaultOpen: boolean,
): SidebarPanelOpenStorage {
  const [open, setStateOpen] = useState(() => {
    const panels = readPanels();
    return key in panels ? panels[key] : defaultOpen;
  });

  const setOpen = useCallback(
    (newOpen: boolean) => {
      setStateOpen(newOpen);

      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...readPanels(), [key]: newOpen }),
        );
      } catch {
        // The open state stays in the memory
      }
    },
    [key],
  );

  return [open, setOpen];
}
