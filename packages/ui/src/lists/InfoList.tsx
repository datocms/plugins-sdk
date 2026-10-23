import classNames from 'classnames';
import React, { ReactNode, useRef } from 'react';
import { useElementLayout } from '../hooks/useElementLayout';
import { useTranslation } from '../i18n';
import { type Message } from '../Message';

export type InfoListProps = {
  className?: string;
  /** The rows (InfoList.Row) and the groups (InfoList.Group) */
  children: ReactNode;
};

// The width from which the value is far from its title
const WIDE_MIN_WIDTH = 600;

// We do not use a container query for the hover of the rows. A size
// container gets a width of zero in a parent that takes the width of its
// content (for example a HoverCard).
function BaseInfoList({ className, children }: InfoListProps) {
  const ref = useRef<HTMLDListElement>(null);
  const { width } = useElementLayout(ref);

  return (
    <dl
      ref={ref}
      className={classNames(
        'InfoList',
        width >= WIDE_MIN_WIDTH && 'InfoList--wide',
        className,
      )}
    >
      {children}
    </dl>
  );
}

export type InfoListRowProps = {
  /** The name of the fact, at the left */
  title: Message;
  /**
   * The value, at the right. A short note about the value goes under it, in
   * the value.
   */
  children: ReactNode;
};

/** A line with a title at the left and its value at the right. */
function Row({ title, children }: InfoListRowProps) {
  const { tc } = useTranslation();
  return (
    <div className="InfoList__row">
      <dt className="InfoList__row__title">{tc(title)}</dt>
      <dd className="InfoList__row__content">{children}</dd>
    </div>
  );
}

export type InfoListGroupProps = {
  /**
   * The title above the rows. It goes to the center when the list is narrow
   * (for example in a side panel).
   */
  title: Message;
  /** The rows of the group */
  children: ReactNode;
};

/** Rows with a title above them, in an InfoList. */
function Group({ title, children }: InfoListGroupProps) {
  const { tc } = useTranslation();
  return (
    <div className="InfoList__group">
      <dt className="InfoList__group__title group-title">{tc(title)}</dt>
      <dd className="InfoList__group__content">
        <dl>{children}</dl>
      </dd>
    </div>
  );
}

/**
 * A list of facts about an element: one row for each fact, with its title
 * and its value. Use InfoList.Row for a row and InfoList.Group for rows
 * with a title. It renders a real description list (dl, dt and dd).
 *
 * Use an InfoList for facts to read. For things that the user acts on (a
 * rule, a webhook), use CardList.
 */
const InfoList = Object.assign(React.memo(BaseInfoList), {
  Row: React.memo(Row),
  Group: React.memo(Group),
});

export default InfoList;
