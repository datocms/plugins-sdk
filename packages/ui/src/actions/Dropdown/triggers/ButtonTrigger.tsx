import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { useTranslation } from '../../../i18n';
import { type Message, type TextMessage } from '../../../Message';
import { MenuChevron } from '../../../navigation/Chevron';
import Tooltip from '../../../overlays/Tooltip';
import { SvgIcon } from '../../../utils/types';
import { ActionTooltip } from '../../Actions/ActionTooltip';
import {
  type ActionTooltipOptions,
  ButtonSize,
  ButtonTone,
  buttonClassName,
  useButtonSize,
} from '../../Button';
import { type Disabled, disabledReasonOf } from '../../disabledReason';
import DropdownTriggerButton from './DropdownTriggerButton';
import { DropdownTriggerBaseProps } from './types';

/** A label with an optional icon before it, and the chevron of the menu after it */
type WithLabel = {
  /** The text of the button */
  label: Message;
  /** The icon before the label */
  icon?: SvgIcon;
  iconOnly?: false;
};

/**
 * Only the icon, without the chevron. The label is the accessible name of
 * the button, and the tooltip shows it.
 */
type IconOnly = {
  /** The accessible name of the button and the text of its tooltip */
  label: TextMessage;
  icon: SvgIcon;
  /** Shows only the icon */
  iconOnly: true;
};

/** What the button shows */
type ButtonTriggerContent = WithLabel | IconOnly;

export type ButtonTriggerProps = DropdownTriggerBaseProps & {
  /**
   * The look of the button
   * @default "soft"
   */
  tone?: Extract<ButtonTone, 'soft' | 'ghost' | 'primary'>;
  /**
   * The size of the place by default: "milli" in a toolbar, "small" out of
   * a toolbar (see useButtonSize)
   */
  size?: ButtonSize;
  /** The button fills the width of its container */
  expand?: boolean;
  /**
   * The menu cannot open. Give a reason when the user must know why: it
   * takes the place of the tooltip.
   */
  disabled?: Disabled;
  /**
   * The tooltip of the button (the label for an icon-only button), or the
   * name and the keys of an action (see Button). It does not show while the
   * menu is open: the menu is in its place.
   */
  tooltip?: Message | false | null | ActionTooltipOptions;
  /** Only for the place of the button, not for its look */
  className?: string;
} & ButtonTriggerContent;

function isActionTooltip(
  tooltip: Message | false | null | ActionTooltipOptions | undefined,
): tooltip is ActionTooltipOptions {
  return (
    typeof tooltip === 'object' &&
    tooltip !== null &&
    'action' in tooltip &&
    typeof tooltip.action === 'string'
  );
}

/** The trigger of a Dropdown with the look of a Button */
const ButtonTrigger = ({
  open,
  onTrigger,
  tone = 'soft',
  size,
  expand,
  disabled,
  tooltip,
  className,
  label,
  icon: Icon,
  iconOnly,
}: ButtonTriggerProps) => {
  const placeSize = useButtonSize();
  const { tm, tc } = useTranslation();
  const iconOnlyLabel = iconOnly ? tm(label) : undefined;

  const button = (
    <DropdownTriggerButton
      open={open}
      onTrigger={onTrigger}
      className={classNames(
        buttonClassName({ tone, size: size ?? placeSize, iconOnly, expand }),
        className,
      )}
      aria-label={iconOnlyLabel}
      disabled={disabled}
    >
      {Icon && <Icon />}
      {!iconOnly && <span>{tc(label)}</span>}
      {!iconOnly && (
        // On a ghost button there is no surface, thus the chevron has the
        // color of the other menu chevrons
        <MenuChevron />
      )}
    </DropdownTriggerButton>
  );

  // The button shows the reason in a tooltip of its own
  if (disabledReasonOf(disabled) !== undefined) {
    return button;
  }

  if (isActionTooltip(tooltip)) {
    return (
      <ActionTooltip
        action={tooltip.action}
        placement={tooltip.placement}
        label={iconOnlyLabel}
        hidden={open}
      >
        {button}
      </ActionTooltip>
    );
  }

  const tooltipLabel = tooltip ?? iconOnlyLabel;

  if (!tooltipLabel) {
    return button;
  }

  return <Tooltip label={!open && tooltipLabel}>{button}</Tooltip>;
};

export default ButtonTrigger;
