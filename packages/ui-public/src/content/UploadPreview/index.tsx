import React, { forwardRef, type ReactNode } from 'react';
import { UploadAssetPreview } from './asset';
import UploadPreviewBox, { type UploadPreviewBoxProps } from './box';
import type { BoxSize, UploadPreviewPadding } from './fit';
import { useLoadedUpload } from './presentation';
import type { UploadFieldValue, UploadPreviewUpload } from './upload';

export type {
  UploadPreviewImageProps,
  UploadPreviewProgressProps,
} from './box';
export type { BoxSize, UploadPreviewPadding } from './fit';
export type { UploadFieldValue, UploadPreviewUpload } from './upload';

/**
 * Mode "box": you draw the asset in the box, with `UploadPreview.Image`, an
 * icon or a progress bar.
 */
export type UploadPreviewBoxModeProps = UploadPreviewBoxProps & {
  upload?: never;
  fieldValue?: never;
};

/**
 * Mode "upload": the preview draws an asset of the Media Area, as DatoCMS
 * draws it.
 */
export type UploadPreviewUploadModeProps = {
  /**
   * The asset as `ctx` gives it, or its ID. An ID loads through the
   * provider of the host: `Canvas` mounts it. While the asset loads, the box
   * is empty. An asset that does not exist, or `null`, shows a blank file
   * icon.
   */
  upload: string | UploadPreviewUpload | null;
  /**
   * The size of the box in px. The box gets this size. Without it, the CSS
   * of the parent gives the size of the box, and the preview measures it.
   */
  box?: BoxSize;
  /**
   * The space (vertical, horizontal) in px between the box and the asset.
   * An icon always gets space: with `[0, 0]`, an icon gets `[10, 10]`.
   * @default [10, 10]
   */
  padding?: UploadPreviewPadding;
  /** The box has no background, so it shows the background of the parent. */
  transparent?: boolean;
  /** The box is a link. */
  link?: { href: string; target?: string };
  /**
   * The value of the field that holds the asset, as in `UploadCard`. The
   * preview reads its `poster_time`, the frame of a video. When it is not
   * set, the frame is the default of the asset.
   */
  fieldValue?: UploadFieldValue;
  /** More content in the box, over the asset */
  children?: ReactNode;
  fixedSize?: never;
};

export type UploadPreviewProps =
  | UploadPreviewBoxModeProps
  | UploadPreviewUploadModeProps;

const UploadModePreview = forwardRef<HTMLElement, UploadPreviewUploadModeProps>(
  function UploadModePreview({ upload, fieldValue, ...props }, ref) {
    const loaded = useLoadedUpload(upload);

    return (
      <UploadAssetPreview
        {...props}
        ref={ref}
        upload={loaded}
        posterTime={fieldValue?.poster_time ?? undefined}
      />
    );
  },
);

/**
 * The preview of an asset in a box: the asset is in the center, with space
 * around it. With `upload`, the preview draws an asset of the Media Area.
 * Without it, you draw the asset in the box.
 */
const UploadPreview = forwardRef<HTMLElement, UploadPreviewProps>(
  function UploadPreview(props, ref) {
    if (props.upload !== undefined) {
      return <UploadModePreview {...props} ref={ref} />;
    }

    return <UploadPreviewBox {...props} ref={ref} />;
  },
);

export default Object.assign(UploadPreview, {
  Image: UploadPreviewBox.Image,
  Progress: UploadPreviewBox.Progress,
});
