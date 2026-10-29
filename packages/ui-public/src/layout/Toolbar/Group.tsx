import cn from 'classnames';
import React, { ReactNode } from 'react';

export type GroupProps = {
  /** The controls of the group */
  children: ReactNode;
  /**
   * Without a gap, the space between the controls is --Toolbar-group-gap,
   * and the ghost icon buttons show as one strip. Use "s" for controls that
   * have a visible surface, for example a primary button.
   */
  gap?: 's';
};

/**
 * Controls that act as one unit (for example the filter controls at the
 * right end). A group without visible children takes no space.
 */
function Group({ children, gap }: GroupProps) {
  return (
    <div className={cn('Toolbar__group', gap && `Toolbar__group--${gap}`)}>
      {children}
    </div>
  );
}

export default React.memo(Group);
