import React from 'react';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';

export type NavProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  'aria-label' | 'aria-labelledby'
> &
  (
    | {
        /**
         * The accessible name of the navigation. A page can have more than
         * one navigation, and a screen reader user needs the name to tell
         * them apart. Write the name of the section, for example "Roles". Do
         * not write the word "navigation": the screen reader says the role
         * itself.
         */
        ariaLabel: TextMessage;
        ariaLabelledBy?: never;
      }
    | {
        /** The id of a visible element (a heading) that gives the name */
        ariaLabelledBy: string;
        ariaLabel?: never;
      }
  );

/**
 * A list of links that go to other places of the app: a landmark of the
 * page. Do not use it for a list of controls that change the content of the
 * same place (use Tabs).
 */
const Nav = React.forwardRef<HTMLElement, NavProps>(function Nav(
  { ariaLabel, ariaLabelledBy, ...props },
  ref,
) {
  const { tm } = useTranslation();
  return (
    <nav
      {...props}
      aria-label={ariaLabel === undefined ? undefined : tm(ariaLabel)}
      aria-labelledby={ariaLabelledBy || undefined}
      ref={ref}
    />
  );
});

export default Nav;
