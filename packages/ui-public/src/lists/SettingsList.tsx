import classNames from 'classnames';
import React, { type ReactNode } from 'react';
import { useTranslation } from '../i18n';
import { type Message } from '../Message';

export type SettingsListProps = {
  className?: string;
  /** The rows (SettingsList.Row) */
  children: ReactNode;
};

function BaseSettingsList({ className, children }: SettingsListProps) {
  return <ul className={classNames('SettingsList', className)}>{children}</ul>;
}

export type SettingsListRowProps = {
  /** The name of the setting or of the action */
  title: Message;
  /** One short sentence about the setting or about the result of the action */
  description?: Message;
  /**
   * The current value. A long value gets an ellipsis, and a value on more
   * lines (an address) has each line at the right. An action without a value
   * (for example "Log out everywhere") has no value.
   */
  value?: ReactNode;
  /**
   * The control that changes the value or does the action: a `ghost` Button
   * (`ghost-alert` for a destructive action) or a SwitchInput. It is always
   * visible. A row without an action is a fact (for example an ID).
   */
  action?: ReactNode;
};

/** A setting or an action: the text at the left, the value and the control at the right */
function Row({ title, description, value, action }: SettingsListRowProps) {
  const { tc } = useTranslation();
  return (
    <li className="SettingsList__row">
      <div className="SettingsList__text">
        <div className="SettingsList__title">{tc(title)}</div>
        {description && (
          <div className="SettingsList__description">{tc(description)}</div>
        )}
      </div>
      {value && <div className="SettingsList__value">{value}</div>}
      {action && <div className="SettingsList__action">{action}</div>}
    </li>
  );
}

/**
 * The settings of a wide page: one row for each value that the user changes
 * or for each action, with the control always visible at the right. Put it
 * in a Page.Group. For facts to read, use InfoList. For a list of items,
 * use CardList.
 */
const SettingsList = Object.assign(React.memo(BaseSettingsList), {
  Row: React.memo(Row),
});

export default SettingsList;
