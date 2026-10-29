import React, { forwardRef, ReactNode } from 'react';
import { Generic, Status } from '../../icons/index';
import Button from '../actions/Button';
import { useTranslation } from '../i18n';
import type { Message } from '../Message';
import MediaCard, {
  type MediaCardCaption,
  type MediaCardProps,
} from './MediaCard';

type DistributiveOmit<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, K>
  : never;

/** The upload of the asset, while it is in progress */
export type UploadCardProgress = {
  /**
   * The uploaded part, from 0 to 100. At 100 the server analyses the
   * asset.
   */
  percent: number;
  /**
   * Cancels the upload. With it, the caption shows a cancel button while
   * the transfer is in progress. A card with a checkbox has no cancel
   * button.
   */
  onCancel?: (event: React.MouseEvent) => void;
};

export type UploadCardProps = DistributiveOmit<
  MediaCardProps,
  'caption' | 'captionAction' | 'children'
> & {
  /** The preview of the asset, an `UploadPreview` */
  children: ReactNode;
  /**
   * The text below the preview. Use `uploadCaption` to get it from the
   * metadata of the asset.
   */
  caption?: MediaCardCaption;
  /**
   * The asset uploads. The caption shows in the subtle ink. Without a
   * caption, the caption tells the percent or the analysis.
   */
  progress?: UploadCardProgress;
  /** The antivirus found a threat in the file: the card shows a badge. */
  threatDetected?: boolean;
};

/** The metadata of an asset that give its caption */
export type UploadCaptionMetadata = {
  /** The title of the asset in the record */
  title?: string | null;
  /** The alternate text of the asset in the record */
  alt?: string | null;
  /** The default title of the asset, in the media area */
  defaultTitle?: string | null;
  /** The default alternate text of the asset, in the media area */
  defaultAlt?: string | null;
  /** The name of the file. Give it only when it is the best name (audio). */
  filename?: string | null;
};

/**
 * The caption of an asset: the first of the title, the alternate text,
 * the default alternate text, the default title and the file name, else
 * "No metadata set". The caption is muted when the metadata has no `title`
 * or no `defaultTitle`.
 */
export function uploadCaption({
  title,
  alt,
  defaultTitle,
  defaultAlt,
  filename,
}: UploadCaptionMetadata): MediaCardCaption {
  return {
    text: title ||
      alt ||
      defaultAlt ||
      defaultTitle ||
      filename || { id: 'imageMetadata.noMetadata' },
    muted: !(title && defaultTitle),
  };
}

function hasCheckbox<P extends { selection?: { checkbox?: unknown } }>(
  props: P,
): props is Extract<P, { selection: { checkbox: 'hover' | 'always' } }> {
  return !!props.selection?.checkbox;
}

/**
 * The card of an asset: a `MediaCard` with the preview of the asset, its
 * caption, the progress of its upload and the antivirus badge.
 */
const UploadCard = forwardRef<HTMLDivElement, UploadCardProps>(
  function UploadCard(
    { children, caption, progress, threatDetected, ...mediaCardProps },
    ref,
  ) {
    const { tm } = useTranslation();

    const progressText: Message | undefined = progress
      ? progress.percent < 100
        ? {
            id: 'imageMetadata.uploadInProgress',
            values: { percent: Math.round(progress.percent) },
          }
        : { id: 'imageMetadata.analyzingUpload' }
      : undefined;
    const cardCaption: MediaCardCaption | undefined = progressText
      ? { text: caption?.text ?? progressText, muted: true }
      : caption;

    const onCancel = progress?.onCancel;
    const captionAction =
      progress && !caption && progress.percent < 100 && onCancel ? (
        <Button
          tone="ghost"
          size="micro"
          iconOnly
          icon={Generic.CloseIcon}
          label={{ id: 'imageMetadata.cancelUpload' }}
          onClick={(e) => {
            // The click on the caption selects the card
            e.stopPropagation();
            onCancel(e);
          }}
        />
      ) : undefined;

    // A card with a checkbox has no cancel button: the checkbox takes its
    // place. An upload in progress has no checkbox.
    const cardProps: MediaCardProps = hasCheckbox(mediaCardProps)
      ? mediaCardProps
      : { ...mediaCardProps, captionAction };

    const threatLabel = tm({ id: 'upload.threatDetected' });

    return (
      <MediaCard {...cardProps} ref={ref} caption={cardCaption}>
        {threatDetected && (
          <div className="UploadCard__antivirus-badge" title={threatLabel}>
            <Status.BanIcon />
            <span>{threatLabel}</span>
          </div>
        )}
        {children}
      </MediaCard>
    );
  },
);

export default UploadCard;
