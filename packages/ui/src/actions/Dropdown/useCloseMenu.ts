import { useContext } from 'react';
import DropdownContext from './DropdownContext';

/**
 * Returns the function that closes the menu of the nearest Dropdown.
 * Dropdown.Option closes the menu by itself. Content that is not an option
 * (for example a small form in the menu) calls this function after its
 * action. Out of a Dropdown, the function does nothing.
 */
export function useCloseMenu(): () => void {
  return useContext(DropdownContext).closeMenu;
}
