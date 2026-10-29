import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { useTranslation } from '../i18n';
import { type Message } from '../Message';

type CommonProps = {
  /**
   * The image or the icon. It fills a square slot: 20px inline, 32px in a
   * row. Without it, the row has no slot.
   */
  image?: ReactNode;
  /** The title, on one line with an ellipsis. */
  title: Message;
  /**
   * Content after the title, on the same line. For example the validity
   * triangles of a record, a pill or a feedback dot.
   */
  afterTitle?: ReactNode;
  /**
   * A short note after the title, in the subtle ink. For example the ID of a
   * record or the state of a version.
   */
  aside?: Message;
  /**
   * The title shows on up to three lines, not on one line.
   * @default false
   */
  multilineTitle?: boolean;
  /** The content at the end of the row. For example the status of a record. */
  trailing?: ReactNode;
};

export type EntityRowProps = CommonProps &
  (
    | {
        /**
         * "row" shows the kicker above the title and the details below it:
         * a row of a list, an option of a menu, a card.
         */
        layout: 'row';
        /**
         * The line above the title. For a record, it is the model. For
         * example "Netlify".
         */
        kicker?: Message;
        /**
         * The details below the title, small and in the subtle ink. For
         * example a status, a date, a description or the users that edit a
         * record. One line with an ellipsis.
         */
        children?: ReactNode;
      }
    | {
        /**
         * "inline" shows one line: a chip, the value of a select, an entity
         * in a text. It has no kicker and no details.
         */
        layout: 'inline';
        kicker?: never;
        children?: never;
      }
  );

// EntityRow is the shape of RecordRow (see "Records" in
// apps/cms/src/components/AGENTS.md) for things that are not records. EntityRow shows
// only the content: the container gives the surface, the hover and the click
// (an inset row, a menu option, a chip, a card-row).
function EntityRow({
  layout,
  image,
  kicker,
  title,
  afterTitle,
  aside,
  multilineTitle,
  trailing,
  children,
}: EntityRowProps) {
  const { tc } = useTranslation();
  return (
    <span
      className={classNames('EntityRow', `EntityRow--${layout}`, {
        'EntityRow--multiline-title': multilineTitle,
      })}
    >
      {image && <span className="EntityRow__image">{image}</span>}
      <span className="EntityRow__content">
        {kicker && <span className="EntityRow__kicker">{tc(kicker)}</span>}
        <span className="EntityRow__title">
          <span className="EntityRow__title__text">{tc(title)}</span>
          {afterTitle}
          {aside && <span className="EntityRow__aside">{tc(aside)}</span>}
        </span>
        {children && <span className="EntityRow__details">{children}</span>}
      </span>
      {trailing}
    </span>
  );
}

export default React.memo(EntityRow);
