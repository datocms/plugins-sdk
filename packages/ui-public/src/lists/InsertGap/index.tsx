import React, { type ReactNode } from 'react';
import { Dropdown } from '../../actions/Dropdown';
import { DropdownTriggerBaseProps } from '../../actions/Dropdown/triggers/types';
import { type TextMessage } from '../../Message';
import {
  handlePointerLeaveList,
  handlePointerMoveList,
} from '../../utils/pointerNearGap';
import { Bar, GapFrame, type InsertGapBaseProps } from './parts';

/**
 * The props of the element of a list with gaps: give them to the element
 * that holds the items (`<div {...insertGapListProps}>`). The gaps of the
 * list then show their button when the pointer is near them.
 */
export const insertGapListProps = {
  // See LIST_SELECTOR in pointerNearGap
  'data-gap-list': '',
  onPointerMove: handlePointerMoveList,
  onPointerLeave: handlePointerLeaveList,
};

/** A gap that adds the item at once, when there is no choice to make. */
export type InsertGapActionProps = InsertGapBaseProps & {
  /** Runs on a click on the gap. */
  onTrigger: () => void;
  children?: never;
};

/** A gap that opens a menu, when the user has a choice to make. */
export type InsertGapMenuProps = InsertGapBaseProps & {
  onTrigger?: never;
  /** The options of the menu that a click on the gap opens. */
  children: ReactNode;
};

export type InsertGapProps = InsertGapActionProps | InsertGapMenuProps;

const BarMenuTrigger = ({
  label,
  onTrigger,
  open,
}: DropdownTriggerBaseProps & { label: TextMessage }) => (
  <Bar label={label} onTrigger={onTrigger} open={open} />
);

// The CSS shows the small button and the line only when the pointer is near
// the gap (see pointerNearGap). The gap never changes its height (see
// _InsertGap.css).
const InsertGap = ({
  position,
  label,
  onTrigger,
  children,
}: InsertGapProps) => (
  <GapFrame position={position}>
    {onTrigger ? (
      <Bar label={label} onTrigger={onTrigger} />
    ) : (
      <Dropdown triggerComponent={BarMenuTrigger} label={label}>
        <Dropdown.Menu placement="bottom-start">{children}</Dropdown.Menu>
      </Dropdown>
    )}
  </GapFrame>
);

export default React.memo(InsertGap);
