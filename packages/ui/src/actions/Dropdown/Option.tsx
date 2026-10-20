import mergeRefs from '@react-hook/merged-ref';
import classNames from 'classnames';
import cuid from 'cuid';
import { test } from 'fuzzyjs';
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Generic, Navigation } from '../../../icons/index';
import { InvalidCurrentVersionIcon } from '../../content/ValidityTriangles';
import { SortableItem } from '../../lists/dnd';
import { type Disabled, DisabledReasonTooltip } from '../disabledReason';
import DropdownContext from './DropdownContext';
import MenuContext from './MenuContext';
import { MenuItem, type MenuItemLink } from './MenuParts';

/**
 * The handler of a pick. When it returns a promise and the menu stays open
 * ("closeMenuOnClick" is false), a click out of the menu does not close it
 * until the promise ends.
 */
type PickHandler = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
) => unknown;

/** Runs "onPick" */
type PickAction = {
  /**
   * Runs when the user picks the option (click, tap or Enter). A wrapper
   * can give "undefined": the option then has no action.
   */
  onPick: PickHandler | undefined;
  to?: never;
  href?: never;
  newTab?: never;
};

/**
 * A link to a page of the app. When the page is open, the option gets
 * aria-current="page".
 */
type LinkAction = {
  /** The page of the app that the option opens */
  to: string;
  /** Opens the page in a new tab */
  newTab?: boolean;
  onPick?: never;
  href?: never;
};

/** A link to a page out of the app */
type ExternalLinkAction = {
  /** The URL that the option opens */
  href: string;
  /** Opens the page in a new tab (for example the docs) */
  newTab?: boolean;
  onPick?: never;
  to?: never;
};

/**
 * No action: the option opens a submenu, or it has a checkbox or actions,
 * or it is disabled
 */
type NoAction = {
  onPick?: never;
  to?: never;
  href?: never;
  newTab?: never;
};

/**
 * The action of an option: a pick handler, a page of the app, or a page
 * out of the app. One option has one action.
 */
export type OptionAction =
  | PickAction
  | LinkAction
  | ExternalLinkAction
  | NoAction;

/** The place of an option in a sortable Dropdown.Group */
export type OptionSortable = {
  /**
   * A name that stays the same when the option moves. It is "draggableId"
   * in the drop result.
   */
  id: string;
  /** The position of the option in its group */
  index: number;
};

/** The checkbox of an option */
export type OptionCheckbox = {
  /** The value of the checkbox */
  checked: boolean;
  /** Runs when the user changes the checkbox */
  onChange?: (newValue: boolean) => void;
};

/** The submenu of an option */
export type OptionSubmenu = {
  /** True when the submenu is open */
  open: boolean;
};

export type OptionProps = OptionAction & {
  /**
   * The value that is selected now, in a menu of choices: a check shows
   * before the option. Give "false" to the other options of the menu, so
   * that all the labels line up.
   */
  active?: boolean;
  /** Shows the hover look. Submenu uses it while its menu is open. */
  forceHover?: boolean;
  /**
   * Marks a destructive choice, for example a delete or a remove. The
   * option shows in red. Put it last, after a Dropdown.Separator.
   */
  alert?: boolean;
  /** Shows the triangle of an invalid value after the label */
  invalid?: boolean;
  /** The label of the option */
  children: React.ReactNode;
  /**
   * The user can drag the option to a new position. Give it to the
   * options of a Dropdown.Group with "onDragEnd".
   */
  sortable?: OptionSortable;
  /**
   * With a reason, the option is disabled and its tooltip tells why. With
   * "interactive", the reason has links: it shows in a HoverCard.
   */
  disabled?: Disabled;
  /**
   * Give "false" when the menu must stay open after the pick (for example
   * to pick more values)
   * @default true
   */
  closeMenuOnClick?: boolean;
  /**
   * Shows a checkbox before the label, for a menu of many values. Without
   * an action, a pick of the option changes the checkbox, and the menu
   * stays open. Without "onChange", the checkbox is read-only.
   */
  checkbox?: OptionCheckbox;
  /**
   * The icon before the label. In a menu of actions, give an icon to all
   * the options. In a menu of choices, give no icons.
   */
  icon?: React.ReactNode;
  /**
   * More words that the search field of the menu finds, in addition to the
   * text of the option. For example, "markdown" finds a text field.
   */
  keywords?: string[];
  /**
   * Shows a chevron after the label, and a screen reader tells if the
   * submenu is open. Dropdown.Submenu gives it.
   */
  submenu?: OptionSubmenu;
  /**
   * Icon buttons at the end of the option (Dropdown.OptionAction). With
   * actions, only the label is the target of the click.
   */
  actions?: React.ReactNode;
};

const Option = React.forwardRef<HTMLDivElement, OptionProps>(
  (
    {
      onPick,
      to,
      href,
      newTab,
      active,
      forceHover,
      alert,
      invalid,
      children,
      sortable,
      disabled,
      closeMenuOnClick,
      checkbox,
      actions,
      icon,
      keywords,
      submenu,
    },
    ref,
  ) => {
    const id = useMemo(() => cuid(), []);

    const { searchTerm, addOption, setClickHandlerForOption } =
      useContext(MenuContext);

    const contentRef = useRef<HTMLElement>(null);
    const [innerText, setInnerText] = useState<string>('');

    useEffect(() => {
      if (contentRef.current) {
        setInnerText(contentRef.current.innerText);
      }
    });

    const isDisabled = Boolean(disabled);

    const link = useMemo<MenuItemLink | undefined>(
      () =>
        // A disabled option is not a link: it cannot navigate.
        isDisabled
          ? undefined
          : to !== undefined
            ? { to, newTab }
            : href !== undefined
              ? { href, newTab }
              : undefined,
      [isDisabled, to, href, newTab],
    );

    const className = classNames(
      checkbox && 'has-checkbox',
      forceHover && 'is-hover',
      isDisabled && 'is-disabled',
      invalid && 'is-invalid',
      sortable && 'is-sortable',
      alert && 'is-dangerous',
    );
    const clickable = !actions && !checkbox;
    // Without an action, the option is the checkbox
    const isCheckboxItem = Boolean(checkbox) && !onPick && !link;

    const { closeMenu, setCloseOnClickOutside } = useContext(DropdownContext);

    // Move the highlight to the option below the pointer. The arrow keys of
    // the search field move the same highlight, so the menu shows only one
    // highlighted option.
    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const element = e.currentTarget;

        if (isDisabled || element.classList.contains('is-selected')) {
          return;
        }

        for (const other of Array.from(
          element
            .closest('.Dropdown__menu')
            ?.querySelectorAll('.Dropdown__menu__option.is-selected') ?? [],
        )) {
          other.classList.remove('is-selected');
        }

        element.classList.add('is-selected');
      },
      [isDisabled],
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.classList.remove('is-selected');
      },
      [],
    );

    const handlePick = useCallback(
      async (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Enter on a link: the click of the link navigates and closes the
        // menu
        if (link) {
          contentRef.current?.click();
          return;
        }

        if (isDisabled) {
          return;
        }

        if (!onPick) {
          checkbox?.onChange?.(!checkbox.checked);
          return;
        }

        const keepMenuOpen = closeMenuOnClick === false;

        if (!keepMenuOpen) {
          closeMenu();
        }

        const result = onPick(e as React.MouseEvent<HTMLButtonElement>);

        if (keepMenuOpen && result instanceof Promise) {
          setCloseOnClickOutside(false);
          try {
            await result;
          } finally {
            setCloseOnClickOutside(true);
          }
        }
      },
      [
        link,
        onPick,
        checkbox,
        isDisabled,
        closeMenuOnClick,
        closeMenu,
        setCloseOnClickOutside,
      ],
    );

    // The browser opens the link: a click with Cmd or with the middle button
    // opens it in a new tab
    const handleLinkClick = useCallback(() => {
      if (closeMenuOnClick ?? true) {
        closeMenu();
      }
    }, [closeMenuOnClick, closeMenu]);

    // A click on the padding of the option, out of the link, opens the link
    const handleRowClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const content = contentRef.current;

        if (content && !content.contains(e.target as Node)) {
          content.click();
        }
      },
      [],
    );

    useEffect(() => {
      return addOption(id);
    }, [id]);

    useEffect(() => {
      return setClickHandlerForOption(id, handlePick);
    }, [id, handlePick, setClickHandlerForOption]);

    if (
      innerText &&
      searchTerm &&
      !test(searchTerm, innerText) &&
      !keywords?.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    ) {
      return null;
    }

    const checkboxInput = checkbox && (
      <input
        type="checkbox"
        checked={checkbox.checked}
        disabled={isDisabled}
        readOnly={!checkbox.onChange}
        tabIndex={-1}
        aria-hidden={isCheckboxItem || undefined}
        onChange={(e) => checkbox.onChange?.(e.target.checked)}
      />
    );

    const after = (
      <>
        {submenu && (
          <span className="Dropdown__menu__option__chevron">
            <Navigation.ChevronRightIcon />
          </span>
        )}
        {invalid && (
          <InvalidCurrentVersionIcon className="Dropdown__menu__option__validity_icon" />
        )}
        {actions && (
          <div className="Dropdown__menu__option__icons">{actions}</div>
        )}
      </>
    );

    const contentProps = {
      ...(link
        ? { onClick: handleLinkClick }
        : clickable
          ? undefined
          : { onMouseDown: handlePick, onTouchStart: handlePick }),
      ...(submenu && { 'aria-expanded': submenu.open }),
    };

    const rowProps = link
      ? { onClick: handleRowClick }
      : clickable
        ? { onMouseDown: handlePick, onTouchStart: handlePick }
        : {};

    const option = sortable ? (
      <SortableItem id={sortable.id} index={sortable.index}>
        {({ ref: sortableRef, isDragging, dropIndicator }) => (
          <MenuItem
            className={classNames(className, isDragging && 'is-dragging')}
            active={active}
            clickable={clickable}
            icon={icon}
            data-option-id={id}
            role={isCheckboxItem ? 'menuitemcheckbox' : 'menuitem'}
            aria-checked={isCheckboxItem ? checkbox?.checked : undefined}
            id={id}
            ref={mergeRefs(sortableRef, ref)}
            before={
              <>
                <Generic.DragGripIcon />
                {checkboxInput}
              </>
            }
            after={
              <>
                {after}
                {dropIndicator}
              </>
            }
            contentRef={contentRef}
            contentProps={contentProps}
            link={link}
          >
            {children}
          </MenuItem>
        )}
      </SortableItem>
    ) : (
      <MenuItem
        className={className}
        active={active}
        clickable={clickable}
        icon={icon}
        data-option-id={id}
        role={isCheckboxItem ? 'menuitemcheckbox' : 'menuitem'}
        aria-checked={isCheckboxItem ? checkbox?.checked : undefined}
        id={id}
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...rowProps}
        before={checkboxInput}
        after={after}
        contentRef={contentRef}
        contentProps={contentProps}
        link={link}
      >
        {children}
      </MenuItem>
    );

    return (
      <DisabledReasonTooltip disabled={disabled}>
        {option}
      </DisabledReasonTooltip>
    );
  },
);

export default Option;
