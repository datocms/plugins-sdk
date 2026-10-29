import classNames from 'classnames';
import React from 'react';
import { Generic, UI } from '../../../icons/index';
import { useTranslation } from '../../i18n';
import { type Message } from '../../Message';
import Link from '../../navigation/Link';
import RawButton from '../../semantic/RawButton';

// The presentational parts of a menu. Menu, MenuContent, Group and Option
// render them. A panel that is not a Dropdown (the slash panel of the
// structured text editor) renders them too, so it has the same look. These
// parts have no behavior: the caller gives the state and the events.

type DivProps = React.HTMLAttributes<HTMLDivElement>;

// The floating box that holds a menu panel. It sets the enter and exit
// animation of the panel.
export const MenuContainer = React.memo(
  React.forwardRef<HTMLDivElement, DivProps>(function MenuContainer(
    { className, ...rest },
    ref,
  ) {
    return (
      <div
        {...rest}
        ref={ref}
        className={classNames('Dropdown__menu-container', className)}
      />
    );
  }),
);

// The panel of a menu: the border, the shadow, the padding and the scroll
export const MenuPanel = React.memo(
  React.forwardRef<HTMLDivElement, DivProps>(function MenuPanel(
    { className, ...rest },
    ref,
  ) {
    return (
      <div
        {...rest}
        ref={ref}
        className={classNames('Dropdown__menu', className)}
      />
    );
  }),
);

type MenuGroupProps = {
  title?: Message;
  // An icon before the title, for the kind of the items of the group
  icon?: React.ReactNode;
  children: React.ReactNode;
};

// A group of items with a title that sticks at the top while the items scroll
export const MenuGroup = React.memo(function MenuGroup({
  title,
  icon,
  children,
}: MenuGroupProps) {
  const { tc } = useTranslation();
  return (
    <div className="Dropdown__menu__group">
      <div className="Dropdown__menu__group__title group-title">
        {icon}
        {title && tc(title)}
      </div>
      {children}
    </div>
  );
});

export type MenuSearchProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
>;

// The search field at the top of a menu: the icon and the input. The caller
// gives the value, the placeholder and the events.
export const MenuSearch = React.memo(
  React.forwardRef<HTMLInputElement, MenuSearchProps>(
    function MenuSearch(props, ref) {
      return (
        <div className="Dropdown__menu__search">
          <Generic.SearchIcon />
          <input
            {...props}
            ref={ref}
            type="text"
            className="Dropdown__menu__search__input"
          />
        </div>
      );
    },
  ),
);

// The text that shows when the menu has no item (for example, no item
// matches the search)
export const MenuEmpty = React.memo(function MenuEmpty({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="Dropdown__menu__blank_slate">
      <span>{children}</span>
    </div>
  );
});

// The label of an item is a link: a page of the app ("to") or a page out of
// the app ("href")
export type MenuItemLink =
  | { to: string; newTab?: boolean; href?: never }
  | { href: string; newTab?: boolean; to?: never };

type MenuItemProps = Omit<DivProps, 'children'> & {
  // The item has the highlight of the pointer or of the arrow keys
  selected?: boolean;
  // A check shows on the active item. Do not give it for an item that cannot
  // be active: the item then has no check.
  active?: boolean;
  // The full row is the target of the click (a pointer cursor)
  clickable?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  // Elements before the label (a drag grip, a checkbox)
  before?: React.ReactNode;
  // Elements after the label (a chevron, icons, actions)
  after?: React.ReactNode;
  // The label is a link and not a button
  link?: MenuItemLink;
  contentRef?: React.Ref<HTMLElement>;
  contentProps?: Pick<
    React.HTMLAttributes<HTMLElement>,
    'onClick' | 'onMouseDown' | 'onTouchStart' | 'tabIndex' | 'aria-expanded'
  >;
};

// One row of a menu: the check of the active item, the icon and the label
export const MenuItem = React.memo(
  React.forwardRef<HTMLDivElement, MenuItemProps>(function MenuItem(
    {
      selected,
      active,
      clickable,
      icon,
      children,
      before,
      after,
      contentRef,
      contentProps,
      link,
      className,
      ...rest
    },
    ref,
  ) {
    const content = (
      <>
        {icon}
        {typeof children === 'string' ? <span>{children}</span> : children}
      </>
    );

    return (
      <div
        {...rest}
        ref={ref}
        className={classNames(
          'Dropdown__menu__option',
          icon ? 'has-icon' : null,
          active && 'is-active',
          active !== undefined && 'is-selectable',
          clickable && 'is-clickable-wrapper',
          selected && 'is-selected',
          className,
        )}
      >
        {active !== undefined && (
          <span className="Dropdown__menu__option__indicator">
            {active && <UI.CheckIcon />}
          </span>
        )}
        {before}
        {link?.to !== undefined ? (
          <Link
            {...contentProps}
            to={link.to}
            target={link.newTab ? '_blank' : undefined}
            className="Dropdown__menu__option__content"
            ref={contentRef as React.Ref<HTMLAnchorElement>}
          >
            {content}
          </Link>
        ) : link?.href !== undefined ? (
          <a
            {...contentProps}
            href={link.href}
            target={link.newTab ? '_blank' : undefined}
            rel={link.newTab ? 'noopener noreferrer' : undefined}
            className="Dropdown__menu__option__content"
            ref={contentRef as React.Ref<HTMLAnchorElement>}
          >
            {content}
          </a>
        ) : (
          <RawButton
            {...contentProps}
            className="Dropdown__menu__option__content"
            ref={contentRef as React.Ref<HTMLButtonElement>}
          >
            {content}
          </RawButton>
        )}
        {after}
      </div>
    );
  }),
);
