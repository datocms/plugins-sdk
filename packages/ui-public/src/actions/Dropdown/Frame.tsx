import classNames from 'classnames';
import React, { type ReactNode } from 'react';

/** The sides where the picture at rest can place its menu */
export type StaticPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'top-start'
  | 'top-end';

type DropdownFrameProps = {
  /** The menu shows, or plays its exit animation */
  open: boolean;
  className?: string;
  /**
   * The picture at rest (`Static.tsx`) places its menu with CSS on this
   * side of the trigger. The live menu floats in a portal and needs none.
   */
  placement?: StaticPlacement;
  /** The trigger, then the menu when it is open */
  children: ReactNode;
};

/**
 * The element around the trigger and the menu. `Dropdown` and its picture
 * at rest (`Static.tsx`) render it.
 */
const DropdownFrame = React.forwardRef<HTMLDivElement, DropdownFrameProps>(
  function DropdownFrame({ open, className, placement, children }, ref) {
    return (
      <div
        className={classNames('Dropdown', className, { 'is-open': open })}
        data-placement={placement}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

export default DropdownFrame;
