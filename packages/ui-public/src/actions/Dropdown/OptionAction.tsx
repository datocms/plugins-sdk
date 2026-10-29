import React from 'react';
import { useTranslation } from '../../i18n';
import { type TextMessage } from '../../Message';
import Tooltip from '../../overlays/Tooltip';
import RawButton from '../../semantic/RawButton';
import { SvgIcon } from '../../utils/types';
import DropdownContext from './DropdownContext';

export type OptionActionProps = {
  /** The icon of the button */
  icon: SvgIcon;
  /** Marks a destructive choice, for example a delete. The icon shows in red. */
  alert?: boolean;
  /** Runs when the user clicks the button */
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  /**
   * Give "false" when the menu must stay open after the click
   * @default true
   */
  closeMenuOnClick?: boolean;
  /** The tooltip and the accessible name of the icon button */
  label: TextMessage;
};

/**
 * An icon button at the end of an option (for example the pen that edits a
 * saved view). Give it to the "actions" prop of Dropdown.Option.
 */
const OptionAction = ({
  icon: Icon,
  alert,
  onClick,
  closeMenuOnClick,
  label,
}: OptionActionProps) => {
  const { tm } = useTranslation();
  const labelText = tm(label);

  return (
    <DropdownContext.Consumer>
      {(context) => (
        <Tooltip label={labelText}>
          <RawButton
            className={[
              'Dropdown__menu__option__icon',
              alert && 'Dropdown__menu__option__icon--delete',
            ]
              .filter((x) => x)
              .join(' ')}
            ariaLabel={labelText}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (closeMenuOnClick ?? true) {
                context.closeMenu();
              }
              onClick(e);
            }}
          >
            <Icon />
          </RawButton>
        </Tooltip>
      )}
    </DropdownContext.Consumer>
  );
};

export default OptionAction;
