import classNames from 'classnames';
import React, { ReactNode } from 'react';

export type FillProps = {
  /** The controls of the part, in a row */
  children: ReactNode;
  /** For the layout of the children or for a container query of the page */
  className?: string;
};

/**
 * A part that takes all the free width of the toolbar (for example a filter
 * form). For a search, use Toolbar.Search: it is a search landmark.
 */
function Fill({ children, className }: FillProps) {
  return (
    <div className={classNames('Toolbar__fill', className)}>{children}</div>
  );
}

export default Fill;
