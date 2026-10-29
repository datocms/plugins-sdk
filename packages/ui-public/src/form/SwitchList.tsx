import classNames from 'classnames';
import React, { createContext, type ReactNode, useContext } from 'react';

const SwitchListContext = createContext(false);

/** Tells if a `SwitchInput` is in a `SwitchList` */
export function useInSwitchList() {
  return useContext(SwitchListContext);
}

/** The props of `SwitchList` */
export type SwitchListProps = {
  /** The fields: a `Field` with a `SwitchInput` for each setting */
  children: ReactNode;
  className?: string;
};

/**
 * A list of related switches, for example the permissions of a role. Each
 * switch is an inset row: the label at the left, the switch at the right,
 * and a box that shows on hover. Put one list in a `Page.Group` for each topic.
 */
export function SwitchList({ children, className }: SwitchListProps) {
  return (
    <SwitchListContext.Provider value={true}>
      <div className={classNames('SwitchList', className)}>{children}</div>
    </SwitchListContext.Provider>
  );
}

export default SwitchList;
