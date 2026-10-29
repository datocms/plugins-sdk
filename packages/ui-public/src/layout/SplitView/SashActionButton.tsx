import classNames from 'classnames';
import React, { useState } from 'react';
import { ActionTooltip } from '../../actions/Actions/ActionTooltip';
import { useDebounceOnBoolean } from '../../hooks/useDebounceOnBoolean';
import { useTranslation } from '../../i18n';
import { type TextMessage } from '../../Message';
import Tooltip from '../../overlays/Tooltip';
import RawButton from '../../semantic/RawButton';
import { stopPropagation } from '../../utils/events';
import { mouseHoverProps } from '../../utils/mouseHoverProps';
import { SvgIcon } from '../../utils/types';

// In milliseconds. The delay before the button shows lets a pointer go across
// the pane without a flash of the button. The delay before it goes lets the
// pointer go from the pane to the button.
const SHOW_DELAY = 500;
const HIDE_DELAY = 400;

// Set `isActive` to false while the pane is closed. A pane (or a button) that
// goes away sends no "leave" event, thus the hook then forgets the pointer.
export function useSashActionReveal(isActive: boolean) {
  const [isPointerInPane, setPointerInPane] = useState(false);
  const [isPointerOnAction, setPointerOnAction] = useState(false);

  if (!isActive && (isPointerInPane || isPointerOnAction)) {
    setPointerInPane(false);
    setPointerOnAction(false);
  }

  const isVisible = useDebounceOnBoolean(
    isActive && (isPointerInPane || isPointerOnAction),
    SHOW_DELAY,
    HIDE_DELAY,
  );

  return {
    isVisible,
    // Put these on the pane
    paneHoverProps: mouseHoverProps(setPointerInPane),
    // Give this to the button, when the button is not in the pane
    onActionHoverChange: setPointerOnAction,
  };
}

type Props = {
  icon: SvgIcon;
  // The accessible name and the tooltip of the button
  label: TextMessage;
  onClick: () => void;
  // Gives the button the state of a toggle that opens and closes a pane
  expandable?: { open: boolean };
  // The id of the action of the registry that the button runs: the tooltip
  // shows its keys
  action?: string;
  // Without revealFrom, the button is on the center of the border and always shows.
  revealFrom?: 'left' | 'right';
  hidden?: boolean;
  onHoverChange?: (isHovered: boolean) => void;
  className?: string;
};

function SashActionButton({
  icon: Icon,
  label,
  onClick,
  expandable,
  action,
  revealFrom,
  hidden = false,
  onHoverChange,
  className,
}: Props) {
  const { tm } = useTranslation();
  const labelText = tm(label);
  const placement =
    revealFrom === 'right' ? 'left' : revealFrom === 'left' ? 'right' : 'top';
  const button = (
    <span className="SplitViewSash__content__button">
      <Icon />
    </span>
  );

  return (
    <RawButton
      className={classNames(
        'SplitViewSash__content',
        revealFrom && `SplitViewSash__content--reveal-from-${revealFrom}`,
        hidden && 'SplitViewSash__content--hidden',
        className,
      )}
      ariaLabel={labelText}
      expandable={expandable}
      // A click on the button must not start a drag of the border that holds it
      onMouseDown={stopPropagation}
      onTouchStart={stopPropagation}
      onPointerDown={stopPropagation}
      onClick={() => onClick()}
      {...(onHoverChange && mouseHoverProps(onHoverChange))}
    >
      {action ? (
        <ActionTooltip action={action} label={labelText} placement={placement}>
          {button}
        </ActionTooltip>
      ) : (
        <Tooltip label={labelText} placement={placement}>
          {button}
        </Tooltip>
      )}
    </RawButton>
  );
}

export default React.memo(SashActionButton);
