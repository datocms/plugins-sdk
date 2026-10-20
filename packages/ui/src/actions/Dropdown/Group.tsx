import React from 'react';
import { SortableDropResult, SortableList } from '../../lists/dnd';
import type { Message } from '../../Message';
import { MenuGroup } from './MenuParts';

export type GroupProps = {
  /** The options of the group */
  children: React.ReactNode;
  /**
   * The title of the group, for example `{ id: 'filter.shared' }`. It sticks
   * at the top while the options scroll.
   */
  name?: Message;
  /**
   * An icon before the title, for the kind of all the options of the group
   * (an organization, an agency). The options then have no icon of their
   * own.
   */
  icon?: React.ReactNode;
  /**
   * Give it to let the user reorder the options of the group with drag and
   * drop. Each option then needs "sortable".
   */
  onDragEnd?: (result: SortableDropResult) => void;
};

/** Options under a title, in a menu with many options */
const Group = ({ children, name, icon, onDragEnd }: GroupProps) => {
  return (
    <MenuGroup title={name} icon={icon}>
      {onDragEnd ? (
        <SortableList onDrop={onDragEnd}>{children}</SortableList>
      ) : (
        children
      )}
    </MenuGroup>
  );
};

export default Group;
