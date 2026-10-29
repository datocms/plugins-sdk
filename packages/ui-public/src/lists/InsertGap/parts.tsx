import classNames from 'classnames';
import React, { type ReactNode, useContext } from 'react';
import { Generic } from '../../../icons/index';
import DropdownContext from '../../actions/Dropdown/DropdownContext';
import { useTranslation } from '../../i18n';
import { type TextMessage } from '../../Message';
import Tooltip from '../../overlays/Tooltip';
import RawButton from '../../semantic/RawButton';

// The pieces that `InsertGap` and its picture at rest (`Static.tsx`) render

export type InsertGapBaseProps = {
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

export type BarProps = {
  label: TextMessage;
  onTrigger: (event: React.SyntheticEvent) => void;
  open?: boolean;
};

// The small button in the gutter and the line in the gap are only pictures:
// the bar is the button.
export const Bar = ({ label, onTrigger, open }: BarProps) => {
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

type GapFrameProps = Pick<InsertGapBaseProps, 'position'> & {
  children: ReactNode;
};

export const GapFrame = ({ position, children }: GapFrameProps) => (
  <div
    className={classNames('InsertGap', `InsertGap--${position}`)}
    // See GAP_SELECTOR in pointerNearGap
    data-gap=""
  >
    {children}
  </div>
);
