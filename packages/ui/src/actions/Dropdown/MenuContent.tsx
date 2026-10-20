import classNames from 'classnames';
import { isHotkey } from 'is-hotkey-esm';
import React, {
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Generic } from '../../../icons/index';
import { useTranslation } from '../../i18n';
import { type Message, type TextMessage } from '../../Message';
import DropdownContext from './DropdownContext';
import MenuContext from './MenuContext';
import { MenuPanel } from './MenuParts';
import { useTriggerLang } from './useTriggerLang';

/**
 * The search field of a menu: "auto" shows it when the menu has more than
 * 5 options, "true" always shows it, and "{ placeholder }" always shows it
 * with that text.
 */
export type ContextualSearch = 'auto' | boolean | { placeholder: TextMessage };

type Props = {
  children: React.ReactNode;
  noOverflowHidden?: boolean;
  contextualSearch?: ContextualSearch;
  minWidth?: number;
  optionPaddingY?: number;
  // True for the main menu of a dropdown, false for a submenu. Only the main
  // menu gets the ID that the trigger refers to and gets the focus on open.
  isRoot?: boolean;
  // A title at the top of the panel (the menu on a small screen)
  title?: Message;
};

export default function MenuContent({
  children,
  noOverflowHidden,
  contextualSearch = 'auto',
  minWidth,
  optionPaddingY,
  isRoot = false,
  title,
}: Props) {
  const { t, tm, tc } = useTranslation();
  const { closeMenu, triggerId, menuId } = useContext(DropdownContext);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [options, setOptions] = useState<
    { id: string; handler?: (e: SyntheticEvent) => void }[]
  >([]);

  const menuRef = useRef<HTMLDivElement>(null);

  // While the search field has a term, the menu keeps its size from before the
  // search. If the list becomes shorter, the menu does not move (for example,
  // a menu above its trigger does not go below it) and the pointer stays on
  // the menu, so a submenu does not close.
  const [sizeBeforeSearch, setSizeBeforeSearch] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;

    if (value && menuRef.current) {
      // The computed size, as "min-width" and "min-height" use it (without
      // the padding and the border of the menu)
      const { width, height } = window.getComputedStyle(menuRef.current);
      const size = { width: parseFloat(width), height: parseFloat(height) };
      setSizeBeforeSearch((old) => old ?? size);
    } else if (!value) {
      setSizeBeforeSearch(null);
    }

    setSearchTerm(value);
  }, []);

  const addOption = useCallback(
    (id: string) => {
      setOptions((old) => [...old, { id }]);
      return () => setOptions((old) => old.filter((x) => x.id !== id));
    },
    [setOptions],
  );

  const setClickHandlerForOption = useCallback(
    (
      id: string,
      handler: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    ) => {
      setOptions((old) =>
        old.map((x) =>
          x.id !== id
            ? x
            : {
                ...x,
                handler: (e: SyntheticEvent) =>
                  handler(e as React.MouseEvent<HTMLButtonElement, MouseEvent>),
              },
        ),
      );
    },
    [setOptions],
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lang = useTriggerLang();

  const showSearch =
    (contextualSearch === 'auto' && options.length > 5) ||
    contextualSearch === true ||
    typeof contextualSearch === 'object';
  const searchPlaceholder =
    typeof contextualSearch === 'object'
      ? contextualSearch.placeholder
      : undefined;

  // Do not use "autoFocus": React calls it before Portal attaches the menu to
  // the document, and focus has no effect on a detached element. Without a
  // search field, the main menu gets the focus, so that the keyboard can
  // move through the options.
  useEffect(() => {
    if (showSearch) {
      searchInputRef.current?.focus();
    } else if (isRoot) {
      menuRef.current?.focus();
    }
  }, [showSearch, isRoot]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (
        isHotkey('escape', event.nativeEvent) ||
        isHotkey('tab', event.nativeEvent)
      ) {
        event.preventDefault();
        event.stopPropagation();

        // Move the focus back to the trigger before the menu closes. Do it
        // here: when the cleanup of an effect runs, React has already
        // removed the menu.
        if (triggerId) {
          document.getElementById(triggerId)?.focus();
        }

        closeMenu();
      }

      if (
        isHotkey('arrowdown', event.nativeEvent) ||
        isHotkey('arrowup', event.nativeEvent)
      ) {
        event.preventDefault();
        event.stopPropagation();

        if (!contentRef.current) return;

        const delta = isHotkey('arrowup', event.nativeEvent) ? -1 : 1;
        const elements = Array.from(
          contentRef.current.querySelectorAll(
            '.Dropdown__menu__option:not(.is-disabled)',
          ),
        );
        const selectedOption = contentRef.current.querySelector(
          '.Dropdown__menu__option.is-selected',
        );
        const index = selectedOption ? elements.indexOf(selectedOption) : -1;
        let nextOption: Element | undefined;

        if (index !== -1) {
          const nextIndex =
            index + delta < 0
              ? elements.length - 1
              : (index + delta) % elements.length;
          nextOption = elements[nextIndex];
        } else {
          nextOption = elements[0];
        }

        selectedOption?.classList.remove('is-selected');

        if (nextOption) {
          nextOption.classList.add('is-selected');
          event.currentTarget.setAttribute(
            'aria-activedescendant',
            nextOption.id,
          );
          nextOption.scrollIntoView({ behavior: 'auto', block: 'nearest' });
        }
      }

      if (isHotkey('enter', event.nativeEvent)) {
        event.preventDefault();
        event.stopPropagation();

        if (!contentRef.current) return;

        const selectedOption = contentRef.current.querySelector(
          '.Dropdown__menu__option.is-selected',
        );
        if (selectedOption) {
          const id = (selectedOption as HTMLButtonElement).dataset.optionId;
          const option = options.find((x) => x.id === id);
          if (option?.handler) {
            option.handler(event);
          }
        }
      }
    },
    [options, closeMenu, triggerId],
  );

  return (
    <MenuPanel
      id={isRoot ? menuId : undefined}
      role="menu"
      aria-labelledby={isRoot ? triggerId : undefined}
      lang={lang}
      tabIndex={-1}
      ref={menuRef}
      onKeyDown={handleKeyDown}
      className={classNames(noOverflowHidden && 'Dropdown__menu--no-overflow')}
      style={
        {
          minWidth: sizeBeforeSearch
            ? `${sizeBeforeSearch.width}px`
            : minWidth
              ? `${minWidth}px`
              : undefined,
          // The menu can be smaller than its height before the search only
          // if the space on the page is now smaller
          minHeight: sizeBeforeSearch
            ? `min(${sizeBeforeSearch.height}px, var(--maxHeight, 100vh))`
            : undefined,
          '--Dropdown-item-padding-y': optionPaddingY
            ? `${optionPaddingY}px`
            : undefined,
        } as React.CSSProperties
      }
    >
      {title && <div className="Dropdown__menu__title">{tc(title)}</div>}
      {showSearch && (
        <div className="Dropdown__menu__search">
          <Generic.SearchIcon />
          <input
            type="text"
            ref={searchInputRef}
            value={searchTerm || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={
              searchPlaceholder ? tm(searchPlaceholder) : t('dropdown.search')
            }
            className="Dropdown__menu__search__input"
          />
        </div>
      )}
      <MenuContext.Provider
        value={{ searchTerm, addOption, setClickHandlerForOption }}
      >
        <div ref={contentRef}>{children}</div>
      </MenuContext.Provider>
    </MenuPanel>
  );
}
