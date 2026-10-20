import React, { ReactNode } from 'react';

export type ListAreaProps = {
  /**
   * The table of the list, the notices above it, or a BlankSlate (no
   * results, loading)
   */
  children: ReactNode;
};

/**
 * The area of the list of a page, under the title bar: the space around the
 * table and the notices above it. It uses all the width, and a BlankSlate in
 * it stays in the center of the content of the Pane. Use it for each list in a
 * Pane, with a detail (ListDetail.Split) or not.
 */
function ListArea({ children }: ListAreaProps) {
  return <div className="ListArea">{children}</div>;
}

export default React.memo(ListArea);
