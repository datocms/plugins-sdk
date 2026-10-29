import React from 'react';
import Link from '../../../navigation/Link';

export type LinkCellProps = {
  /** The path of the link */
  to: string;
  /** The text of the link: a string, thus the title can show it */
  children: string;
};

/** A link in a cell. The title shows the full text when the column cuts it. */
function LinkCell({ to, children }: LinkCellProps) {
  return (
    <Link to={to} title={children}>
      {children}
    </Link>
  );
}

export default React.memo(LinkCell);
