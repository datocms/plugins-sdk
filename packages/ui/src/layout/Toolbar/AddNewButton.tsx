import React, { useCallback, useContext, useMemo } from 'react';
import { Generic } from '../../../icons/index';
import { HotKeyListener } from '../../actions/HotKey';
import { useTranslation } from '../../i18n';
import { type TextMessage } from '../../Message';
import { useNavigation } from '../../navigation/NavigationProvider';
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
   * The description of the hotkey. The default is the label. Give a
   * different text when the label has placeholders.
   */
  hotKeyDescription?: TextMessage;
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
};

/**
 * The PrimaryButton that adds an item to a list, with the hotkey ⌘⇧N. In
 * the toolbar of a secondary pane, it shows only its icon.
 */

const HOT_KEY = 'mod+shift+n';

function AddNewButton({
  label,
  hotKeyDescription,
  to,
  disabled,
  icon: customIcon,
  extraActions,
}: AddNewButtonProps) {
  const { tm } = useTranslation();
  const { navigate } = useNavigation();
  // The toolbar of a secondary pane is narrow. A long label there hides the
  // title.
  const isInSecondaryPane = useIsInSecondaryPane();
  const iconOnly = useContext(InToolbarContext) && isInSecondaryPane;
  const icon = customIcon ?? Generic.AddIcon;
  const labelText = tm(label);

  const handleAdd = useCallback(() => {
    navigate(to);
  }, [navigate, to]);

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
    <HotKeyListener
      hotKey={HOT_KEY}
      description={hotKeyDescription ?? label}
      enabled={!disabled}
      trigger={handleAdd}
    >
      <PrimaryButton
        disabled={disabled}
        actions={actions}
        hotKey={true}
        iconOnly={iconOnly}
      />
    </HotKeyListener>
  );
}

export default React.memo(AddNewButton);
