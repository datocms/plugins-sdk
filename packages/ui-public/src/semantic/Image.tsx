import React from 'react';
import { useTranslation } from '../i18n';
import { type TextMessage } from '../Message';

export type ImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'alt'
> & {
  /**
   * What the image shows, for a screen reader. Write `""` when the image only
   * decorates: a text near it already gives the information. Never repeat
   * that text.
   */
  alt: TextMessage;
};

/**
 * An image. The `alt` is required, thus the author has to choose a text or an
 * empty text for a decoration (WCAG 2.1 AA 1.1.1).
 */
export default function Image({ alt, ...props }: ImageProps) {
  const { tm } = useTranslation();

  return <img {...props} alt={tm(alt)} />;
}
