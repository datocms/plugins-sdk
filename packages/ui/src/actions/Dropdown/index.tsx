import mergeRefs from '@react-hook/merged-ref';
import classNames from 'classnames';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useAutoincrementIntegerId } from '../../hooks/useAutoincrementIntegerId';
import { useClickOutside } from '../../hooks/useClickOutside';
import DropdownContext from './DropdownContext';
import Footer from './Footer';
import Group from './Group';
import Menu from './Menu';
import { useMenuSearchTerm } from './MenuContext';
import {
  MenuContainer,
  MenuEmpty,
  MenuGroup,
  MenuItem,
  MenuPanel,
} from './MenuParts';
import { useIsMenuSheet } from './MenuSheet';
import Option from './Option';
import OptionAction from './OptionAction';
import Separator from './Separator';
import Submenu from './Submenu';
import Text from './Text';
import ButtonTrigger from './triggers/ButtonTrigger';
import IconTrigger from './triggers/IconTrigger';
import PillTrigger from './triggers/PillTrigger';
import TextualTrigger from './triggers/TextualTrigger';
import { useCloseMenu } from './useCloseMenu';
import { useDropdownRegistry } from './useDropdownRegistry';

type AbstractTriggerComponentProps = {
  open: boolean;
  onTrigger: (event: React.SyntheticEvent) => void;
};

/**
 * Lets the parent open the menu from code (for example, with a keyboard
 * shortcut)
 */
export type DropdownHandle = {
  open: () => void;
};

/**
 * P is the props of the trigger component. The Dropdown gives "open" and
 * "onTrigger", and the parent gives all the other props.
 */
type PropTypes<P extends AbstractTriggerComponentProps> = {
  /** The button that opens the menu (see the Dropdown triggers) */
  triggerComponent: React.ComponentType<P>;
  /**
   * A Dropdown.Menu. Give a function when the menu is expensive to make:
   * it runs only when the menu opens.
   */
  children: ReactElement | (() => ReactElement);
  /** Only for the place of the dropdown, not for its look */
  className?: string;
  /** Lets the parent open the menu from code (see DropdownHandle) */
  controlRef?: React.Ref<DropdownHandle>;
} & Omit<P, 'open' | 'onTrigger'>;

/**
 * A button that opens a menu. The props that are not in this list go to the
 * trigger component. The menu is a Dropdown.Menu: it renders only while it
 * is open.
 */
const DropdownRoot = React.forwardRef<HTMLDivElement, PropTypes<any>>(
  (
    { triggerComponent, children, className, controlRef, ...triggerProps },
    ref,
  ) => {
    const isMenuSheet = useIsMenuSheet();
    const [isClickOutsideEnabled, setIsClickOutsideEnabled] = useState(
      !isMenuSheet,
    );
    const [isOpen, setOpen] = useState(false);
    const [isClosing, setClosing] = useState(false);

    const isOpenRef = useRef(isOpen);
    isOpenRef.current = isOpen;

    // When the menu closes, it stays on the page for the duration of its
    // exit animation.
    const changeOpen = useCallback(
      (open: boolean) => {
        const animate =
          !open &&
          isOpenRef.current &&
          !isMenuSheet &&
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        setClosing(animate);
        setOpen(open);
      },
      [isMenuSheet],
    );

    useEffect(() => {
      if (!isClosing) {
        return;
      }

      // The duration of the exit animation in _Dropdown.css
      const timeout = window.setTimeout(() => setClosing(false), 100);

      return () => window.clearTimeout(timeout);
    }, [isClosing]);

    const uid = useAutoincrementIntegerId();
    const triggerId = `dropdown-trigger-${uid}`;
    const menuId = `dropdown-menu-${uid}`;

    const handleClickOutside = useCallback(
      (event: MouseEvent | TouchEvent) => {
        if (isMenuSheet) {
          return;
        }

        if (
          isClickOutsideEnabled &&
          event.target instanceof Element &&
          !event.target.closest('.Dropdown__menu') &&
          isOpen
        ) {
          changeOpen(false);
        }
      },
      [changeOpen, isOpen, isClickOutsideEnabled, isMenuSheet],
    );

    const outsideRef = useClickOutside<HTMLDivElement>(handleClickOutside);
    const rootRef = useRef<HTMLDivElement>(null);
    const mergedRef = mergeRefs(outsideRef, ref, rootRef);

    const handleClose = useCallback(() => {
      changeOpen(false);
    }, [changeOpen]);

    useDropdownRegistry(handleClose, isOpen);

    useImperativeHandle(controlRef, () => ({ open: () => changeOpen(true) }), [
      changeOpen,
    ]);

    const handleToggle = useCallback(
      (e: React.SyntheticEvent) => {
        e.stopPropagation();
        e.preventDefault();

        changeOpen(!isOpenRef.current);
      },
      [changeOpen],
    );

    const setCloseOnClickOutside = useCallback(setIsClickOutsideEnabled, []);

    const Trigger = (triggerComponent || ButtonTrigger) as any;

    return (
      <DropdownContext.Provider
        value={{
          closeMenu: handleClose,
          setCloseOnClickOutside,
          isClosing,
          triggerId,
          menuId,
          rootRef,
        }}
      >
        <div
          className={classNames('Dropdown', className, {
            'is-open': isOpen || isClosing,
          })}
          ref={mergedRef}
        >
          <Trigger
            {...triggerProps}
            id={triggerId}
            aria-controls={menuId}
            open={isOpen}
            onTrigger={handleToggle}
          />
          {(isOpen || isClosing) &&
            (typeof children === 'function' ? children() : children)}
        </div>
      </DropdownContext.Provider>
    );
  },
) as <P extends AbstractTriggerComponentProps>(
  props: PropTypes<P>,
) => ReactElement;

export const Dropdown = Object.assign(DropdownRoot, {
  ButtonTrigger,
  Footer,
  Group,
  IconTrigger,
  Menu,
  MenuContainer,
  MenuEmpty,
  MenuGroup,
  MenuItem,
  MenuPanel,
  Option,
  OptionAction,
  PillTrigger,
  Separator,
  Submenu,
  Text,
  TextualTrigger,
});

export { useCloseMenu, useMenuSearchTerm };
