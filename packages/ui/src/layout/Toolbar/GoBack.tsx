import React from 'react';
import { Navigation } from '../../../icons/index';
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
};

/** The chevron that goes back, before the title */
function GoBack({
  to,
  onClick,
  ariaLabel = { id: 'toolbar.goBack' },
}: GoBackProps) {
  const { tm } = useTranslation();
  const icon = <Navigation.ChevronLeftIcon />;

  if (to !== undefined) {
    return (
      <Link to={to} className="Toolbar__back" aria-label={tm(ariaLabel)}>
        {icon}
      </Link>
    );
  }

  return (
    <RawButton
      className="Toolbar__back"
      onClick={onClick}
      ariaLabel={ariaLabel}
    >
      {icon}
    </RawButton>
  );
}

export default GoBack;
