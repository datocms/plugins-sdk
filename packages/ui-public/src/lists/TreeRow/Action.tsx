import React, { type ReactNode } from 'react';
import { useTranslation } from '../../i18n';
import type { Message } from '../../Message';
import RawButton from '../../semantic/RawButton';
import { useTreeRow } from '../dnd/tree/TreeRowContext';

export type TreeRowActionProps = {
  /**
   * The icon in the column of the handle, for example the `LoadMoreChevron`
   * of a "Load more" row
   */
  icon: ReactNode;
  /** The text of the button */
  label: Message;
  /** Runs on a click on the row */
  onClick: () => void;
};

/**
 * The content of a `TreeRow` as a button, for example "Load more". The
 * button starts in the column of the handle, thus a click there also runs
 * it. Give it to a row with no `expandable` and no `drag.handle`. In a
 * SortableTree, the button is a tree item: the arrow keys move the focus to
 * it, and Enter or Space runs it.
 */
export default function TreeRowAction({
  icon,
  label,
  onClick,
}: TreeRowActionProps) {
  const { tc } = useTranslation();
  const treeRow = useTreeRow();

  return (
    <RawButton
      className="TreeRow__action"
      onClick={onClick}
      {...treeRow?.provided.treeItemProps}
    >
      <span className="TreeRow__handle">
        <span className="TreeRow__drag-handle">{icon}</span>
      </span>
      <span className="TreeRow__action__label">{tc(label)}</span>
    </RawButton>
  );
}
