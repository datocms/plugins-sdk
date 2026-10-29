import classNames from 'classnames';
import React, {
  createContext,
  forwardRef,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import ProgressBar from '../feedback/ProgressBar';
import { useTranslation } from '../i18n';
import type { TextMessage } from '../Message';
import Image from '../semantic/Image';
import {
  type BoxSize,
  DEFAULT_PADDING,
  fitInBox,
  nonImagePadding,
  type UploadPreviewPadding,
} from './uploadPreviewFit';

export type { BoxSize, UploadPreviewPadding } from './uploadPreviewFit';

type BoxContext = { box: BoxSize | null; padding: UploadPreviewPadding };

const UploadPreviewContext = createContext<BoxContext>({
  box: null,
  padding: DEFAULT_PADDING,
});

export type UploadPreviewProps = {
  /**
   * The size of the box in px, for the fit of the asset. A live host
   * measures the box. A static host gives a constant. `null` tells that the
   * size is not known yet: `UploadPreview.Image` then renders nothing.
   */
  box: BoxSize | null;
  /**
   * The box gets the size of `box` as an inline style. Without it, the CSS
   * of the parent gives the size of the box.
   */
  fixedSize?: boolean;
  /**
   * The space (vertical, horizontal) in px between the box and the asset.
   * An icon always gets space: with `[0, 0]`, an icon gets `[10, 10]`.
   * @default [10, 10]
   */
  padding?: UploadPreviewPadding;
  /** The box has no background, thus it shows the background of the parent. */
  transparent?: boolean;
  /** The box is a link to the file. */
  link?: { href: string; target?: string };
  /** The asset: an `UploadPreview.Image`, an icon or a player. */
  children?: ReactNode;
};

/**
 * The box of the preview of an asset: the asset is in the center, with
 * space around it.
 */
const UploadPreview = forwardRef<HTMLElement, UploadPreviewProps>(
  function UploadPreview(
    { box, fixedSize, padding = DEFAULT_PADDING, transparent, link, children },
    ref,
  ) {
    const width = box?.width;
    const height = box?.height;
    const context = useMemo<BoxContext>(
      () => ({
        box:
          width !== undefined && height !== undefined
            ? { width, height }
            : null,
        padding,
      }),
      [width, height, padding],
    );

    const className = classNames('UploadPreview', {
      'UploadPreview--transparent': transparent,
    });
    const style =
      fixedSize && box
        ? { width: `${box.width}px`, height: `${box.height}px` }
        : undefined;

    return (
      <UploadPreviewContext.Provider value={context}>
        {link ? (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={link.href}
            target={link.target}
            className={className}
            style={style}
          >
            {children}
          </a>
        ) : (
          <div
            ref={ref as React.Ref<HTMLDivElement>}
            className={className}
            style={style}
          >
            {children}
          </div>
        )}
      </UploadPreviewContext.Provider>
    );
  },
);

export type UploadPreviewImageProps = {
  /** The URL of the image */
  src: string | undefined;
  /** The real width of the asset, in px */
  width: number;
  /** The real height of the asset, in px */
  height: number;
  /**
   * The image can become larger than its real size, to fill the box. Give
   * it only for a vector image (SVG).
   */
  upscale?: boolean;
  /**
   * The image shows in the place of an icon (for example the poster of a
   * video), thus it always gets space around it, also when the
   * `UploadPreview` has zero padding.
   */
  icon?: boolean;
  /** @default "" */
  alt?: TextMessage;
};

/**
 * The image of the asset, on the checkerboard that shows through its
 * transparent parts. Its size comes from the box and the padding of the
 * `UploadPreview` around it.
 */
function UploadPreviewImage({
  src,
  width,
  height,
  upscale,
  icon,
  alt,
}: UploadPreviewImageProps) {
  const context = useContext(UploadPreviewContext);
  const box = context.box;
  const padding = icon ? nonImagePadding(context.padding) : context.padding;

  if (!box) {
    return null;
  }

  const fit = fitInBox(box, padding, { width, height }, !!upscale);

  return (
    <Image
      src={src}
      className="checkboard-bg"
      style={fit.style}
      alt={alt ?? ''}
      draggable="false"
    />
  );
}

export type UploadPreviewProgressProps = {
  /**
   * The uploaded part, from 0 to 100. At 0 (the transfer did not start) and
   * at 100 (the server analyses the asset), the bar has no value.
   */
  percent: number;
  /**
   * The text above the bar, and the name of the bar. Without it, the name
   * of the bar tells the percent or the analysis.
   */
  label?: TextMessage;
};

/** The progress of the upload, on the bottom edge of the box. */
function UploadPreviewProgress({ percent, label }: UploadPreviewProgressProps) {
  const { tm } = useTranslation();

  return (
    <>
      {label && (
        <div className="UploadPreview__progress__label">{tm(label)}</div>
      )}
      <ProgressBar
        placement="edge"
        value={percent === 0 || percent === 100 ? undefined : percent / 100}
        ariaLabel={
          label ??
          (percent === 100
            ? { id: 'imageMetadata.analyzingUpload' }
            : {
                id: 'imageMetadata.uploadInProgress',
                values: { percent: Math.round(percent) },
              })
        }
      />
    </>
  );
}

export default Object.assign(UploadPreview, {
  Image: UploadPreviewImage,
  Progress: UploadPreviewProgress,
});
