import useMergedRef from '@react-hook/merged-ref';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';

/**
 * The name of the button, when its content does not give one (for example a
 * button with only an icon). Give one of the two, or none when the text of
 * the button is the name.
 */
type RawButtonName =
  | {
      /**
       * The accessible name. When the button shows text, the name must start
       * with that text (WCAG 2.5.3).
       */
      ariaLabel?: TextMessage;
      ariaLabelledBy?: never;
    }
  | {
      /** The ids of the visible elements that give the name, with a space between them */
      ariaLabelledBy?: string;
      ariaLabel?: never;
    };

/**
 * What the button tells about itself. A button is a toggle (`pressed`), it
 * opens and closes other content (`expandable`), it is a tab of a tablist
 * (`tab`), or it is an option of a radio group (`radio`). It is only one of
 * them.
 */
type RawButtonState =
  | {
      /** A toggle button. True when the toggle is on. */
      pressed?: boolean;
      expandable?: never;
      tab?: never;
      radio?: never;
    }
  | {
      /** The button opens and closes other content */
      expandable?: {
        /** True when the content shows */
        open: boolean;
        /** The id of the content that the button opens and closes */
        controls?: string;
      };
      pressed?: never;
      tab?: never;
      radio?: never;
    }
  | {
      /** The button is a tab of a tablist */
      tab: {
        /** True for the tab that shows its panel */
        selected: boolean;
        /** The id of the panel that the tab shows */
        controls?: string;
      };
      pressed?: never;
      expandable?: never;
      radio?: never;
    }
  | {
      /** The button is an option of a radio group */
      radio: {
        /** True for the option that is on */
        checked: boolean;
      };
      pressed?: never;
      expandable?: never;
      tab?: never;
    };

export type RawButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'disabled'
> &
  RawButtonName &
  RawButtonState & {
    /** The button submits its form. Without it, the button never submits. */
    submit?: true;
    /**
     * `true` disables the button and removes it from the Tab order.
     * `'focusable'` keeps the button in the Tab order and tells a screen
     * reader that it is disabled (`aria-disabled`). The click does nothing.
     * Use it when the user must find out why the button is disabled.
     */
    disabled?: boolean | 'focusable';
    /** The kind of popup that the button opens */
    haspopup?: 'menu' | 'listbox' | 'dialog';
    /** The button is the current element of a set of elements */
    current?: 'page' | 'true';
    /** The same as `aria-hidden` */
    ariaHidden?: React.AriaAttributes['aria-hidden'];
  };

// True when a screen reader finds a name for the button
function hasAccessibleName(button: HTMLButtonElement) {
  if (button.getAttribute('aria-label')) {
    return true;
  }

  const labelledBy = button.getAttribute('aria-labelledby');

  if (
    labelledBy
      ?.split(' ')
      .some((id) => document.getElementById(id)?.textContent?.trim())
  ) {
    return true;
  }

  return Boolean(
    button.textContent?.trim() ||
      button.title ||
      button.querySelector('img[alt]:not([alt=""])'),
  );
}

// A hidden button is not in the accessibility tree, thus it needs no name
function isHidden(button: HTMLButtonElement) {
  return (
    Boolean(button.closest('[aria-hidden="true"]')) ||
    getComputedStyle(button).visibility === 'hidden'
  );
}

/**
 * A button without a look. The caller draws it with a class. It sets the
 * parts of a button that the keyboard and the screen reader need: the type,
 * the name, the state and the disabled mode.
 *
 * Use `Button` for a button with the standard look. Run the action on
 * `onClick`, not on mouse down, so the user can cancel a click (WCAG 2.5.2).
 * In development, a button with no name logs a warning with the element.
 */
const RawButton = React.forwardRef<HTMLButtonElement, RawButtonProps>(
  function RawButton(
    {
      submit,
      disabled,
      ariaLabel,
      ariaLabelledBy,
      pressed,
      expandable,
      tab,
      radio,
      haspopup,
      current,
      ariaHidden,
      onClick,
      ...props
    },
    ref,
  ) {
    const { tm } = useTranslation();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const mergedRef = useMergedRef(ref, buttonRef);
    const warned = useRef(false);

    // It finds a button with no name. It cannot tell if a text is right for
    // the button.
    useEffect(() => {
      const button = buttonRef.current;

      if (!import.meta.env.DEV || warned.current || !button) {
        return;
      }

      if (!isHidden(button) && !hasAccessibleName(button)) {
        warned.current = true;
        console.warn(
          'RawButton has no name: give it text, ariaLabel or ariaLabelledBy',
          button,
        );
      }
    });

    return (
      <button
        // These come before the props: an ARIA attribute written by hand wins
        role={tab ? 'tab' : radio ? 'radio' : undefined}
        aria-disabled={disabled === 'focusable' || undefined}
        aria-label={ariaLabel === undefined ? undefined : tm(ariaLabel)}
        aria-labelledby={ariaLabelledBy || undefined}
        aria-pressed={pressed}
        aria-expanded={expandable?.open}
        aria-selected={tab?.selected}
        aria-checked={radio?.checked}
        aria-controls={expandable?.controls || tab?.controls}
        aria-haspopup={haspopup}
        aria-current={current}
        aria-hidden={ariaHidden}
        {...props}
        ref={mergedRef}
        // A disabled button never submits, also when it stays in the Tab order
        type={submit && !disabled ? 'submit' : 'button'}
        disabled={disabled === true}
        // The attribute aria-disabled does not stop a click
        onClick={disabled ? undefined : onClick}
      />
    );
  },
);

export default RawButton;
