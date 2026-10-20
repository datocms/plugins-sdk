import classNames from 'classnames';
import React, { ReactNode, useContext } from 'react';
import { Generic } from '../../icons/index';
import { Dropdown } from '../actions/Dropdown';
import DropdownContext from '../actions/Dropdown/DropdownContext';
import { DropdownTriggerBaseProps } from '../actions/Dropdown/triggers/types';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';
import Tooltip from '../overlays/Tooltip';
import RawButton from '../semantic/RawButton';
import {
  handlePointerLeaveList,
  handlePointerMoveList,
} from '../utils/pointerNearGap';

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

type InsertGapBaseProps = {
  /**
   * Where the gap is, in relation to the item that renders it: `before` is
   * above the item, `after` is below it.
   */
  position: 'before' | 'after';
  /**
   * What a click on the gap does. For example "Add a block". It is the
   * accessible name of the gap and the text of the tooltip of the small
   * button.
   */
  label: TextMessage;
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

type BarProps = {
  label: TextMessage;
  onTrigger: (event: React.SyntheticEvent) => void;
  open?: boolean;
};

// The small button in the gutter and the line in the gap are only pictures:
// the bar is the button.
const Bar = ({ label, onTrigger, open }: BarProps) => {
  // Out of a dropdown, "open" is not set. Then the bar is a plain button.
  const { triggerId, menuId } = useContext(DropdownContext);
  const { tm } = useTranslation();
  const labelText = tm(label);

  const content = (
    <>
      {/* At the left, so the tooltip does not cover the grips of the items
        above and below */}
      <Tooltip placement="left" label={labelText}>
        <span className="InsertGap__plus">
          <Generic.AddIcon />
        </span>
      </Tooltip>
      <span className="InsertGap__line" />
    </>
  );

  // The bar acts on "click", thus Enter and Space already open the menu
  return open === undefined ? (
    <RawButton
      className="InsertGap__bar"
      ariaLabel={labelText}
      onClick={onTrigger}
    >
      {content}
    </RawButton>
  ) : (
    <RawButton
      id={triggerId}
      className="InsertGap__bar"
      ariaLabel={labelText}
      onClick={onTrigger}
      haspopup="menu"
      expandable={{ open, controls: menuId }}
    >
      {content}
    </RawButton>
  );
};

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
  <div
    className={classNames('InsertGap', `InsertGap--${position}`)}
    // See GAP_SELECTOR in pointerNearGap
    data-gap=""
  >
    {onTrigger ? (
      <Bar label={label} onTrigger={onTrigger} />
    ) : (
      <Dropdown triggerComponent={BarMenuTrigger} label={label}>
        <Dropdown.Menu placement="bottom-start">{children}</Dropdown.Menu>
      </Dropdown>
    )}
  </div>
);

export default React.memo(InsertGap);
