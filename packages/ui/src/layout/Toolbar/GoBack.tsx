import React from 'react';
import { Navigation } from '../../../icons/index';
import { ActionTooltip } from '../../actions/Actions/ActionTooltip';
import { useTranslation } from '../../i18n';
import { type TextMessage } from '../../Message';
import Link from '../../navigation/Link';
import RawButton from '../../semantic/RawButton';

/** A chevron that opens the parent page. It is a link. */
type GoBackLink = {
  /** The URL of the parent page, for example the collection of a record */
  to: string;
  onClick?: never;
};

/**
 * A chevron that runs an action, for example to close a panel. It is a
 * button.
 */
type GoBackButton = {
  to?: never;
  /** Runs when the user clicks the chevron */
  onClick: () => void;
};

export type GoBackProps = (GoBackLink | GoBackButton) & {
  /**
   * The name of the chevron for screen readers
   * @default { id: 'toolbar.goBack' } ("Go back to the collection")
   */
  ariaLabel?: TextMessage;
  /**
   * The id of the action of the registry that goes back: a tooltip shows
   * the name of the chevron and the keys of the action
   */
  action?: string;
};

/** The chevron that goes back, before the title */
function GoBack({
  to,
  onClick,
  ariaLabel = { id: 'toolbar.goBack' },
  action,
}: GoBackProps) {
  const { tm } = useTranslation();
  const icon = <Navigation.ChevronLeftIcon />;

  const chevron =
    to !== undefined ? (
      <Link to={to} className="Toolbar__back" aria-label={tm(ariaLabel)}>
        {icon}
      </Link>
    ) : (
      <RawButton
        className="Toolbar__back"
        onClick={onClick}
        ariaLabel={ariaLabel}
      >
        {icon}
      </RawButton>
    );

  if (!action) return chevron;

  return (
    <ActionTooltip action={action} label={ariaLabel} placement="bottom">
      {chevron}
    </ActionTooltip>
  );
}

export default GoBack;
