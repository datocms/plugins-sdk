import React from 'react';

// True in a toolbar. Some buttons show only their icon in a toolbar of a
// secondary pane.
export const InToolbarContext = React.createContext(false);

type MenuProvider = React.ComponentType<{ children: React.ReactNode }>;

function NoMenuProvider({ children }: { children: React.ReactNode }) {
  return React.createElement(React.Fragment, null, children);
}

// The app can put the menu of a DotsDropdown or of a TextualDropdown in a
// provider of its own. Each menu gets a new instance of the provider. The cms
// gives the provider of the plugin actions (ActionsToOptionsProvider).
export const ToolbarMenuProviderContext =
  React.createContext<MenuProvider>(NoMenuProvider);

// True in a Toolbar.Search. A part in it renders no search landmark of its
// own, because two nested search landmarks break the structure of the page
// for a screen reader (WCAG 1.3.1).
export const InSearchContext = React.createContext(false);
