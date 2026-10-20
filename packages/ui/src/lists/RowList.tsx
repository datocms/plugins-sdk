import useMergedRef from '@react-hook/merged-ref';
import classNames from 'classnames';
import React, { type ReactNode } from 'react';
import Link from '../navigation/Link';
import { DragHandle, type SortableItemApi } from './dnd';

export type RowListProps = {
  /** The rows (RowList.Item) */
  children: ReactNode;
};

/**
 * A list of inset rows in a sidebar, a panel or a dialog. A row opens a page,
 * does an action or only shows its content. For the rows that open the pages
 * of a section, use NavList: it adds the navigation landmark.
 */
function BaseRowList({ children }: RowListProps) {
  return <ul className="RowList">{children}</ul>;
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
   * children of SortableItem (ui/dnd), with `handle` on the SortableItem:
   * the row shows a grip at its left.
   */
  sortable?: SortableItemApi;
  /** The id of the row, for example to scroll it into view */
  id?: string;
  /** The content of the row, usually an EntityRow with layout "row" */
  children: ReactNode;
};

const Item = React.forwardRef<HTMLElement, RowListItemProps>(function Item(
  { to, onClick, selected = false, muted = false, sortable, id, children },
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
    <li id={id}>
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

// No React.memo: the rows get children, thus they render again in all cases
const RowList = Object.assign(BaseRowList, { Item });

export default RowList;
