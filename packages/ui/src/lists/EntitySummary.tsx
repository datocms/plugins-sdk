import React, { ReactNode } from 'react';
import { useTranslation } from '../i18n';
import { type Message } from '../Message';

export type EntitySummaryProps = {
  /** The icon of the thing, before its title. */
  icon: ReactNode;
  /** The name of the thing. */
  title: Message;
  /**
   * The URL of an image that shows the thing, below the title. The image is
   * decorative: it has no alternative text.
   */
  imageUrl?: string | null;
  /** The text that explains the thing, below the image. */
  description?: Message;
};

// The icon and the name of a thing, its image and its description: the
// content of a HoverCard. It draws no surface.
export default function EntitySummary({
  icon,
  title,
  imageUrl,
  description,
}: EntitySummaryProps) {
  const { tc } = useTranslation();
  return (
    <div className="EntitySummary">
      <div className="EntitySummary__header">
        {icon}
        <span>{tc(title)}</span>
      </div>
      {imageUrl && (
        <img className="EntitySummary__image" src={imageUrl} alt="" />
      )}
      {description && (
        <p className="EntitySummary__description">{tc(description)}</p>
      )}
    </div>
  );
}
