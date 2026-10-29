import classNames from 'classnames';
import React from 'react';

export type FooterProps = {
  /**
   * "buttons" is for the buttons that act on the options (for example "Add
   * 3 locales"). "options" is for Dropdown.Options, for example "Create new
   * organization…": they look like the options of the menu, as the actions
   * in the footer of a SelectInput.
   * @default "buttons"
   */
  variant?: 'buttons' | 'options';
  /** The buttons or the options */
  children: React.ReactNode;
};

/** The bottom area of a menu. It stays visible when the options scroll. */
const Footer = ({ variant = 'buttons', children }: FooterProps) => {
  return (
    <div
      className={classNames('Dropdown__menu__footer', {
        'Dropdown__menu__footer--options': variant === 'options',
      })}
    >
      {children}
    </div>
  );
};

export default React.memo(Footer);
