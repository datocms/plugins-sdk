import { Misc, Navigation } from '../../../icons/index';

export const TOGGLE_LEFT_SIDEBAR_ACTION_ID = 'sidebar.toggleLeft';

export const TOGGLE_RIGHT_SIDEBAR_ACTION_ID = 'sidebar.toggleRight';

export function toggleActionId(secondarySide: 'left' | 'right') {
  return secondarySide === 'left'
    ? TOGGLE_LEFT_SIDEBAR_ACTION_ID
    : TOGGLE_RIGHT_SIDEBAR_ACTION_ID;
}

// The sash and the rail show the same icon for the same state of the pane.
export function toggleIcon(secondarySide: 'left' | 'right', open: boolean) {
  if (secondarySide === 'left') {
    return open ? Navigation.ChevronsLeftIcon : Navigation.ChevronsRightIcon;
  }
  return open ? Navigation.ChevronsRightIcon : Misc.SidebarFlipIcon;
}
