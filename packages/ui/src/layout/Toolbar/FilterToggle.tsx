import React, { useCallback, useEffect, useState } from 'react';
import { Generic } from '../../../icons/index';
import { useTranslation } from '../../i18n';
import { usePaneAriaLabel } from '../Pane/PaneAriaLabel';
import Button from './Button';

export type FilterToggleProps = {
  /** The filter is open ("open" of useFilterToolbar) */
  pressed: boolean;
  /** Opens or closes the filter ("onToggle" of useFilterToolbar) */
  onClick: () => void;
  /** The keys of the HotKeyListener around the toggle show in its tooltip */
  hotKey?: boolean;
};

const HOT_KEY_TOOLTIP = { hotKey: true } as const;

// The keys that open the filter of a list
export const FILTER_LIST_HOT_KEY = 'mod+shift+f';

/**
 * The magnifier that opens the filter of a list. Put the toggle at the
 * right end of the title bar, immediately before the button of the title
 * bar when there is one. Use the toggle with useFilterToolbar.
 */
function FilterToggle({ pressed, onClick, hotKey }: FilterToggleProps) {
  const { t } = useTranslation();
  const paneAriaLabel = usePaneAriaLabel();

  return (
    <Button
      label={
        paneAriaLabel
          ? t('a11y.filterToggle', { name: paneAriaLabel })
          : t('hotkeys.filterList')
      }
      icon={Generic.SearchIcon}
      iconOnly={true}
      tooltip={hotKey ? HOT_KEY_TOOLTIP : undefined}
      pressed={pressed}
      onClick={onClick}
    />
  );
}

export default React.memo(FilterToggle);

type UseFilterToolbarOptions = {
  // The list has a filter with a value
  isFiltering: boolean;
  // Removes all the values of the filter. It runs when the user closes the
  // toolbar of a filtered list.
  onClear: () => void;
  // Runs each time the user closes the toolbar, also when the filter has no
  // value (for example, to discard a draft that the list did not apply)
  onClose?: () => void;
  // The toolbar is open before the user opens it (for example, in a picker,
  // where the search is the primary task)
  defaultOpen?: boolean;
};

// The toolbar is open when the user opens it, or when the filter has a value.
// Thus a filtered list always shows its filter. When the user
// closes the toolbar of a filtered list, the filter clears.
export function useFilterToolbar({
  isFiltering,
  onClear,
  onClose,
  defaultOpen = false,
}: UseFilterToolbarOptions) {
  const [openByUser, setOpenByUser] = useState(defaultOpen);
  // The user opened the toolbar with a click, thus the filter gets the focus
  const [autoFocus, setAutoFocus] = useState(false);
  // The filter clears a moment after the user closes the toolbar. Until
  // then, the value of the filter must not show the toolbar again.
  const [isClosing, setClosing] = useState(false);

  useEffect(() => {
    if (!isFiltering) setClosing(false);
  }, [isFiltering]);

  const open = openByUser || (isFiltering && !isClosing);

  const handleOpen = useCallback(() => {
    setOpenByUser(true);
    setAutoFocus(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpenByUser(false);
    setAutoFocus(false);
    onClose?.();

    // Without a value there is nothing to clear, and a change of the
    // filter moves the list back to its first page
    if (isFiltering) {
      setClosing(true);
      onClear();
    }
  }, [isFiltering, onClear, onClose]);

  return {
    open,
    onOpen: handleOpen,
    onClose: handleClose,
    onToggle: open ? handleClose : handleOpen,
    autoFocus,
  };
}
