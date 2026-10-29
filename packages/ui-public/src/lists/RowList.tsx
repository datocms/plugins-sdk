import useMergedRef from '@react-hook/merged-ref';
import classNames from 'classnames';
import React, { type ReactNode } from 'react';
import Link from '../navigation/Link';
import { DragHandle, type SortableItemApi } from './dnd';

export type RowListProps = {
  /**
   * The space around the rows. "default" puts the list at the edge of a
   * sidebar or of a dialog: the list gives the inset of the content.
   * "compact" is for a list in a container that already has an inset (a
   * SidebarPanel): the image and the text of a row stay on the edge of the
   * content of the container, and the box of the row goes out of it.
   * @default "default"
   */
  density?: 'default' | 'compact';
  /** Only for the place of the list in its container (a margin), not for its look */
  className?: string;
  /** The rows (RowList.Item) */
  children: ReactNode;
};

/**
 * A list of inset rows in a sidebar, a panel or a dialog. A row opens a page,
 * does an action or only shows its content. For the rows that open the pages
 * of a section, use NavList: it adds the navigation landmark.
 */
function BaseRowList({
  density = 'default',
  className,
  children,
}: RowListProps) {
  return (
    <ul
      className={classNames(
        'RowList',
        { 'RowList--compact': density === 'compact' },
        className,
      )}
    >
      {children}
    </ul>
  );
}

/** The row opens a page of the app. It is selected while the page is open. */
type LinkRow = {
  /** The page of the app: the path with its query */
  to: string;
  /** Runs on a click, before the page opens */
  onClick?: () => void;
  selected?: never;
};

/** The row is a button */
type ButtonRow = {
  onClick: () => void;
  /**
   * The row shows the selected state, for example the version that the
   * page shows
   * @default false
   */
  selected?: boolean;
  to?: never;
};

/** The row only shows its content */
type StaticRow = {
  /** @default false */
  selected?: boolean;
  to?: never;
  onClick?: never;
};

/** What the row does on a click */
export type RowListItemAction = LinkRow | ButtonRow | StaticRow;

export type RowListItemProps = RowListItemAction & {
  /**
   * The text of the row is subtle and its images fade, but the user can
   * still open it. Use it for an element that is off (for example a
   * disabled plugin), with a Pill that tells it.
   * @default false
   */
  muted?: boolean;
  /**
   * The user can drag the row to a new position. Give the argument of the
   * children of SortableItem (ui-public/dnd), with `handle` on the SortableItem:
   * the row shows a grip at its left.
   */
  sortable?: SortableItemApi;
  /** The id of the row, for example to scroll it into view */
  id?: string;
  /**
   * A class on the list item of the row. Only for its place in the list
   * (for example to hide it), not for its look.
   */
  className?: string;
  /** The content of the row, usually an EntityRow with layout "row" */
  children: ReactNode;
};

const Item = React.forwardRef<HTMLElement, RowListItemProps>(function Item(
  {
    to,
    onClick,
    selected = false,
    muted = false,
    sortable,
    id,
    className: itemClassName,
    children,
  },
  forwardedRef,
) {
  const ref = useMergedRef<HTMLElement>(
    forwardedRef,
    (sortable?.ref ?? null) as React.Ref<HTMLElement>,
  );

  const className = classNames('RowList__item', {
    'RowList__item--muted': muted,
    'RowList__item--sortable': sortable,
    'RowList__item--dragging': sortable?.isDragging,
  });

  const content = (
    <>
      {sortable && (
        <DragHandle
          ref={sortable.handleRef}
          gutter="normal"
          className="RowList__handle"
        />
      )}
      <div className="RowList__content">{children}</div>
      {sortable?.dropIndicator}
    </>
  );

  // A link gets aria-current="page" when its page is open. A button or a
  // plain row gets aria-current="true" when it is selected: the CSS gives
  // the selected look to both values.
  const current = selected ? 'true' : undefined;

  return (
    <li id={id} className={itemClassName}>
      {to ? (
        <Link ref={ref} to={to} className={className} onClick={onClick}>
          {content}
        </Link>
      ) : onClick ? (
        // A div and not a button: a button cannot contain the blocks of an
        // EntityRow
        <div
          ref={ref}
          role="button"
          tabIndex={0}
          className={className}
          aria-current={current}
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClick();
            }
          }}
        >
          {content}
        </div>
      ) : (
        <div ref={ref} className={className} aria-current={current}>
          {content}
        </div>
      )}
    </li>
  );
});

export type RowListActionsProps = {
  /**
   * When the actions show. With "hover", they show only when the pointer or
   * the focus is on the row, or when a menu of the actions is open (on
   * devices without a pointer, always). "always" is for a picture of the
   * row with an open tooltip or menu.
   * @default "hover"
   */
  visibility?: 'hover' | 'always';
  /** The buttons of the row: ghost buttons with only an icon */
  children: ReactNode;
};

/**
 * The buttons at the end of a row that only shows its content. Put it in
 * the trailing of the EntityRow. A row with `to` or `onClick` cannot hold
 * it: a button cannot be inside a link or a button.
 */
function Actions({ visibility = 'hover', children }: RowListActionsProps) {
  return (
    <span
      className={classNames('RowList__actions', {
        'RowList__actions--always': visibility === 'always',
      })}
    >
      {children}
    </span>
  );
}

// No React.memo: the rows get children, thus they render again in all cases
const RowList = Object.assign(BaseRowList, { Item, Actions });

export default RowList;
