import {
  autoUpdate,
  flip,
  offset,
  safePolygon,
  size,
  useFloating,
  useHover,
  useInteractions,
} from '@floating-ui/react';
import classNames from 'classnames';
import React, { ReactNode, useContext, useState } from 'react';
import NewZIndex from '../../overlays/NewZIndex';
import Portal from '../../overlays/Portal';
import DropdownContext from './DropdownContext';
import Menu from './Menu';
import MenuContent from './MenuContent';
import { useIsMenuSheet } from './MenuSheet';
import Option from './Option';
import { placementStyle } from './placementStyle';

export type SubmenuProps = {
  /** The label of the option that opens the submenu */
  triggerContent: ReactNode;
  /** The icon of the option that opens the submenu */
  triggerIcon?: ReactNode;
  /** The options of the submenu */
  children: ReactNode;
  /** The option cannot open the submenu */
  disabled?: boolean;
};

/**
 * An option that opens a second menu at its side, on hover. On a small
 * screen, a tap opens the second menu.
 */
export default function Submenu({
  children,
  triggerContent,
  triggerIcon,
  disabled = false,
}: SubmenuProps) {
  const isMobile = useIsMenuSheet();
  const [isOpenOnMobile, setIsOpenOnMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { isClosing } = useContext(DropdownContext);

  const {
    refs,
    floatingStyles,
    context,
    placement: finalPlacement,
  } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'right-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      // The submenu touches the trigger option, so it covers the padding and
      // the border of the parent menu. It goes up by the same 5px, so its
      // first option is at the same level as the trigger option.
      offset({ mainAxis: 0, crossAxis: -5 }),
      flip(),
      size({
        padding: 30,
        apply({ availableHeight, elements }) {
          elements.floating.style.setProperty(
            '--maxHeight',
            `${Math.max(0, availableHeight)}px`,
          );
        },
      }),
    ],
  });

  const hover = useHover(context, {
    enabled: !isMobile && !disabled,
    delay: { open: 100 },
    handleClose: safePolygon({
      requireIntent: false,
      blockPointerEvents: true,
      buffer: 5,
    }),
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  const { style: placementVars, ...placementAttributes } =
    placementStyle(finalPlacement);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={refs.setReference} {...getReferenceProps()}>
        <Option
          closeMenuOnClick={false}
          disabled={disabled}
          icon={triggerIcon}
          submenu={{ open: isMobile ? isOpenOnMobile : isOpen }}
          {...(isMobile
            ? { onPick: () => setIsOpenOnMobile(true) }
            : { forceHover: isOpen })}
        >
          {triggerContent}
        </Option>
      </div>

      {!isMobile && isOpen && !disabled && (
        <Portal>
          <NewZIndex>
            {(zIndex) => (
              <div
                ref={refs.setFloating}
                className={classNames(
                  'Dropdown__menu-container',
                  isClosing && 'is-closing',
                )}
                style={{ ...floatingStyles, ...placementVars, zIndex }}
                {...placementAttributes}
                {...getFloatingProps()}
              >
                <MenuContent>{children}</MenuContent>
              </div>
            )}
          </NewZIndex>
        </Portal>
      )}

      {isMobile && isOpenOnMobile && !disabled && (
        <Menu placement="right-start" offset={{ mainAxis: 0, crossAxis: -5 }}>
          {children}
        </Menu>
      )}
    </div>
  );
}
