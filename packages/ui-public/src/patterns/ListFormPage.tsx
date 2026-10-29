import React, { ReactElement, ReactNode } from 'react';
import ListOrOverview, {
  type ListOrOverviewState,
} from '../layout/ListOrOverview';
import SplitPane from '../layout/SplitPane';
import { isActivePath, useNavigation } from '../navigation/NavigationProvider';

export type ListFormPageProps = {
  /**
   * The URL of the section. Other URLs (for example the "new" form) always
   * show the children.
   */
  baseUrl: string;
  /** The state of the section (see getListOrOverviewState) */
  state: ListOrOverviewState;
  /**
   * Shows in place of the children when the section is empty: a
   * BlankSlate with titleLevel={1} in a Main
   */
  overview: ReactElement;
  /**
   * The list of the elements: a Pane with a Pane.Header. With a list, the
   * page shows the list and the children in a split. When the section is
   * empty, the list has no use, thus the children (for example the "new"
   * form) show alone.
   */
  list?: ReactNode;
  /**
   * The open element (a Main with the routes of the forms), or all the
   * content of the section when there is no list
   */
  children: ReactNode;
};

/**
 * The content of a settings section whose elements are forms (for a list
 * with facts to scan, use ListDetail.Page): a ListOrOverview with the list
 * in a left pane of 300px and the open element at the right. On the URL of
 * the section, an empty section shows the overview. On another URL (for
 * example the "new" form), it shows the children alone.
 */
function ListFormPage({
  baseUrl,
  state,
  overview,
  list,
  children,
}: ListFormPageProps) {
  const { location } = useNavigation();
  const isSectionUrl = location
    ? isActivePath(location.pathname, baseUrl, true)
    : false;

  // Without a list, nothing waits for the first load on another URL
  if (
    !isSectionUrl &&
    (state === 'empty' || (state === 'loading' && list === undefined))
  ) {
    return <>{children}</>;
  }

  return (
    <ListOrOverview state={state} overview={overview}>
      {list !== undefined ? (
        <SplitPane size={300} primaryPane="right">
          {list}
          <div>{children}</div>
        </SplitPane>
      ) : (
        children
      )}
    </ListOrOverview>
  );
}

export default React.memo(ListFormPage);
