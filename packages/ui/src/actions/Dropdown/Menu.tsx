import {
  autoUpdate,
  flip,
  OffsetOptions,
  offset,
  Placement,
  size,
  useFloating,
} from '@floating-ui/react-dom';
import mergeRefs from '@react-hook/merged-ref';
import classNames from 'classnames';
import { useTranslation } from '../../i18n';
import NewZIndex from '../../overlays/NewZIndex';
import Portal from '../../overlays/Portal';
import DropdownContext from './DropdownContext';
import 'intersection-observer';
import React, { useContext } from 'react';
import MenuContent, { type ContextualSearch } from './MenuContent';
import { MenuContainer, MenuPanel } from './MenuParts';
import { useIsMenuSheet } from './MenuSheet';
import Option from './Option';
import { placementStyle } from './placementStyle';
import { useTriggerLang } from './useTriggerLang';

const MenuMobileContainer = ({
  children,
  onClickOutside,
}: {
  children: React.ReactNode;
  onClickOutside: () => void;
}) => (
  <Portal>
    <NewZIndex>
      {(zIndex) => (
        <div
          className="Dropdown__menu__mobile-container"
          style={{ zIndex }}
          onClick={onClickOutside}
        >
          <div className="Dropdown__menu__mobile-backdrop" />
          {children}
        </div>
      )}
    </NewZIndex>
  </Portal>
);

const MenuDesktopContainer = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    style: React.CSSProperties;
    className?: string;
    onClickOutside: () => void;
  }
>(
  (
    { children, style, className, onClickOutside: _onClickOutside, ...other },
    ref,
  ) => {
    return (
      <Portal>
        <NewZIndex>
          {(zIndex) => (
            <MenuContainer
              {...other}
              className={className}
              style={{ ...style, zIndex }}
              ref={ref}
            >
              {children}
            </MenuContainer>
          )}
        </NewZIndex>
      </Portal>
    );
  },
);

export type MenuProps = {
  /** The options, groups, separators and texts of the menu */
  children: React.ReactNode;
  /**
   * The side of the trigger where the menu opens. When there is no space
   * there, the menu goes to the other side. Use "bottom-end" for a trigger
   * at the right of its place (the "⋮" of a row).
   * @default "bottom-start"
   */
  placement?: Placement;
  /**
   * The menu does not clip its content. Give it when the content has its
   * own popup (for example a date picker).
   */
  noOverflowHidden?: boolean;
  /**
   * A search field at the top of the menu. With "auto", it shows when the
   * menu has more than 5 options. With "{ placeholder }", it always shows,
   * with that text in place of "Search...".
   * @default "auto"
   */
  contextualSearch?: ContextualSearch;
  /** The minimum width of the menu, in pixels */
  minWidth?: number;
  /**
   * The vertical padding of the options, in pixels. Give it to a menu of
   * options on two lines (an entity row with a title and details).
   */
  optionPaddingY?: number;
  /**
   * The distance between the trigger and the menu
   * @default { mainAxis: 4 }
   */
  offset?: OffsetOptions;
};

/**
 * The floating menu of a Dropdown. It closes with Escape, Tab and a click
 * out of it. The arrow keys move the highlight, and Enter picks the option.
 * On a small screen, the menu is a sheet at the bottom of the screen.
 */

const Menu = React.forwardRef<HTMLDivElement, MenuProps>(
  (
    {
      children,
      placement = 'bottom-start',
      noOverflowHidden,
      minWidth,
      optionPaddingY,
      contextualSearch = 'auto',
      offset: offsetOptions = { mainAxis: 4 },
    },
    ref,
  ) => {
    const { closeMenu, isClosing } = useContext(DropdownContext);
    const { t } = useTranslation();
    const detectedLocale = useTriggerLang();

    const isMobile = useIsMenuSheet();

    const Wrapper = isMobile ? MenuMobileContainer : MenuDesktopContainer;

    const {
      refs,
      floatingStyles,
      placement: finalPlacement,
    } = useFloating({
      placement,
      whileElementsMounted: autoUpdate,
      middleware: [
        offset(offsetOptions),
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

    const { style: placementVars, ...placementAttributes } =
      placementStyle(finalPlacement);

    return (
      <>
        <div ref={refs.setReference} className="Dropdown__spacer" />
        <Wrapper
          ref={ref ? mergeRefs(ref, refs.setFloating) : refs.setFloating}
          style={{ ...floatingStyles, ...placementVars }}
          className={classNames(isClosing && 'is-closing')}
          onClickOutside={() => {
            closeMenu();
          }}
          {...placementAttributes}
        >
          <div
            lang={detectedLocale}
            className={classNames(isMobile && 'Dropdown__menu__mobile-content')}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MenuContent
              isRoot
              title={isMobile ? { id: 'dropdown.selectOption' } : undefined}
              noOverflowHidden={noOverflowHidden}
              contextualSearch={contextualSearch}
              minWidth={isMobile ? undefined : minWidth}
              optionPaddingY={optionPaddingY}
            >
              {children}
            </MenuContent>
            {isMobile ? (
              <MenuPanel>
                <Option closeMenuOnClick={true} onPick={() => {}}>
                  <span>{t('modal.close')}</span>
                </Option>
              </MenuPanel>
            ) : null}
          </div>
        </Wrapper>
      </>
    );
  },
);

export default Menu;
