import { isHotkey } from 'is-hotkey-esm';
import { KeyboardEvent } from 'react';

export function handleDropdownTriggerKeyDown(
  event: KeyboardEvent,
  onTrigger: (event: KeyboardEvent) => void,
  open: boolean,
) {
  if (
    isHotkey('enter', event.nativeEvent) ||
    isHotkey('space', event.nativeEvent)
  ) {
    onTrigger(event);
  } else if (isHotkey('escape', event.nativeEvent) && open) {
    onTrigger(event);
  } else if (isHotkey('down', event.nativeEvent) && !open) {
    // The menu button pattern of WAI-ARIA opens the menu on ArrowDown too.
    // We stop the default action, because the page must not scroll.
    event.preventDefault();
    onTrigger(event);
  }
}
