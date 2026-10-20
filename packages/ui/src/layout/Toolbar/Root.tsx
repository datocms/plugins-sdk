import cn from 'classnames';
import React, { ReactNode } from 'react';
import { ButtonSizeContext } from '../../actions/Button';
import { InToolbarContext } from './context';

export type ToolbarProps = {
  /** The parts of the toolbar (Toolbar.Title, Toolbar.Space, …) */
  children: ReactNode;
  /**
   * "short" is a lower bar (40px), for a second toolbar under the main one.
   * "full" makes the first part fill the width.
   */
  style?: 'short' | 'full';
  /** A line below the toolbar, for a toolbar on top of a dialog or of tabs */
  borderBottom?: boolean;
  /**
   * The toolbar holds fields (a filter form): its buttons have the height
   * of the fields ("field" size), thus their edges align
   */
  fields?: boolean;
  /** Only for the placement of the toolbar (for example "Modal__header") */
  className?: string;
};

/**
 * The bar of a Toolbar. Import it from this file only in a component that
 * the Toolbar index imports (for example Tabs), to prevent an import cycle.
 */
function Root({
  children,
  style,
  borderBottom,
  fields,
  className,
}: ToolbarProps) {
  return (
    <div
      className={cn(
        'Toolbar',
        style && `Toolbar--${style}`,
        { 'Toolbar--border-bottom': borderBottom },
        className,
      )}
    >
      <InToolbarContext.Provider value={true}>
        <ButtonSizeContext.Provider value={fields ? 'field' : 'milli'}>
          {children}
        </ButtonSizeContext.Provider>
      </InToolbarContext.Provider>
    </div>
  );
}

export default Root;
