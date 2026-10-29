import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { useTranslation } from '../../i18n';
import { type TextMessage } from '../../Message';
import Search from '../../semantic/Search';
import { usePaneAriaLabel } from '../Pane/PaneAriaLabel';
import { InSearchContext } from './context';

export type ToolbarSearchProps = {
  /**
   * The name of the search landmark: what the user searches or filters.
   * Without it, the ariaLabel of the Pane.
   */
  ariaLabel?: TextMessage;
  /** The fields and the buttons of the search, in a row */
  children: ReactNode;
  /** For the layout of the children or for a container query of the page */
  className?: string;
};

/**
 * A search or a filter form that takes all the free width of the toolbar.
 * Its children are in a row. It is a search landmark: a Toolbar.FilterInput
 * in it renders no landmark of its own.
 */
function ToolbarSearch({ ariaLabel, children, className }: ToolbarSearchProps) {
  const paneAriaLabel = usePaneAriaLabel();
  const { tm } = useTranslation();

  return (
    <Search
      ariaLabel={ariaLabel ? tm(ariaLabel) : paneAriaLabel}
      className={classNames('Toolbar__fill', className)}
    >
      <InSearchContext.Provider value={true}>
        {children}
      </InSearchContext.Provider>
    </Search>
  );
}

export default ToolbarSearch;
