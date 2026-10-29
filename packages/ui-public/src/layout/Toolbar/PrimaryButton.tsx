import React from 'react';
import Button, { ButtonSize, useButtonSize } from '../../actions/Button';
import { Dropdown } from '../../actions/Dropdown';
import SplitButton from '../../actions/SplitButton';
import { useTranslation } from '../../i18n';
import { type TextMessage } from '../../Message';
import { useNavigation } from '../../navigation/NavigationProvider';
import { SvgIcon } from '../../utils/types';

/** An action that opens a page of the app */
type LinkActionItem = {
  /** A page of the app that the action opens */
  to: string;
  onPick?: never;
};

/** An action that runs a function */
type PickActionItem = {
  to?: never;
  /** Runs when the user picks the action */
  onPick: () => void;
};

/** One action of a PrimaryButton */
export type ActionItem = (LinkActionItem | PickActionItem) & {
  /** The text of the action */
  label: TextMessage;
  /** The icon of the action */
  icon?: SvgIcon;
};

export type PrimaryButtonProps = {
  /**
   * The first action is the main button. The other actions go in the menu
   * of a caret next to it (a split button).
   */
  actions: ActionItem[];
  /** The button, the caret and the actions of the menu are disabled */
  disabled?: boolean;
  /**
   * The id of the action of the main button: its name and its keys show in
   * the tooltip (see the "action" tooltip of Button)
   */
  action?: string;
  /**
   * Shows only the icon of the main action. The label is then the
   * accessible name of the button.
   */
  iconOnly?: boolean;
  /**
   * The size of the button. The default is the size of the place: "milli"
   * in a toolbar, "small" out of a toolbar.
   */
  size?: ButtonSize;
};

/**
 * The primary button of a toolbar, with an optional menu of other actions
 * of the same kind (a split button)
 */

const PrimaryButton = React.memo(
  React.forwardRef<HTMLElement, PrimaryButtonProps>(function PrimaryButton(
    { actions, disabled, action: actionId, iconOnly, size: sizeProp },
    ref,
  ) {
    const { tc } = useTranslation();
    const { navigate } = useNavigation();
    const defaultSize = useButtonSize();
    const size = sizeProp ?? defaultSize;

    if (actions.length === 0) return null;

    const [{ to, label, icon: Icon, onPick }, ...rest] = actions;

    const action = onPick ? { onClick: onPick } : to ? { to } : {};
    const tooltip = actionId ? { action: actionId } : undefined;
    const content =
      iconOnly && Icon
        ? { label, icon: Icon, iconOnly: true as const }
        : { label, icon: Icon };

    if (rest.length === 0) {
      return (
        <Button
          ref={ref}
          tone="primary"
          size={size}
          disabled={disabled}
          tooltip={tooltip}
          {...content}
          {...action}
        />
      );
    }

    return (
      <SplitButton
        ref={ref as React.Ref<HTMLDivElement>}
        tone="primary"
        size={size}
        disabled={disabled}
        tooltip={tooltip}
        menu={{ disabled }}
        {...content}
        {...action}
      >
        {rest.map(({ to, label, icon: Icon, onPick }) => (
          <Dropdown.Option
            key={typeof label === 'string' ? label : label.id}
            disabled={disabled}
            onPick={onPick ? onPick : to ? () => navigate(to) : undefined}
            icon={Icon && <Icon />}
          >
            {tc(label)}
          </Dropdown.Option>
        ))}
      </SplitButton>
    );
  }),
);

export default PrimaryButton;
