import React, { type ReactNode, useEffect, useRef } from 'react';
import { usePaneTitleId } from '../layout/Pane/PaneTitleId';
import RowList, { type RowListItemProps } from '../lists/RowList';
import { type TextMessage } from '../Message';
import Nav from '../semantic/Nav';

export type NavListProps = {
  /**
   * The accessible name of the navigation. In a Pane with a
   * Pane.Header.Title, leave it out: the title gives the name. Give it in
   * other places (for example a SidebarPanel), with the name of the section,
   * not the word "navigation".
   * @example { id: 'admin.ssoGroups.detail.users' }
   */
  ariaLabel?: TextMessage;
  /** The rows (NavList.Item) */
  children: ReactNode;
};

/**
 * A list of rows in a sidebar. Each row opens a page of the app, and the row
 * of the open page is selected. It is a RowList in a navigation landmark.
 */
function BaseNavList({ ariaLabel, children }: NavListProps) {
  const paneTitleId = usePaneTitleId();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!import.meta.env.DEV || ariaLabel !== undefined) return;
    const labelledBy = ref.current?.getAttribute('aria-labelledby');
    if (!labelledBy || !document.getElementById(labelledBy)) {
      console.warn(
        'NavList has no name: put it in a Pane with a Pane.Header.Title, or give it an ariaLabel',
      );
    }
  });

  // Without a Pane title the id is empty, and the warning above shows
  const name =
    ariaLabel !== undefined
      ? { ariaLabel }
      : { ariaLabelledBy: paneTitleId ?? '' };

  return (
    <Nav ref={ref} className="NavList" {...name}>
      <RowList>{children}</RowList>
    </Nav>
  );
}

export type NavListItemProps = Pick<
  RowListItemProps,
  'muted' | 'sortable' | 'id' | 'children'
> & {
  /** The page that the row opens. The row is selected while this page is open. */
  to: string;
};

function Item(props: NavListItemProps) {
  return <RowList.Item {...props} />;
}

// No React.memo: the rows get children, thus they render again in all cases
const NavList = Object.assign(BaseNavList, { Item });

export default NavList;
