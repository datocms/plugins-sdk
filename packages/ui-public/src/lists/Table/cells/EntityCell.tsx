import React, { type ReactNode } from 'react';
import { useTranslation } from '../../../i18n';
import type { Message } from '../../../Message';

export type EntityCellProps = {
  /**
   * The title of the entity, for example the title of a record or the name
   * of an asset
   */
  title: Message;
  /**
   * The content after the title, for example a status, a validity triangle
   * or the avatars of the users that look at the entity
   */
  afterTitle?: ReactNode;
} & (
  | {
      /**
       * The image before the title, 35px square. Without it, the title starts
       * at the edge of the cell.
       */
      image?: ReactNode;
      preview?: never;
    }
  | {
      /**
       * The preview before the title, with its own size: the thumbnail of an
       * asset
       */
      preview: ReactNode;
      image?: never;
    }
);

/**
 * The title of the entity of a row, with its image, in the first column of a
 * table
 */
export default function EntityCell({
  title,
  image,
  preview,
  afterTitle,
}: EntityCellProps) {
  const { tc } = useTranslation();

  return (
    <div className="EntityCell">
      {image && <div className="EntityCell__image">{image}</div>}
      {preview && <div className="EntityCell__preview">{preview}</div>}
      <div className="EntityCell__title">
        {tc(title)}
        {afterTitle}
      </div>
    </div>
  );
}
