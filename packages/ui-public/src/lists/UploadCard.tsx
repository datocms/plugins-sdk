import React, { forwardRef, ReactNode, useMemo } from 'react';
import { Generic, Status } from '../../icons/index';
import Button from '../actions/Button';
import { UploadAssetPreview } from '../content/UploadPreview/asset';
import { useAudioPlayback } from '../content/UploadPreview/audio';
import type {
  BoxSize,
  UploadPreviewPadding,
} from '../content/UploadPreview/fit';
import {
  useLoadedUpload,
  useUploadMainLocale,
} from '../content/UploadPreview/presentation';
import {
  type UploadFieldValue,
  type UploadPreviewUpload,
  uploadDefaultMetadata,
} from '../content/UploadPreview/upload';
import { useTranslation } from '../i18n';
import type { Message } from '../Message';
import MediaCard, {
  type MediaCardAction,
  type MediaCardCaption,
  type MediaCardOption,
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

type CardProps = DistributiveOmit<
  MediaCardProps,
  'caption' | 'captionAction' | 'children'
>;

/** Mode "preview": you give the preview and the caption of the asset. */
export type UploadCardPreviewModeProps = CardProps & {
  upload?: never;
  /** The preview of the asset, an `UploadPreview` */
  children: ReactNode;
  /**
   * The text below the preview. Use `uploadCaption` to get it from the
   * metadata of the asset.
   */
  caption?: MediaCardCaption;
  /**
   * The asset uploads. The caption shows in the subtle ink. Without a
   * caption, the caption shows the percent or the analysis.
   */
  progress?: UploadCardProgress;
  /** The antivirus found a threat in the file: the card shows a badge. */
  threatDetected?: boolean;
};

export type { UploadFieldValue } from '../content/UploadPreview/upload';

/**
 * Mode "upload": the card shows an asset of the Media Area, as DatoCMS
 * shows it, with its preview, its caption and the antivirus badge. A sound
 * file gets a play action.
 */
export type UploadCardUploadModeProps = CardProps & {
  /**
   * The asset as `ctx` gives it, or its ID. An ID loads through the
   * provider of the host: `Canvas` mounts it. `null` is an asset that does
   * not exist: the preview shows a blank file icon.
   */
  upload: string | UploadPreviewUpload | null;
  /**
   * The locale of the default metadata of the asset, for the caption, for
   * example the locale of the field. When it has no value, the caption uses
   * the main locale of the project, which the provider of the host gives.
   */
  preferredLocale?: string;
  /**
   * The value of the field that holds the asset. Its title and alternate
   * text come before the default metadata of the asset, and its
   * `poster_time` gives the frame of a video.
   */
  fieldValue?: UploadFieldValue;
  /**
   * The text below the preview. Without it, the card computes it with
   * `uploadCardCaption`. `null` shows no caption.
   */
  caption?: MediaCardCaption | null;
  /** The size of the preview, in px. Without it, the CSS gives the size. */
  box?: BoxSize;
  /** The space around the asset in the preview, as in `UploadPreview`. */
  padding?: UploadPreviewPadding;
  /** The preview is a link. */
  link?: { href: string; target?: string };
  children?: never;
  progress?: never;
  threatDetected?: never;
};

export type UploadCardProps =
  | UploadCardPreviewModeProps
  | UploadCardUploadModeProps;

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

const PreviewModeCard = forwardRef<HTMLDivElement, UploadCardPreviewModeProps>(
  function PreviewModeCard(
    {
      children,
      caption,
      progress,
      threatDetected,
      upload: _,
      ...mediaCardProps
    },
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

/**
 * The caption of an asset in a card, as the gallery field of DatoCMS shows
 * it: the metadata of the value of the field, then the default metadata of
 * the asset in `preferredLocale`, then in `mainLocale`. A sound file falls
 * back to its file name. `UploadCard` takes `mainLocale` from the provider
 * of the host. Give it when you call this function outside a `Canvas`.
 */
export function uploadCardCaption(
  upload: UploadPreviewUpload,
  {
    preferredLocale,
    mainLocale,
    fieldValue,
  }: {
    preferredLocale?: string;
    /** The main locale of the project: the first of `ctx.site.attributes.locales` */
    mainLocale?: string;
    fieldValue?: UploadFieldValue;
  } = {},
): MediaCardCaption {
  const locales = [preferredLocale, mainLocale].filter(
    (locale): locale is string => !!locale,
  );
  const defaults = uploadDefaultMetadata(upload, locales);

  return uploadCaption({
    title: fieldValue?.title,
    alt: fieldValue?.alt,
    defaultTitle: defaults.title,
    defaultAlt: defaults.alt,
    filename: upload.attributes.mime_type?.startsWith('audio/')
      ? upload.attributes.filename
      : null,
  });
}

// A sound file gets a play action: in `actions`, or in `options` on a
// compact card, which has no room for buttons.
function useActionsWithPlay(
  url: string | null,
  {
    actions,
    options,
    compact,
  }: Pick<CardProps, 'actions' | 'options' | 'compact'>,
) {
  const playback = useAudioPlayback(url);
  const { isPlaying, toggle } = playback;

  return useMemo(() => {
    if (!url) {
      return { playback: undefined, actions, options };
    }

    const play: MediaCardAction & MediaCardOption = {
      id: 'play',
      icon: isPlaying ? Status.PauseIcon : Status.PlayIcon,
      label: { id: isPlaying ? 'audioPlayer.pause' : 'audioPlayer.play' },
      onClick: (e) => {
        // The click on the card opens the asset
        e?.stopPropagation();
        toggle();
      },
    };

    return compact
      ? { playback, actions, options: [play, ...(options ?? [])] }
      : { playback, actions: [play, ...(actions ?? [])], options };
  }, [url, playback, isPlaying, toggle, actions, options, compact]);
}

const UploadModeCard = forwardRef<HTMLDivElement, UploadCardUploadModeProps>(
  function UploadModeCard(
    {
      upload: uploadOrId,
      preferredLocale,
      fieldValue,
      caption,
      box,
      padding,
      link,
      ...mediaCardProps
    },
    ref,
  ) {
    const upload = useLoadedUpload(uploadOrId);
    const mainLocale = useUploadMainLocale();
    const attributes = upload?.attributes;
    const audioUrl =
      attributes?.mime_type?.startsWith('audio/') && attributes.url
        ? attributes.url
        : null;
    const { playback, actions, options } = useActionsWithPlay(
      audioUrl,
      mediaCardProps,
    );

    const cardCaption: MediaCardCaption | undefined =
      caption === null
        ? undefined
        : (caption ??
          (upload
            ? uploadCardCaption(upload, {
                preferredLocale,
                mainLocale,
                fieldValue,
              })
            : upload === null && typeof uploadOrId === 'string'
              ? {
                  text: {
                    id: 'uploadCard.fallbackTitle',
                    values: { id: uploadOrId },
                  },
                  muted: true,
                }
              : upload === undefined
                ? { text: { id: 'uploadCard.loading' }, muted: true }
                : undefined));

    const cardProps = { ...mediaCardProps, actions, options } as CardProps;

    return (
      <PreviewModeCard
        {...cardProps}
        ref={ref}
        caption={cardCaption}
        threatDetected={upload?.meta?.antivirus?.status === 'infected'}
      >
        <UploadAssetPreview
          upload={upload}
          box={box}
          padding={padding}
          link={link}
          posterTime={fieldValue?.poster_time ?? undefined}
          audioPlayback={playback}
        />
      </PreviewModeCard>
    );
  },
);

/**
 * The card of an asset: a `MediaCard` with the preview of the asset, its
 * caption, the progress of its upload and the antivirus badge. With
 * `upload`, the card gets them from an asset of the Media Area.
 */
const UploadCard = forwardRef<HTMLDivElement, UploadCardProps>(
  function UploadCard(props, ref) {
    if (props.upload !== undefined) {
      return <UploadModeCard {...props} ref={ref} />;
    }

    return <PreviewModeCard {...props} ref={ref} />;
  },
);

export default UploadCard;
