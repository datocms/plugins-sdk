import classNames from 'classnames';
import React from 'react';
import FileTypeIcon from '../../content/FileTypeIcon';

/**
 * The image of a record. "image" is a picture to show in the square, cut to
 * fill it. "file" is a file that is not a picture: the square shows the icon
 * of its extension.
 */
export type RecordRowImage =
  | { type: 'image'; url: string }
  | { type: 'file'; extension: string };

export type RecordRowImageProps = {
  /** The image of the record. Without it, the square is a muted placeholder. */
  image: RecordRowImage | null;
};

/**
 * The image of a record in a square that its container sizes. The image of
 * a `RecordRow`, also alone in a cell or a chip.
 */
function Image({ image }: RecordRowImageProps) {
  if (image?.type === 'file') {
    return (
      <FileTypeIcon extension={image.extension} className="RecordRow__image" />
    );
  }

  return (
    <div
      className={classNames('RecordRow__image', {
        'RecordRow__image--placeholder': !image,
      })}
      style={image ? { backgroundImage: `url(${image.url})` } : undefined}
    />
  );
}

export default React.memo(Image);
