import type { Placement } from '@floating-ui/react';
import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { type TextMessage } from '../../Message';
import Button, {
  ButtonAction,
  ButtonContent,
  ButtonProps,
  ButtonSize,
  ButtonTone,
  useButtonSize,
} from '../Button';
import { Dropdown } from '../Dropdown';
import { type Disabled } from '../disabledReason';
import Caret from './Caret';

/** The caret and the menu of the other actions */
export type SplitButtonMenu = {
  /**
   * The accessible name of the caret. Tell what the menu has, for example
   * "More publishing options".
   * @default "More actions"
   */
  ariaLabel?: TextMessage;
  /**
   * The side of the caret where the menu opens
   * @default "bottom-end"
   */
  placement?: Placement;
  /**
   * The caret cannot open the menu. Give a reason when the user must know
   * why.
   */
  disabled?: Disabled;
};

export type SplitButtonProps = {
  /**
   * The look of the two halves
   * @default "soft"
   */
  tone?: Extract<ButtonTone, 'primary' | 'soft'>;
  /**
   * The size of the two halves. The size of the place by default: "milli"
   * in a toolbar, "small" out of a toolbar (see useButtonSize).
   */
  size?: ButtonSize;
  /**
   * The main half is disabled. The caret stays usable: set "menu.disabled"
   * to disable it too. Give a reason when the user must know why.
   */
  disabled?: ButtonProps['disabled'];
  /** Only for the place of the split button, not for its look */
  className?: string;
  /** The caret and its menu */
  menu?: SplitButtonMenu;
  /**
   * The content of the menu: Dropdown.Option, Dropdown.Separator and the
   * other parts of a Dropdown.Menu
   */
  children: ReactNode;
} & ButtonContent &
  ButtonAction;

/**
 * The main action and a caret with a menu of the other variants of the same
 * action. Without other variants, render a Button.
 */
const SplitButton = React.forwardRef<HTMLDivElement, SplitButtonProps>(
  function SplitButton(
    { tone = 'soft', size: sizeProp, className, menu, children, ...main },
    ref,
  ) {
    const placeSize = useButtonSize();
    const size = sizeProp ?? placeSize;

    return (
      <div ref={ref} className={classNames('button--container', className)}>
        <Button
          {...(main as ButtonProps)}
          tone={tone}
          size={size}
          className="button--sub"
        />
        <Dropdown
          triggerComponent={Caret}
          tone={tone}
          size={size}
          ariaLabel={menu?.ariaLabel ?? { id: 'splitButton.moreActions' }}
          disabled={menu?.disabled}
        >
          <Dropdown.Menu placement={menu?.placement ?? 'bottom-end'}>
            {children}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  },
);

export default React.memo(SplitButton);
