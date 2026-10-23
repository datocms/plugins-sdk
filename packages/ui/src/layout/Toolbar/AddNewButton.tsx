import React, { useContext, useMemo } from 'react';
import { Generic } from '../../../icons/index';
import { useTranslation } from '../../i18n';
import { type TextMessage } from '../../Message';
import { SvgIcon } from '../../utils/types';
import { useIsInSecondaryPane } from '../SplitPane';
import { InToolbarContext } from './context';
import PrimaryButton from './PrimaryButton';

type ExtraAction = {
  /** The text of the action */
  label: TextMessage;
  /** The full URL of the page (the app adds its prefixes) */
  to: string;
  /** The icon of the action */
  icon?: SvgIcon;
};

export type AddNewButtonProps = {
  /** The text of the button ("Add new webhook") */
  label: TextMessage;
  /**
   * The full URL of the page of the new item (the app adds its prefixes,
   * for example the environment)
   */
  to: string;
  /** The button cannot add */
  disabled?: boolean;
  /**
   * The icon of the main action. The default is the "add" icon (a bolder
   * version when the button shows only the icon).
   */
  icon?: SvgIcon;
  /** Other "add" actions. They show in a menu next to the button. */
  extraActions?: ExtraAction[];
  /**
   * The id of the action of the button: its name and its keys show in the
   * tooltip (see the "action" tooltip of Button)
   */
  action?: string;
};

/**
 * The PrimaryButton that adds an item to a list. In the toolbar of a
 * secondary pane, it shows only its icon.
 */
function AddNewButton({
  label,
  to,
  disabled,
  icon: customIcon,
  extraActions,
  action,
}: AddNewButtonProps) {
  const { tm } = useTranslation();
  // The toolbar of a secondary pane is narrow. A long label there hides the
  // title.
  const isInSecondaryPane = useIsInSecondaryPane();
  const iconOnly = useContext(InToolbarContext) && isInSecondaryPane;
  const icon = customIcon ?? Generic.AddIcon;
  const labelText = tm(label);

  const actions = useMemo(
    () => [
      { to, label: labelText, icon },
      ...(extraActions || []).map((action) => ({
        to: action.to,
        label: tm(action.label),
        icon: action.icon,
      })),
    ],
    [to, labelText, icon, extraActions, tm],
  );

  return (
    <PrimaryButton
      disabled={disabled}
      actions={actions}
      action={action}
      iconOnly={iconOnly}
    />
  );
}

export default React.memo(AddNewButton);
